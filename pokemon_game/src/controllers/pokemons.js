const {request, response} = require('express');
const pool = require('../db/connection');
const pokemonModel = require('../models/pokemons')

const getAllPokemons = async (req = request, res = response) =>{
let conn;
try{
 conn= await pool.getConnection();
 const pokemons = await conn.query(pokemonModel.getAll)
 res.send(pokemons);

}catch(err){
res.status(500).json(err);
return;
}finally{
if (conn) conn.end();
}



}

const getPokemonById = async (req = request, res = response) =>{
    const {id} = req.params;
    if(isNaN(id)){
        res.status(400).send('Invalid ID');
        return;
    }
    let conn;
    try{
        conn = await pool.getConnection();
        const [pokemons] = await conn.query(pokemonModel.getById, [+id]);
        if(!pokemons){
            res.status(404).send('Pokemon not found')
            return;
        }
    
    res.send(pokemons);
    }catch (error){
        res.status(500).send(error);
    }finally{
        if(conn) conn.end();
    }

}

const get3RandomPokemons = async (req = request, res = response) =>{

}


const createPokemon = async (req = request, res = response) =>{
    const { name, image} = req.body;

    if (!name || !image) {
        res.status(400).send('Bad Request. Some fields are missing');
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();
        const [name_exits] = await conn.query(pokemonModel.getByPokemon, [name]);
        const [image_exits] = await conn.query(pokemonModel.getByImage, [image]);
        if(name_exits){
            res.status(409).send('The pokemon you inserted already exists');
            return;
        }
        if(image_exits){
            res.status(409).send('The image of the pokemon you inserted already exists');
            return;
        }

        const newPokemon = await conn.query(pokemonModel.create, [name, image]);
        if(newPokemon.affectedRows ===0){
            res.status(500).send('Error adding Pokemon');
            return;
        }
        res.status(201).send("Pokemon created succefully");
    }catch (error){
        res.status(500).send(error);
        return;
    }finally{
        if(conn) conn.end();
    }


}

const updatePokemon = async (req = request, res = response) =>{
    const { id } = req.params;
    const { name, image } = req.body;
  
    if (isNaN(id)) {
      res.status(400).send("Invalid ID");
      return;
    }
  
    if (!name || !image) {
      res.status(400).send("At least one field is required for update");
      return;
    }
  
    let conn;
  
    try {
      conn = await pool.getConnection();
  
      // Verificar si el usuario existe
      const [pokemons] = await conn.query(pokemonModel.getById, [+id]);
      if (!pokemons) {
        res.status(404).send("Pokemon not found");
        return;
      }
  
      // Verificar si el correo electrónico ya está en uso por otro usuario
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
  
      // Actualizar el usuario
      const { affectedRows } = await conn.query(pokemonModel.editPokemon, [
        name,
        image,
        id
      ]);
  
      if (affectedRows === 0) {
        res.status(500).send({ message: 'Pokemon not updated' });
        return;
      }
  
      res.send("Pokemon updated successfully");
    } catch (error) {
      res.status(500).send(error);
      return;
    } finally {
      if (conn) conn.end();
    }
}


const deletePokemon = async (req = request, res = response) =>{
    const { id } = req.params;
  
    if (isNaN(id)) {
      res.status(400).send({ message: 'Invalid ID' });
      return;
    }
  
    let conn;
  
    try {
      conn = await pool.getConnection();
  
      // Verificar si el usuario existe
      const [pokemons] = await conn.query(pokemonModel.getById, [+id]);
      if (!pokemons) {
        res.status(404).send({ message: 'Pokemon not found' });
        return;
      }
  
      // Eliminar el usuario
      const { affectedRows } = await conn.query(pokemonModel.DeletePokemon, [id]);
  
      if (affectedRows === 0) {
        res.status(500).send({ message: 'Error deleting Pokemon' });
        return;
      }
  
      res.send({ message: 'Pokemon deleted successfully' });
    } catch (error) {
      res.status(500).send(error);
      return;
    } finally {
      if (conn) conn.end();
    }
}

module.exports ={
    getAllPokemons,
    getPokemonById,
    get3RandomPokemons,
    createPokemon,
    updatePokemon,
    deletePokemon
}