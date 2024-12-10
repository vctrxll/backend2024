// Definir el modelo para la tabla "pokemon".
// Este objeto contiene las consultas SQL necesarias para interactuar con la base de datos
// y realizar las operaciones de CRUD (Crear, Leer, Actualizar y Eliminar) sobre los Pokémon.

// El objeto `pokemonModel` incluye las siguientes consultas SQL:
// 1. **getAll**: Consulta para obtener todos los Pokémon de la tabla "pokemon".
//    Devuelve todos los registros sin ninguna condición.
const pokemonModel = {
    getAll: 'SELECT * FROM pokemon', // Obtener todos los Pokémon

    get3RandomPokemons: 'SELECT * FROM pokemon ORDER BY RAND() LIMIT 3',
    
    // 2. **getById**: Consulta para obtener un Pokémon específico por su ID.
    //    El símbolo '?' se usa como marcador de posición para pasar dinámicamente el ID del Pokémon.
    getById: 'SELECT * FROM pokemon WHERE id = ?', // Obtener un Pokémon por su ID

    // 3. **getByPokemon**: Consulta para obtener un Pokémon específico por su nombre.
    //    El símbolo '?' se usa como marcador de posición para pasar dinámicamente el nombre del Pokémon.
    getByPokemon: 'SELECT * FROM pokemon WHERE name = ?', // Obtener un Pokémon por su nombre

    // 4. **getByImage**: Consulta para obtener un Pokémon específico por su imagen.
    //    Similar a la consulta anterior, usa el símbolo '?' para pasar la URL de la imagen del Pokémon.
    getByImage: 'SELECT * FROM pokemon WHERE image = ?', // Obtener un Pokémon por su imagen


    // 5. **create**: Consulta para insertar un nuevo Pokémon en la base de datos.
    //    Los valores de "name" e "image" se pasan como parámetros a través de los marcadores de posición ('?, ?').
    create: 'INSERT INTO pokemon (name, image) VALUES (?,?)', // Insertar un nuevo Pokémon

    // 6. **editPokemon**: Consulta para actualizar un Pokémon existente.
    //    Actualiza el nombre y la imagen del Pokémon, donde se pasa el ID para identificar el Pokémon a actualizar.
    editPokemon: 'UPDATE pokemon SET name=?, image=? WHERE id=?', // Actualizar un Pokémon

    // 7. **namevalid**: Consulta para verificar si ya existe un Pokémon con el mismo nombre (excepto por el que se está actualizando).
    //    Esto ayuda a evitar duplicados en los nombres de los Pokémon.
    namevalid: 'SELECT * FROM pokemon WHERE name = ? AND id <> ?', // Verificar si el nombre ya existe (excluyendo el Pokémon con el ID dado)

    // 8. **imagevalid**: Consulta para verificar si ya existe un Pokémon con la misma imagen (excepto por el que se está actualizando).
    //    Esto ayuda a evitar duplicados en las imágenes de los Pokémon.
    imagevalid: 'SELECT * FROM pokemon WHERE image = ? AND id <> ?', // Verificar si la imagen ya existe (excluyendo el Pokémon con el ID dado)

    // 9. **DeletePokemon**: Consulta para eliminar un Pokémon de la base de datos por su ID.
    //    El símbolo '?' se usa como marcador de posición para pasar el ID del Pokémon a eliminar.
    DeletePokemon: 'DELETE FROM pokemon WHERE id=?' // Eliminar un Pokémon por su ID
}

// Exportar el objeto `pokemonModel` para que pueda ser utilizado en otras partes de la aplicación,
// como en los controladores, para interactuar con la base de datos y realizar las operaciones de CRUD.
module.exports = pokemonModel;
