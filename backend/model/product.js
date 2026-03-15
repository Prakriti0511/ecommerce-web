const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: String,

  price: {
    type: Number,
    required: true
  },

  category: String,

  images: [String],

  stock: {
    type: Number,
    default: 0
  },

  isNewArrival: {
    type: Boolean,
    default: false
  },

  isBestSeller: {
    type: Boolean,
    default: false
  },

  rating: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);