// Importar las dependencias necesarias
const express = require('express'); // Framework para crear aplicaciones web y API en Node.js
const usersRoutes = require('./routes/users'); // Archivo que contiene las rutas relacionadas con usuarios
const pokemonsRoutes = require('./routes/pokemons'); // Archivo que contiene las rutas relacionadas con pokémon
const authRoutes = require('./routes/auth');
const pokemonSeeder = require('./seeders/pokemon'); // Archivo que inicializa datos relacionados con pokémon en la base de datos o un almacenamiento

/**
 * Clase `Server` que encapsula la configuración y funcionalidad del servidor.
 */
class Server {
    constructor() {
        // Inicializar una instancia de Express
        this.app = express();

        // Definir el puerto en el que se ejecutará el servidor
        this.port = 3000;

        // Configurar middlewares necesarios
        this.middlewares();

        // Configurar las rutas del servidor
        this.routes();
    }

    /**
     * Método para configurar middlewares en la aplicación.
     * En este caso, se utiliza para interpretar solicitudes con cuerpo en formato JSON.
     */
    middlewares() {
        this.app.use(express.json()); // Middleware para habilitar el análisis de datos JSON en las solicitudes
    }

    /**
     * Método para configurar las rutas principales de la aplicación.
     * Enlaza las rutas de usuarios y pokémon.
     */
    routes() {
        this.app.use('/users', usersRoutes); // Asocia el prefijo '/users' con las rutas definidas en `usersRoutes`
        this.app.use('/pokemons', pokemonsRoutes); // Asocia el prefijo '/pokemons' con las rutas definidas en `pokemonsRoutes`
        this.app.use('/auth', authRoutes)
    }

    /**
     * Método para ejecutar un seeder, que inicializa datos en la base de datos o almacenamiento.
     * En este caso, se utiliza para agregar datos de ejemplo relacionados con pokémon.
     */
    seeder() {
        pokemonSeeder(); // Ejecuta el seeder para cargar los datos iniciales
    }

    /**
     * Método para iniciar el servidor.
     * Escucha en el puerto definido y muestra un mensaje en la consola cuando el servidor está en funcionamiento.
     */
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`); // Mensaje de confirmación en la consola
        });
    }
}

// Exportar la clase `Server` para que pueda ser instanciada y utilizada en otros archivos
module.exports = Server;
