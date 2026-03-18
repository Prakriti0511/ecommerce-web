import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems: cart.items,
      totalPrice: 100 // temporary (we'll calculate later)
    });

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Order failed" });
  }
};