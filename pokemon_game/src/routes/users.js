// Importar el enrutador (Router) de Express, que se utiliza para manejar las rutas
// y las funciones del controlador de usuarios que se encargarán de las operaciones de la base de datos.
const { Router } = require('express');

// Desestructurar y obtener las funciones del controlador de usuarios que gestionan las distintas operaciones:
// - getAllUsers: Obtiene todos los usuarios.
// - getUserById: Obtiene un usuario específico por su ID.
// - CreateUser: Crea un nuevo usuario.
// - updateUser: Actualiza un usuario existente.
// - destroyUser: Elimina un usuario.
const {
    getAllUsers,  // Función para obtener todos los usuarios
    getUserById,  // Función para obtener un usuario por su ID
    CreateUser,   // Función para crear un nuevo usuario
    updateUser,   // Función para actualizar un usuario existente
    destroyUser   // Función para eliminar un usuario
} = require('../controllers/users');

// Crear una nueva instancia del enrutador de Express.
// El enrutador se usará para definir las rutas y asociarlas con las funciones correspondientes del controlador.
const router = Router();

// Definir la ruta GET para obtener todos los usuarios.
// La función `getAllUsers` se ejecuta cuando se realiza una solicitud GET a la ruta "/".
router.get('/', getAllUsers);

// Definir la ruta GET para obtener un usuario por su ID.
// El parámetro ":id" en la ruta permite recibir un ID dinámico.
// La función `getUserById` se ejecuta cuando se realiza una solicitud GET a la ruta "/:id".
// Se utiliza el ID proporcionado en la URL para buscar al usuario en la base de datos.
router.get('/:id', getUserById);

// Definir la ruta POST para crear un nuevo usuario.
// La función `CreateUser` se ejecuta cuando se realiza una solicitud POST a la ruta "/",
// y los datos del nuevo usuario se pasan en el cuerpo de la solicitud (request body).
router.post('/', CreateUser);

// Definir la ruta PUT para actualizar un usuario existente por su ID.
// El parámetro ":id" en la ruta permite recibir un ID dinámico.
// La función `updateUser` se ejecuta cuando se realiza una solicitud PUT a la ruta "/:id",
// y los datos actualizados del usuario se pasan en el cuerpo de la solicitud (request body).
router.put('/:id', updateUser);

// Definir la ruta DELETE para eliminar un usuario por su ID.
// El parámetro ":id" en la ruta permite recibir un ID dinámico.
// La función `destroyUser` se ejecuta cuando se realiza una solicitud DELETE a la ruta "/:id",
// y el ID proporcionado se utiliza para identificar al usuario que se desea eliminar de la base de datos.
router.delete('/:id', destroyUser);

// Exportar el enrutador para que pueda ser utilizado en otras partes de la aplicación, como en el archivo principal del servidor.
// El archivo donde se importan estas rutas puede asociarlas con la URL base correspondiente, como "/users".
module.exports = router;
