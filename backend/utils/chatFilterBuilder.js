/**
 * Builds a MongoDB / Mongoose filter from structured shopping intent.
 * Maps API intent fields to your Product schema (e.g. bestseller → isBestSeller).
 */

/** Escape special regex characters in user-provided strings */
export function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * For array fields on Product (skinType, concerns, ingredients, tags):
 * each value must appear on at least one array element (case-insensitive).
 * Multiple values are ANDed (e.g. dry + sensitive).
 */
function andRegexConditions(fieldName, values) {
  if (!values?.length) return null;
  return values.map((v) => {
    const trimmed = String(v).trim();
    if (!trimmed) return null;
    return { [fieldName]: new RegExp(escapeRegex(trimmed), "i") };
  }).filter(Boolean);
}

/** Detect product-type words directly from the user's message */
const CATEGORY_QUERY_PATTERNS = [
  { pattern: /\b(moisturiz(?:er|ers|ing)|moisturis(?:er|ers|ing)|face\s+creams?|hydrating\s+creams?|lotions?)\b/i, term: "moisturizer" },
  { pattern: /\b(serums?|essences?|ampoules?)\b/i, term: "serum" },
  { pattern: /\b(cleansers?|face\s+wash(?:es)?|cleansing\s+wash(?:es)?)\b/i, term: "cleanser" },
  { pattern: /\b(sunscreens?|sun\s*blocks?|spf\s*\d*|sun\s+creams?)\b/i, term: "sunscreen" },
  { pattern: /\b(toners?|toning)\b/i, term: "toner" },
  { pattern: /\b(masks?|masques?)\b/i, term: "mask" },
  { pattern: /\b(shampoos?)\b/i, term: "shampoo" },
];

/** Map common synonyms to a canonical category token for regex matching */
const CATEGORY_SYNONYMS = {
  moisturizer: ["moisturizer", "moisturiser", "cream", "lotion", "hydrating cream"],
  serum: ["serum", "essence", "ampoule"],
  cleanser: ["cleanser", "face wash", "cleansing", "wash"],
  sunscreen: ["sunscreen", "spf", "sun block", "sunblock", "sun cream"],
  toner: ["toner", "toning"],
  mask: ["mask", "masque"],
  shampoo: ["shampoo"],
};

/**
 * Pull product-type category from raw query text (works without OpenAI).
 */
export function extractCategoryFromMessage(message) {
  const msg = String(message || "");
  for (const { pattern, term } of CATEGORY_QUERY_PATTERNS) {
    if (pattern.test(msg)) return term;
  }
  return "";
}

function normalizeCategoryTerm(raw) {
  const term = String(raw || "").trim().toLowerCase();
  if (!term) return "";

  for (const [canonical, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (synonyms.some((s) => term.includes(s) || s.includes(term))) {
      return canonical;
    }
  }
  return term;
}

function categorySearchTerms(rawCategory) {
  const normalized = normalizeCategoryTerm(rawCategory);
  if (!normalized) return [];

  const synonyms = CATEGORY_SYNONYMS[normalized] || [normalized];
  return [...new Set([normalized, ...synonyms].map((t) => t.trim().toLowerCase()).filter(Boolean))];
}

/**
 * Match category intent against category, product title (name), description, and tags.
 * Uses all synonyms so e.g. "moisturizer" also matches products named "Face Cream".
 */
function buildCategoryClause(rawCategory) {
  const terms = categorySearchTerms(rawCategory);
  if (!terms.length) return null;

  const fields = ["category", "name", "description", "tags"];
  const orConditions = [];

  for (const field of fields) {
    for (const term of terms) {
      orConditions.push({ [field]: new RegExp(escapeRegex(term), "i") });
    }
  }

  return { $or: orConditions };
}

/**
 * @param {object} intent — normalized shopping intent from AI + keyword rules
 * @param {string} [userMessage] — raw query; category is detected from this first
 * @returns {object} Mongoose filter
 */
export function buildProductFilter(intent, userMessage = "") {
  const clauses = [];

  const category =
    extractCategoryFromMessage(userMessage) || intent.category?.trim() || "";
  const categoryClause = buildCategoryClause(category);
  if (categoryClause) clauses.push(categoryClause);

  const skin = andRegexConditions("skinType", intent.skinType);
  if (skin?.length) clauses.push(...skin);

  const concerns = andRegexConditions("concerns", intent.concerns);
  if (concerns?.length) clauses.push(...concerns);

  const ingredients = andRegexConditions("ingredients", intent.ingredients);
  if (ingredients?.length) clauses.push(...ingredients);

  const tags = andRegexConditions("tags", intent.tags);
  if (tags?.length) clauses.push(...tags);

  if (intent.brand?.trim()) {
    clauses.push({
      brand: new RegExp(escapeRegex(intent.brand.trim()), "i"),
    });
  }

  if (intent.budget != null && typeof intent.budget === "number" && !Number.isNaN(intent.budget)) {
    clauses.push({ price: { $lte: intent.budget } });
  }

  if (intent.bestseller === true) {
    clauses.push({ isBestSeller: true });
  }

  if (intent.newArrival === true) {
    clauses.push({ isNewArrival: true });
  }

  if (clauses.length === 0) {
    return {};
  }

  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

/**
 * Sort: bestsellers first, then new arrivals, then highest rating.
 */
export const PRODUCT_RECOMMENDATION_SORT = {
  isBestSeller: -1,
  isNewArrival: -1,
  rating: -1,
};
