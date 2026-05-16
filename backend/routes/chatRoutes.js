import express from "express";
import { postChat } from "../controllers/chatController.js";

const router = express.Router();

/**
 * Skincare recommendation chatbot
 * POST /api/chat  { "message": "..." }
 */
router.post("/", postChat);

export default router;
