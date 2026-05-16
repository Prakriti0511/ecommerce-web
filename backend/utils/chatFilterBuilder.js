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

/**
 * @param {object} intent — normalized shopping intent from AI + keyword rules
 * @returns {object} Mongoose filter
 */
export function buildProductFilter(intent) {
  const clauses = [];

  if (intent.category?.trim()) {
    clauses.push({
      category: new RegExp(escapeRegex(intent.category.trim()), "i"),
    });
  }

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
