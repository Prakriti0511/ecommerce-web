import mongoose from "mongoose";
import User from "../models/userModel.js";

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const wishlistIds = (user.wishlist ?? []).map((id) => id.toString());
    return res.json({ wishlistIds });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = user.wishlist ?? [];
    const idx = list.findIndex((id) => id.toString() === productId);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(new mongoose.Types.ObjectId(productId));
    }
    user.wishlist = list;
    await user.save();

    const wishlistIds = user.wishlist.map((id) => id.toString());
    const inWishlist = idx === -1;
    return res.json({ wishlistIds, inWishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
