const express = require('express');
const usersRoutes = require('./routes/users');
const pokemonsRoutes = require('./routes/pokemons');
const pokemonSeeder = require('./seeders/pokemon');

class Server {
    constructor() {
        this.app = express();
        this.port = 3000;

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/users', usersRoutes)
        this.app.use('/pokemons', pokemonsRoutes);
    }

    seeder(){
        pokemonSeeder();
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

module.exports = Server;