import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/product.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ message: "Product not found" });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.product.name}` 
        });
      }
      totalPrice += item.product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems: cart.items,
      totalPrice
    });

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ 
      message: "Order failed", 
      error: error.message 
    });
  }
};