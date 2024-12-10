// Importar las dependencias necesarias
const { request, response } = require('express'); // Desestructuramos las funciones request y response para definir sus tipos y mejorar la legibilidad
const pool = require('../db/connection'); // Importamos el pool para manejar la conexión con la base de datos
const pokemonModel = require('../models/pokemons'); // Importamos las consultas y métodos relacionados con los Pokémon

/**
 * Controlador para obtener todos los Pokémon de la base de datos.
 *
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
const getAllPokemons = async (req = request, res = response) => {
    let conn; // Variable para almacenar la conexión a la base de datos
    try {
        // Establecer conexión con la base de datos
        conn = await pool.getConnection();

        // Ejecutar la consulta para obtener todos los Pokémon
        const pokemons = await conn.query(pokemonModel.getAll);

        // Enviar el resultado de la consulta como respuesta
        res.send(pokemons);
    } catch (err) {
        // Manejar errores durante la ejecución
        res.status(500).json(err); // Devolver un código 500 con el error capturado
        return;
    } finally {
        // Asegurarse de liberar la conexión incluso si ocurre un error
        if (conn) conn.end(); // Cerrar la conexión con la base de datos
    }
};

/**
 * Controlador para obtener un Pokémon específico por su ID.
 *
 * @param {Object} req - Objeto de solicitud que contiene el parámetro ID
 * @param {Object} res - Objeto de respuesta para enviar los resultados
 */
const getPokemonById = async (req = request, res = response) => {
    const { id } = req.params; // Extraer el ID del Pokémon desde los parámetros de la solicitud

    // Validar que el ID proporcionado sea un número
    if (isNaN(id)) {
        res.status(400).send('Invalid ID'); // Devolver un error 400 si el ID no es válido
        return;
    }

    let conn; // Variable para la conexión
    try {
        // Establecer conexión con la base de datos
        conn = await pool.getConnection();

        // Ejecutar la consulta para buscar el Pokémon por ID
        const [pokemons] = await conn.query(pokemonModel.getById, [+id]);

        // Verificar si se encontró el Pokémon
        if (!pokemons) {
            res.status(404).send('Pokemon not found'); // Devolver un error 404 si no se encuentra el Pokémon
            return;
        }

        // Devolver el Pokémon encontrado como respuesta
        res.send(pokemons);
    } catch (error) {
        // Manejar errores en caso de fallas durante la ejecución
        res.status(500).send(error); // Devolver un código 500 con el error
    } finally {
        // Asegurarse de cerrar la conexión a la base de datos
        if (conn) conn.end();
    }
};

/**
 * Controlador para obtener 3 Pokémon aleatorios de la base de datos.
 *
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
const get3RandomPokemons = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const pokemons = await conn.query(pokemonModel.get3RandomPokemons);
        res.send(pokemons);

    }catch (error) {
        res.status(500).send(error);
    }finally {
        if (conn) conn.end();
    }
};

/**
 * Controlador para crear un nuevo Pokémon en la base de datos.
 *
 * @param {Object} req - Objeto de solicitud que contiene los datos del nuevo Pokémon
 * @param {Object} res - Objeto de respuesta para confirmar la creación
 */
const createPokemon = async (req = request, res = response) => {
    const { name, image } = req.body; // Extraer los datos del cuerpo de la solicitud

    // Validar que se proporcionen todos los campos obligatorios
    if (!name || !image) {
        res.status(400).send('Bad Request. Some fields are missing'); // Devolver un error 400 si faltan campos
        return;
    }

    let conn; // Variable para la conexión
    try {
        // Establecer conexión con la base de datos
        conn = await pool.getConnection();

        // Verificar si ya existe un Pokémon con el mismo nombre o imagen
        const [nameExists] = await conn.query(pokemonModel.getByPokemon, [name]);
        const [imageExists] = await conn.query(pokemonModel.getByImage, [image]);

        // Si el nombre ya existe, devolver un error de conflicto
        if (nameExists) {
            res.status(409).send('The Pokémon you inserted already exists');
            return;
        }

        // Si la imagen ya existe, devolver un error de conflicto
        if (imageExists) {
            res.status(409).send('The image of the Pokémon you inserted already exists');
            return;
        }

        // Crear el nuevo Pokémon en la base de datos
        const newPokemon = await conn.query(pokemonModel.create, [name, image]);

        // Verificar si la creación fue exitosa
        if (newPokemon.affectedRows === 0) {
            res.status(500).send('Error adding Pokémon'); // Error en caso de fallo
            return;
        }

        // Confirmar que el Pokémon fue creado exitosamente
        res.status(201).send("Pokémon created successfully");
    } catch (error) {
        // Manejo de errores
        res.status(500).send(error); // Enviar el error al cliente
        return;
    } finally {
        // Liberar la conexión a la base de datos
        if (conn) conn.end();
    }
};

/**
 * Controlador para actualizar un Pokémon existente.
 *
 * @param {Object} req - Objeto de solicitud que contiene el ID y los datos a actualizar
 * @param {Object} res - Objeto de respuesta para confirmar la actualización
 */
const updatePokemon = async (req = request, res = response) => {
    const { id } = req.params; // ID del Pokémon a actualizar
    const { name, image } = req.body; // Nuevos datos a actualizar

    // Validar que el ID sea un número
    if (isNaN(id)) {
        res.status(400).send("Invalid ID"); // Error en caso de ID no válido
        return;
    }

    // Validar que al menos un campo esté presente para actualizar
    if (!name || !image) {
        res.status(400).send("At least one field is required for update");
        return;
    }

    let conn;
    try {
        // Conexión a la base de datos
        conn = await pool.getConnection();

        // Verificar si el Pokémon existe
        const [pokemons] = await conn.query(pokemonModel.getById, [+id]);
        if (!pokemons) {
            res.status(404).send("Pokemon not found");
            return;
        }

        // Verificar si los nuevos datos ya están en uso
        const [nameExist] = await conn.query(pokemonModel.namevalid, [name, id]);
        const [imageExist] = await conn.query(pokemonModel.imagevalid, [image, id]);

        if (nameExist) {
            res.status(409).send({ message: 'Name already in use' });
            return;
        }
        if (imageExist) {
            res.status(409).send({ message: 'Image already in use' });
            return;
        }

        // Actualizar el Pokémon con los nuevos datos
        const { affectedRows } = await conn.query(pokemonModel.editPokemon, [name, image, id]);

        // Verificar si la actualización fue exitosa
        if (affectedRows === 0) {
            res.status(500).send({ message: 'Pokémon not updated' });
            return;
        }

        // Confirmar la actualización
        res.send("Pokémon updated successfully");
    } catch (error) {
        res.status(500).send(error); // Manejo de errores
        return;
    } finally {
        // Liberar la conexión a la base de datos
        if (conn) conn.end();
    }
};

/**
 * Controlador para eliminar un Pokémon.
 *
 * @param {Object} req - Objeto de solicitud con el ID del Pokémon a eliminar
 * @param {Object} res - Objeto de respuesta para confirmar la eliminación
 */
const deletePokemon = async (req = request, res = response) => {
    const { id } = req.params; // ID del Pokémon a eliminar

    // Validar que el ID sea un número
    if (isNaN(id)) {
        res.status(400).send({ message: 'Invalid ID' });
        return;
    }

    let conn;
    try {
        // Conexión a la base de datos
        conn = await pool.getConnection();

        // Verificar si el Pokémon existe
        const [pokemons] = await conn.query(pokemonModel.getById, [+id]);
        if (!pokemons) {
            res.status(404).send({ message: 'Pokemon not found' });
            return;
        }

        // Eliminar el Pokémon
        const { affectedRows } = await conn.query(pokemonModel.DeletePokemon, [id]);

        // Verificar si la eliminación fue exitosa
        if (affectedRows === 0) {
            res.status(500).send({ message: 'Error deleting Pokémon' });
            return;
        }

        // Confirmar la eliminación
        res.send({ message: 'Pokémon deleted successfully' });
    } catch (error) {
        res.status(500).send(error); // Manejo de errores
        return;
    } finally {
        // Liberar la conexión a la base de datos
        if (conn) conn.end();
    }
};

// Exportar los controladores para usarlos en otros módulos
module.exports = {
    getAllPokemons,
    getPokemonById,
    get3RandomPokemons,
    createPokemon,
    updatePokemon,
    deletePokemon
};
