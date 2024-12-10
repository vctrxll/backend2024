// Importar el enrutador (Router) de Express y las funciones del controlador para las rutas de Pokémon.
// El enrutador se usará para definir las rutas HTTP y las funciones del controlador se encargarán de las operaciones relacionadas con los Pokémon.
const { Router } = require('express');

// Desestructurar y obtener las funciones del controlador de Pokémon que gestionan las distintas operaciones:
// - getAllPokemons: Obtiene todos los Pokémon.
// - getPokemonById: Obtiene un Pokémon específico por su ID.
// - get3RandomPokemons: Obtiene 3 Pokémon aleatorios.
// - createPokemon: Crea un nuevo Pokémon en la base de datos.
// - updatePokemon: Actualiza un Pokémon existente en la base de datos.
// - deletePokemon: Elimina un Pokémon por su ID de la base de datos.
const {
    getAllPokemons,       // Función para obtener todos los Pokémon
    getPokemonById,       // Función para obtener un Pokémon por su ID
    get3RandomPokemons,   // Función para obtener 3 Pokémon aleatorios
    createPokemon,        // Función para crear un nuevo Pokémon
    updatePokemon,        // Función para actualizar un Pokémon existente
    deletePokemon,        // Función para eliminar un Pokémon
} = require('../controllers/pokemons');

// Crear una nueva instancia del enrutador de Express.
// El enrutador se usará para definir las rutas y asociarlas con las funciones del controlador correspondientes.
const routes = Router();

// Definir la ruta GET para obtener todos los Pokémon.
// La función `getAllPokemons` se ejecuta cuando se realiza una solicitud GET a la ruta "/",
// y devuelve todos los Pokémon almacenados en la base de datos.
routes.get('/', getAllPokemons);

// Definir la ruta GET para obtener un Pokémon específico por su ID.
// El parámetro ":id" en la ruta permite recibir un ID dinámico para obtener un Pokémon por su identificador único.
// La función `getPokemonById` se ejecuta cuando se realiza una solicitud GET a la ruta "/:id",
// donde `:id` es un valor dinámico que se utiliza para buscar el Pokémon específico.
routes.get('/:id', getPokemonById);

// Definir la ruta GET para obtener 3 Pokémon aleatorios.
// La función `get3RandomPokemons` se ejecuta cuando se realiza una solicitud GET a la ruta "/play",
// y devuelve tres Pokémon aleatorios desde la base de datos o un conjunto predefinido.
routes.get('/play', get3RandomPokemons);

// Definir la ruta POST para crear un nuevo Pokémon.
// La función `createPokemon` se ejecuta cuando se realiza una solicitud POST a la ruta "/",
// y los datos del nuevo Pokémon se pasan en el cuerpo de la solicitud (request body).
routes.post('/', createPokemon);

// Definir la ruta PUT para actualizar un Pokémon existente por su ID.
// El parámetro ":id" en la ruta permite recibir un ID dinámico para identificar qué Pokémon se desea actualizar.
// La función `updatePokemon` se ejecuta cuando se realiza una solicitud PUT a la ruta "/:id",
// y los datos actualizados del Pokémon se pasan en el cuerpo de la solicitud (request body).
routes.put('/:id', updatePokemon);

// Definir la ruta DELETE para eliminar un Pokémon por su ID.
// El parámetro ":id" en la ruta permite recibir un ID dinámico para identificar qué Pokémon se desea eliminar.
// La función `deletePokemon` se ejecuta cuando se realiza una solicitud DELETE a la ruta "/:id",
// y el ID del Pokémon se usa para eliminarlo de la base de datos.
routes.delete('/:id', deletePokemon);

// Exportar el enrutador para que pueda ser utilizado en otras partes de la aplicación,
// como en el archivo principal del servidor, donde se importarán estas rutas y se asociarán con una URL base,
// como "/pokemons", para que las solicitudes sean redirigidas a estas funciones de controlador.
module.exports = routes;
