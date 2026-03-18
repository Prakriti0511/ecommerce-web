import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/", protect, removeFromCart);

export default router;