const pokemonModel = {
    getAll: 'SELECT * FROM pokemon',
    getById: 'SELECT * FROM pokemon WHERE id = ?',
    getByPokemon: 'SELECT * FROM pokemon WHERE name = ?',
    getByImage: 'SELECT * FROM pokemon WHERE image = ?',
    create: 'INSERT INTO pokemon (name, image) VALUES (?,?)',
    editPokemon: 'UPDATE pokemon SET name=?, image=? WHERE id=?',
    namevalid: 'SELECT * FROM pokemon WHERE name = ? AND id <> ?',
    imagevalid: 'SELECT * FROM pokemon WHERE image = ? AND id <> ?',
    DeletePokemon: 'DELETE FROM pokemon WHERE id=?'
}

module.exports = pokemonModel;