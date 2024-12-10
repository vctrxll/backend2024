// Importar la conexión a la base de datos desde el archivo correspondiente
const pool = require("../db/connection");

/**
 * Seeder para cargar datos de Pokémon en la base de datos.
 * Obtiene los datos de la API pública de Pokémon y los inserta en la tabla `pokemon`.
 */
const pokemonSeeder = async () => {
    // Realizar una solicitud a la API de Pokémon para obtener los primeros 151 Pokémon
    const { results } = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
        .then(res => res.json());

    // Obtener detalles adicionales de cada Pokémon usando sus URLs individuales
    const pokemons = await Promise.all(
        results.map(async (poke) => {
            const pokemon = await fetch(poke.url).then(res => res.json());

            // Retornar un objeto con el nombre y la URL de la imagen de cada Pokémon
            return {
                name: poke.name, // Nombre del Pokémon
                image: pokemon.sprites.other.dream_world.front_default, // URL de la imagen del Pokémon
            };
        })
    );

    let conn; // Variable para manejar la conexión a la base de datos

    try {
        conn = await pool.getConnection(); // Obtener una conexión a la base de datos

        // Deshabilitar las claves foráneas temporalmente
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');

        // Vaciar la tabla `pokemon`
        await conn.query('TRUNCATE pokemon');

        // Habilitar nuevamente las claves foráneas
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');

        // Insertar cada Pokémon en la tabla `pokemon`
        pokemons.forEach(async (pokemon) => {
            await conn.query('INSERT INTO pokemon(name, image) VALUES (?, ?)', [
                pokemon.name, // Nombre del Pokémon
                pokemon.image, // URL de la imagen del Pokémon
            ]);
        });
    } catch (err) {
        // Manejar errores y mostrarlos en la consola
        console.log(err);
    } finally {
        // Cerrar la conexión a la base de datos si existe
        if (conn) conn.end();
    }
};

// Exportar el seeder para que pueda ser utilizado en otras partes del proyecto
module.exports = pokemonSeeder;
