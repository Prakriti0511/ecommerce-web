import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
//A cookie parser is middleware in Node.js
// Helps you handle and verify cookies (like session IDs, auth tokens) in Express apps.

const express = require('express');
const app = express();
dotenv.config()

let port = process.env.PORT || 6000

app.use(express.json())
app.use(cookieParser())
app.use("api/auth", authRoutes)
app.use("api/products", require("./routes/productRoutes"))

app.get("/", (req,res)=>{
    res.send("hello")
})
app.listen(port,()=>{
    console.log(`The port ${port} is running!`)
    connectDB();
})
