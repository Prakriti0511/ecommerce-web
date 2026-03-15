const Product = require("../models/Product");

// get all products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// get single product
exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

// create product
exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  const saved = await product.save();
  res.json(saved);
};

// new arrivals
exports.getNewArrivals = async (req, res) => {
  const products = await Product.find({ isNewArrival: true });
  res.json(products);
};

// best sellers
exports.getBestSellers = async (req, res) => {
  const products = await Product.find({ isBestSeller: true });
  res.json(products);
};