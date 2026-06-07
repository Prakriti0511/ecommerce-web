import Cart from "../models/cartModel.js";
import Product from "../models/product.js";

function serializeCartItem(item) {
  const product = item.product;
  if (!product || typeof product !== "object") return null;

  return {
    productId: String(product._id),
    quantity: item.quantity,
    product: {
      id: String(product._id),
      name: product.name,
      price: product.price,
      image: product.image || "",
      stock: product.stock ?? 0,
      category: product.category || "",
    },
  };
}

function serializeCart(cart) {
  if (!cart) {
    return { items: [], itemCount: 0, total: 0 };
  }

  const items = (cart.items || [])
    .map(serializeCartItem)
    .filter(Boolean);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.quantity * (i.product.price || 0), 0);

  return { items, itemCount, total };
}

async function findPopulatedCart(userId) {
  return Cart.findOne({ user: userId }).populate("items.product");
}

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const cart = await findPopulatedCart(req.user.id);
    res.json(serializeCart(cart));
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const qty = Math.max(1, Number(quantity) || 1);

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity: qty }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
      } else {
        cart.items.push({ product: productId, quantity: qty });
      }

      await cart.save();
    }

    const populated = await findPopulatedCart(req.user.id);
    res.json(serializeCart(populated));
  } catch (error) {
    res.status(500).json({
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// UPDATE ITEM QUANTITY
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity);

  if (!productId || !Number.isFinite(qty) || qty < 1) {
    return res.status(400).json({ message: "Valid productId and quantity (>= 1) required" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(400).json({ message: "Item not in cart" });
    }

    cart.items[itemIndex].quantity = qty;
    await cart.save();

    const populated = await findPopulatedCart(req.user.id);
    res.json(serializeCart(populated));
  } catch (error) {
    res.status(500).json({
      message: "Error updating cart",
      error: error.message,
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
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const populated = await findPopulatedCart(req.user.id);
    res.json(serializeCart(populated));
  } catch (error) {
    res.status(500).json({
      message: "Error removing item",
      error: error.message,
    });
  }
};