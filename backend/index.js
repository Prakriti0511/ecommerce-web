import dotenv from "dotenv"
import connectDB from "./config/db.js"
const express = require('express');

dotenv.config()

let port = process.env.PORT || 6000

let app = express();
app.get("/", (req,res)=>{
    res.send("hello")
})
app.listen(port,()=>{
    console.log("The port 8000 is running!")
    connectDB();
})