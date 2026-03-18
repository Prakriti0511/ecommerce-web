import Product from "../models/product.js";

// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// new arrivals
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// best sellers
const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productController = {
  getAllProducts,
  getNewArrivals,
  getBestSellers,
  getProductById,
  createProduct
};

export default productController;