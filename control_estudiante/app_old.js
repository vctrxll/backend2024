const express = require("express");

const app = express();

app.get("/", (req,res)=>{
    res.status(404).send("Hola mundo desde get")
});

app.post("/", (req,res)=>{
    res.status(200).send("Hola mundo desde post")
});

app.put("/", (req,res)=>{
    res.status(101).send("Hola mundo desde put")
});

app.listen(3000, () => 
    console.log("Servidor corriendo en http://localhost:3000")
)