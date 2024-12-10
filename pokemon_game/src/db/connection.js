// Importa el módulo de MariaDB para interactuar con la base de datos.
// Este módulo permite la conexión y ejecución de consultas a bases de datos MariaDB.
const mariadb = require('mariadb');

// Define la configuración para la conexión a la base de datos.
// Este objeto contiene los parámetros necesarios para conectarse a la base de datos MariaDB.
const config = {
    host: '127.0.0.1',          // Dirección del servidor de la base de datos. En este caso, localhost (127.0.0.1).
    user: 'root',               // Nombre de usuario que se usará para autenticar en la base de datos.
    password: 'r00tP4sw0rd',    // Contraseña del usuario especificado. Asegúrate de usar credenciales seguras en producción.
    database: 'pokemon_game',   // Nombre de la base de datos a la que se conectará el programa.
    port: 3307,                 // Puerto en el que el servidor de MariaDB está escuchando. Por defecto es 3306, pero aquí se usa 3307.
    connectionLimit: 10         // Límite máximo de conexiones simultáneas en el pool. Esto ayuda a gestionar recursos de manera eficiente.
};

// Crea un pool de conexiones a la base de datos utilizando la configuración definida.
// Un pool permite reutilizar conexiones en lugar de crear y cerrar nuevas conexiones constantemente, mejorando el rendimiento.
const pool = mariadb.createPool(config);

// Exporta el pool de conexiones para que esté disponible en otros módulos del proyecto.
// Esto permite que otras partes del código puedan realizar consultas a la base de datos usando este pool.
module.exports = pool;
