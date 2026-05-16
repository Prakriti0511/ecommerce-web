import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import express from "express";
import cors from "cors";

const app = express();
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

let port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log(`The port ${port} is running!`);
    connectDB();
});

console.log("URI:", process.env.MONGO_URL);