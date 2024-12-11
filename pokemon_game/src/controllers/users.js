// Importar las dependencias necesarias
const { request, response } = require('express'); // Desestructuramos las funciones request y response para definir sus tipos
const bcrypt = require('bcrypt'); // Librería para gestionar el hashing de contraseñas
const pool = require('../db/connection'); // Conexión al pool de la base de datos
const { userQueries } = require('../models/users'); // Consultas SQL relacionadas con los usuarios

require('dotenv').config();

const secrets = process.env.SECRET;

const userProtected = async (req = request, res = response) => {
    res.send({ messange: "You have access!!" });
}


// Definir el número de rondas para generar el hash de las contraseñas
const saltRounds = 10;

/**
 * Controlador para obtener todos los usuarios de la base de datos.
 *
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
const getAllUsers = async (req = request, res = response) => {
    let conn;

    try {
        // Establecer conexión con la base de datos
        conn = await pool.getConnection();

        // Ejecutar la consulta para obtener todos los usuarios
        const users = await conn.query(userQueries.getAll);

        // Enviar el resultado de la consulta como respuesta
        res.json(users);
        return;
    } catch (err) {
        // Manejar errores durante la ejecución
        res.status(500).json(err);
        return;
    } finally {
        // Liberar la conexión incluso en caso de error
        if (conn) conn.end();
    }
};

/**
 * Controlador para obtener un usuario por su ID.
 *
 * @param {Object} req - Objeto de solicitud que contiene el ID en los parámetros
 * @param {Object} res - Objeto de respuesta para enviar el usuario encontrado
 */
const getUserById = async (req = request, res = response) => {
    const { id } = req.params; // Extraer el ID del usuario desde los parámetros

    // Validar que el ID sea un número
    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        // Establecer conexión con la base de datos
        conn = await pool.getConnection();

        // Ejecutar la consulta para buscar el usuario por ID
        const [user] = await conn.query(userQueries.getById, [+id]);

        // Validar si el usuario existe
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // Devolver el usuario encontrado
        res.send(user);
    } catch (error) {
        // Manejo de errores
        res.status(500).send(error);
    } finally {
        // Asegurarse de cerrar la conexión
        if (conn) conn.end();
    }
};

/**
 * Controlador para agregar un nuevo usuario.
 *
 * @param {Object} req - Objeto de solicitud que contiene los datos del usuario
 * @param {Object} res - Objeto de respuesta para confirmar la creación
 */
const CreateUser = async (req = request, res = response) => {
    const { first_name, last_name, email, password } = req.body; // Extraer datos del cuerpo de la solicitud

    // Validar que todos los campos requeridos estén presentes
    if (!first_name || !last_name || !email || !password) {
        res.status(400).send('Bad Request. Some fields are missing');
        return;
    }

    let conn;
    try {
        // Establecer conexión con la base de datos
        conn = await pool.getConnection();

        // Verificar si el email ya está registrado
        const [user_exists] = await conn.query(userQueries.getByEmail, [email]);
        if (user_exists) {
            res.status(409).send('Email already exists');
            return;
        }

        // Generar un hash de la contraseña
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Insertar el nuevo usuario en la base de datos
        const newUser = await conn.query(userQueries.create, [first_name, last_name, email, hashPassword]);

        // Validar si la inserción fue exitosa
        if (newUser.affectedRows === 0) {
            res.status(500).send('Error adding user');
            return;
        }

        // Confirmar la creación del usuario
        res.status(201).send("User created successfully");
    } catch (error) {
        // Manejo de errores
        res.status(500).send(error);
        return;
    } finally {
        // Liberar la conexión
        if (conn) conn.end();
    }
};

/**
 * Controlador para actualizar un usuario existente.
 *
 * @param {Object} req - Objeto de solicitud con el ID y los nuevos datos
 * @param {Object} res - Objeto de respuesta para confirmar la actualización
 */
const updateUser = async (req = request, res = response) => {
    const { id } = req.params; // ID del usuario a actualizar
    const { first_name, last_name, email } = req.body; // Nuevos datos a actualizar

    // Validar el ID y los campos requeridos
    if (isNaN(id)) {
        res.status(400).send("Invalid ID");
        return;
    }

    if (!first_name || !last_name || !email) {
        res.status(400).send("At least one field is required for update");
        return;
    }

    let conn;
    try {
        // Conexión a la base de datos
        conn = await pool.getConnection();

        // Verificar si el usuario existe
        const [user] = await conn.query(userQueries.getById, [+id]);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        // Verificar si el email ya está en uso por otro usuario
        const [emailExist] = await conn.query(userQueries.emailvalid, [email, id]);
        if (emailExist) {
            res.status(409).send({ message: 'Email already in use' });
            return;
        }

        // Actualizar los datos del usuario
        const { affectedRows } = await conn.query(userQueries.editUser, [first_name, last_name, email, id]);

        // Validar si la actualización fue exitosa
        if (affectedRows === 0) {
            res.status(500).send({ message: 'User not updated' });
            return;
        }

        // Confirmar la actualización
        res.send("User updated successfully");
    } catch (error) {
        res.status(500).send(error);
        return;
    } finally {
        // Liberar la conexión
        if (conn) conn.end();
    }
};

/**
 * Controlador para eliminar un usuario por su ID.
 *
 * @param {Object} req - Objeto de solicitud con el ID del usuario a eliminar
 * @param {Object} res - Objeto de respuesta para confirmar la eliminación
 */
const destroyUser = async (req = request, res = response) => {
    const { id } = req.params; // ID del usuario a eliminar

    // Validar que el ID sea un número
    if (isNaN(id)) {
        res.status(400).send({ message: 'Invalid ID' });
        return;
    }

    let conn;
    try {
        // Conexión a la base de datos
        conn = await pool.getConnection();

        // Verificar si el usuario existe
        const [user] = await conn.query(userQueries.getById, [+id]);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        // Eliminar el usuario
        const { affectedRows } = await conn.query(userQueries.deleteUser, [id]);

        // Validar si la eliminación fue exitosa
        if (affectedRows === 0) {
            res.status(500).send({ message: 'Error deleting user' });
            return;
        }

        // Confirmar la eliminación
        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
        return;
    } finally {
        // Liberar la conexión
        if (conn) conn.end();
    }
};

// Exportar los controladores para usarlos en otros módulos
module.exports = {
    getAllUsers,
    getUserById,
    CreateUser,
    updateUser,
    destroyUser,
    userProtected,
};
