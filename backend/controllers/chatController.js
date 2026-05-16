/**
 * Chatbot controller: extract intent → query MongoDB → generate reply with OpenAI.
 */

import Product from "../models/product.js";
import { buildProductFilter, PRODUCT_RECOMMENDATION_SORT } from "../utils/chatFilterBuilder.js";
import {
  extractShoppingIntent,
  applyKeywordIntentOverrides,
  generateRecommendationResponse,
  serializeProductsForAi,
} from "../services/ai/chatAiService.js";

const MAX_PRODUCTS = 20;

/**
 * POST /api/chat
 * Body: { message: string }
 * Response: { aiMessage: string, products: [] }
 */
export async function postChat(req, res) {
  try {
    const userMessage = req.body?.message ?? req.body?.text ?? "";

    if (typeof userMessage !== "string" || !userMessage.trim()) {
      return res.status(400).json({
        aiMessage: "Please type a question or what you are looking for.",
        products: [],
      });
    }

    // --- 1) Structured intent from OpenAI (with fallback defaults on failure)
    const { intent: rawIntent, extractionError } = await extractShoppingIntent(userMessage);

    // --- 2) Keyword rules (bestseller / new arrival)
    let intent = applyKeywordIntentOverrides(userMessage, rawIntent);

    // --- 3) Mongo filter + fetch
    const filter = buildProductFilter(intent);
    let products = await Product.find(filter)
      .sort(PRODUCT_RECOMMENDATION_SORT)
      .limit(MAX_PRODUCTS)
      .lean();

    // --- 4) If nothing matched but we had strict filters, optional soft retry (empty filter) — skip to avoid irrelevant results
    // Instead: keep empty and let AI explain — user asked for explicit behavior on no products

    const serialized = serializeProductsForAi(products);

    // --- 5) Conversational reply (must only reference serialized products)
    const { message: aiMessage, responseError } = await generateRecommendationResponse(
      userMessage,
      serialized
    );

    // Log non-fatal issues in dev (optional)
    if (extractionError) {
      console.warn("[postChat] extraction warning:", extractionError);
    }
    if (responseError) {
      console.warn("[postChat] response warning:", responseError);
    }

    return res.json({
      aiMessage,
      products: serialized,
    });
  } catch (err) {
    console.error("[postChat]", err);
    return res.status(500).json({
      aiMessage: "Something went wrong while processing your request. Please try again in a moment.",
      products: [],
    });
  }
}
