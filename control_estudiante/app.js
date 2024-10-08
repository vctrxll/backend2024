const express = require("express");

const app = express();

app.get("/usuarios", (req,res)=>{
    const usuarios = [{
        id:1,
        nombre: "Victor Axel",
        apellido: "Rodriguez Ocampo",
        email: "viictor.axel11@gmail.com"
    },
    {
        id:2,
        nombre: "Victor Axel",
        apellido: "Rodriguez Ocampo",
        email: "viictor.axel11@gmail.com"
    }
    ]
    res.status(200).send({usuarios});
});

app.get("/usuarios/:id",(req,res)=>{
    const params = req.params
})

app.listen(3000, () => 
    console.log("Servidor corriendo en http://localhost:3000")
);