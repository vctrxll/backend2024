const express = require('express');
const usersRoutes = require('./routes/users');
const staffRoutes = require('./routes/staff');


class Server {
    constructor() {
        this.app = express();
        this.port = 3000;
        this.middlewares();
        //this.app.use(express.json());//metodo de express, intercepta la solicitud antes del backend, identificar dento del paquete tiene informacion del paquete json
        this.routes();
    }

    middlewares(){
        this.app.use(express.json());
    }

    routes(){
        this.app.use('/users', usersRoutes);
        this.app.use('/staff', staffRoutes); // Nueva ruta para staff
    }

    start(){
        this.app.listen(this.port, () =>{
            console.log('Server listeninig on port' + this.port);
        });

    }
}

module.exports = {Server};