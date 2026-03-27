import Cart from "../models/cartModel.js";
import Product from "../models/product.js";

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching cart", 
      error: error.message 
    });
  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Error adding to cart", 
      error: error.message 
    });
  }
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Error removing item", 
      error: error.message 
    });
  }
};