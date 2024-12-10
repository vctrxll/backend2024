// Definir el objeto `userQueries` que contiene las consultas SQL necesarias para interactuar con la tabla "users".
// Estas consultas permiten realizar operaciones de CRUD (Crear, Leer, Actualizar y Eliminar) sobre los usuarios.

// El objeto `userQueries` incluye las siguientes consultas SQL:
// 1. **getAll**: Consulta para obtener todos los usuarios de la tabla "users".
//    Esta consulta devolverá todos los registros de la tabla sin ninguna condición.
const userQueries = {
    getAll: 'SELECT * FROM users', // Obtener todos los usuarios

    // 2. **getById**: Consulta para obtener un usuario específico por su ID.
    //    El símbolo '?' se utiliza como un marcador de posición para pasar el ID del usuario de forma dinámica.
    getById: 'SELECT * FROM users WHERE id = ?', // Obtener un usuario por su ID

    // 3. **getByEmail**: Consulta para obtener un usuario específico por su dirección de correo electrónico.
    //    Similar a `getById`, usa '?' para pasar el correo electrónico de forma dinámica.
    getByEmail: 'SELECT * FROM users WHERE email = ?', // Obtener un usuario por su correo electrónico

    // 4. **create**: Consulta para insertar un nuevo usuario en la base de datos.
    //    Se pasan los parámetros de "first_name", "last_name", "email" y "password" de forma dinámica.
    create: 'INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)', // Insertar un nuevo usuario

    // 5. **editUser**: Consulta para actualizar un usuario existente.
    //    Actualiza los campos "first_name", "last_name" y "email" de un usuario específico identificado por su ID.
    editUser: 'UPDATE users SET first_name=?, last_name=?, email=? WHERE id=?', // Actualizar un usuario

    // 6. **emailvalid**: Consulta para verificar si ya existe un usuario con el mismo correo electrónico (excepto por el usuario que se está actualizando).
    //    Se utiliza para evitar que dos usuarios tengan el mismo correo electrónico.
    emailvalid: 'SELECT * FROM users WHERE email = ? AND id <> ?', // Verificar si el correo electrónico ya existe (excluyendo el usuario con el ID dado)

    // 7. **deleteUser**: Consulta para eliminar un usuario de la base de datos por su ID.
    //    El símbolo '?' se usa como marcador de posición para pasar el ID del usuario que se desea eliminar.
    deleteUser: 'DELETE FROM users WHERE id=?' // Eliminar un usuario por su ID
}

// Exportar el objeto `userQueries` para que pueda ser utilizado en otras partes de la aplicación,
// como en los controladores, para ejecutar estas consultas SQL sobre la base de datos.
module.exports = {userQueries};
