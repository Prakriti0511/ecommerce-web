import mongoose from "mongoose";

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

  /** Optional — used by recommendation chatbot filters */
  brand: String,

  tags: [String],

  /** e.g. ["dry", "oily", "sensitive", "combination", "normal"] */
  skinType: [String],

  /** e.g. ["acne", "aging", "dark spots"] */
  concerns: [String],

  /** e.g. ["niacinamide", "vitamin c", "hyaluronic acid"] */
  ingredients: [String],

  image: String,

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

const Product = mongoose.model("Product", productSchema);

export default Product;