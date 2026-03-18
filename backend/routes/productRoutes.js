import express from "express";
import productController from "../controller/productController.js";

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get("/new-arrivals", productController.getNewArrivals);

router.get("/best-sellers", productController.getBestSellers);

router.get("/:id", productController.getProductById);

router.post("/", productController.createProduct);

export default router;