/**
 * OpenAI helpers for the skincare chatbot:
 * 1) Extract structured intent from natural language
 * 2) Turn DB-backed products into a friendly reply (no hallucinated products)
 */

import OpenAI from "openai";

/** Lazy client so the server can boot without OPENAI_API_KEY (fallbacks still work). */
function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

/** Default shape when extraction fails or fields are missing */
export const DEFAULT_SHOPPING_INTENT = {
  category: "",
  skinType: [],
  concerns: [],
  ingredients: [],
  tags: [],
  brand: "",
  budget: null,
  bestseller: false,
  newArrival: false,
};

const EXTRACTION_SYSTEM = `You are a shopping-intent extractor for a skincare e-commerce site.
Given the user's message, output a single JSON object with these keys (use empty string, empty array, null, or false when unknown):

{
  "category": "",
  "skinType": [],
  "concerns": [],
  "ingredients": [],
  "tags": [],
  "brand": "",
  "budget": null,
  "bestseller": false,
  "newArrival": false
}

Rules:
- category: product type e.g. "moisturizer", "serum", "cleanser", "sunscreen", "toner", "mask", or "".
- skinType: lowercase tokens e.g. "dry", "oily", "combination", "sensitive", "normal".
- concerns: e.g. "acne", "aging", "fine lines", "dark spots", "hyperpigmentation", "redness".
- ingredients: e.g. "niacinamide", "vitamin c", "hyaluronic acid", "retinol".
- tags: marketing or theme words if implied e.g. "vegan", "fragrance-free".
- brand: exact or partial brand name if mentioned, else "".
- budget: maximum price as a NUMBER only if user gives a numeric limit (e.g. "under 1000" → 1000). Otherwise null. Ignore currency words if no number.
- bestseller: true only if user clearly wants bestsellers, trending, or most popular (you may set true; the server will also detect keywords).
- newArrival: true only if user clearly wants new / latest / just launched items.

Respond with JSON only, no markdown.`;

const RESPONSE_SYSTEM = `You are a helpful skincare shopping assistant for an online store.

You will receive:
1) The user's original question
2) A JSON array of products that EXIST in the database (this is the complete truth — there are no other products).

Rules:
- Recommend ONLY from the provided products. Never invent names, prices, or features.
- If the list is empty, apologize briefly and suggest broadening the search (e.g. different budget, category, or concern).
- If there are products, briefly explain why 1–3 of them fit the user's needs using only their real fields (name, category, skin types, concerns, ingredients, price, rating).
- Keep the tone warm and concise (under ~120 words unless many items).
- Do not number products as if there are more than provided.`;

/**
 * Merge partial extraction into defaults (arrays always arrays, etc.)
 */
function normalizeIntent(raw) {
  const base = { ...DEFAULT_SHOPPING_INTENT };
  if (!raw || typeof raw !== "object") return base;

  if (typeof raw.category === "string") base.category = raw.category;
  if (Array.isArray(raw.skinType)) base.skinType = raw.skinType.map(String).filter(Boolean);
  if (Array.isArray(raw.concerns)) base.concerns = raw.concerns.map(String).filter(Boolean);
  if (Array.isArray(raw.ingredients)) base.ingredients = raw.ingredients.map(String).filter(Boolean);
  if (Array.isArray(raw.tags)) base.tags = raw.tags.map(String).filter(Boolean);
  if (typeof raw.brand === "string") base.brand = raw.brand;

  if (raw.budget != null) {
    const n = Number(raw.budget);
    if (!Number.isNaN(n)) base.budget = n;
  }

  if (raw.bestseller === true) base.bestseller = true;
  if (raw.newArrival === true) base.newArrival = true;

  return base;
}

/**
 * Keyword overrides: OR with AI flags when user clearly uses these phrases.
 */
export function applyKeywordIntentOverrides(userMessage, intent) {
  const msg = String(userMessage || "");
  const next = { ...intent };

  if (/\b(best|popular|trending|bestseller|best[\s-]?selling)\b/i.test(msg)) {
    next.bestseller = true;
  }
  if (/\b(new|latest|recent\s+arrivals?|just\s+launched|brand[\s-]?new)\b/i.test(msg)) {
    next.newArrival = true;
  }

  return next;
}

/**
 * Parse JSON from model output (strips accidental markdown fences).
 */
function safeParseJson(text) {
  let t = String(text || "").trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  }
  return JSON.parse(t);
}

/**
 * @returns {{ intent: object, extractionError: string | null }}
 */
export async function extractShoppingIntent(userMessage) {
  const client = getOpenAIClient();
  if (!client) {
    return {
      intent: normalizeIntent({}),
      extractionError: "OPENAI_API_KEY is not configured.",
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EXTRACTION_SYSTEM },
        { role: "user", content: String(userMessage || "").slice(0, 4000) },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content;
    const parsed = safeParseJson(raw);
    const intent = normalizeIntent(parsed);
    return { intent, extractionError: null };
  } catch (err) {
    console.error("[chatAiService] extractShoppingIntent:", err.message);
    return {
      intent: normalizeIntent({}),
      extractionError: err.message || "Intent extraction failed.",
    };
  }
}

/**
 * Strip Mongoose internals and keep a safe payload for the client + model.
 */
export function serializeProductsForAi(products) {
  return products.map((p) => ({
    id: String(p._id),
    name: p.name,
    description: p.description || "",
    category: p.category || "",
    brand: p.brand || "",
    price: p.price,
    skinType: p.skinType || [],
    concerns: p.concerns || [],
    ingredients: p.ingredients || [],
    tags: p.tags || [],
    rating: p.rating ?? 0,
    numReviews: p.numReviews ?? 0,
    isBestSeller: !!p.isBestSeller,
    isNewArrival: !!p.isNewArrival,
    stock: p.stock ?? 0,
    image: p.image || "",
  }));
}

/**
 * @returns {{ message: string, responseError: string | null }}
 */
export async function generateRecommendationResponse(userMessage, productsSerialized) {
  const client = getOpenAIClient();
  if (!client) {
    return {
      message:
        productsSerialized.length === 0
          ? "I could not search products right now. Please try again later."
          : "Here are some options that matched your search.",
      responseError: "OPENAI_API_KEY is not configured.",
    };
  }

  const userPayload = {
    userMessage: String(userMessage || ""),
    products: productsSerialized,
  };

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: RESPONSE_SYSTEM },
        {
          role: "user",
          content: JSON.stringify(userPayload),
        },
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return { message: fallbackMessage(productsSerialized.length), responseError: "Empty model response." };
    }
    return { message: text, responseError: null };
  } catch (err) {
    console.error("[chatAiService] generateRecommendationResponse:", err.message);
    return {
      message: fallbackMessage(productsSerialized.length),
      responseError: err.message || "OpenAI response generation failed.",
    };
  }
}

function fallbackMessage(count) {
  if (count === 0) {
    return "I couldn't find products that match those filters. Try a broader search or different keywords.";
  }
  return `I found ${count} product(s) that may work for you. Browse the list below for details.`;
}
