const express = require('express');

let port = 8000;

let app = express();
app.get("/", (req,res)=>{
    res.send("hello")
})
app.listen(port,()=>{
    console.log("The port 8000 is running!")
})