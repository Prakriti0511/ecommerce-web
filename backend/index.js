import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import express from "express";

const app = express();
dotenv.config();

let port = process.env.PORT || 6000;

app.use(express.json());
app.use(cookieParser());
app.use("api/auth", authRoutes);
app.use("api/products", productRoutes);

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log(`The port ${port} is running!`);
    connectDB();
});
