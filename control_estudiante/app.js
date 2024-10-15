const express = require("express")

const app= express()
app.use(express.json());
const usuarios = [
    {
        id: 1,
        nombre: "Victor Axel",
        apellido: "Rodriguez Ocampo",
        email: "rodriguez.ocampo04@gmail.com",
    },
    {
        id: 2,
        nombre: "Eva Isabel" ,
        apellido: "Ocampo Castro",
        email: "elizabeth@gmail.com",
    },


]


app.get("/usuarios", (req, res)=>{
    res.status(404).send({usuarios});
});
app.get("/usuarios/:id", (req, res)=>{
    const {id} = req.params;

    if(isNaN(id)){
        res.status(400).send({error:"El id debe ser un numero"});
        return;
    };
    const usuario = usuarios.find((usuario)=>usuario.id === +id);
    if(usuario === undefined){
        //res.status(404).send({Error: "usuario no encontrado"});
        res.status(404).send({Error: `El usuario con id ${id} no existe`});
        return;
    }
    res.status(200).send(usuario);
});
app.post("/usuarios", (req, res)=>{
    /*validaciones de tarea para el lunes
    1.-La informacion debe estar completa, si una de ellas no llega enviar un error (400)
    2.-El email debe ser unico (400) */
    const {nombre, apellido, email} = req.body;
    if (!nombre || nombre.trim() === '') {
        return res.status(400).send({ error: "Nombre es un campo obligatorio" });
    }
    if (!apellido || apellido.trim() === '') {
        return res.status(400).send({ error: "Apellido es un campo obligatorio" });
    }
    if (!email || email.trim() === '') {
        return res.status(400).send({ error: "Email es un campo obligatorio" });
    }

    const emailExists = usuarios.some(usuario => usuario.email === email);
    if (emailExists) {
        return res.status(400).send({ error: "El email ya está en uso" });
    }

    usuarios.push({id: usuarios.length + 1, nombre, apellido, email});
    //console.log(req.body)
    res.status(201).send("El usuario se agregó correctamente");

});

app.listen(3000, ()=>{
    console.log("Servidor corriendo en http://localhost:3000");
});