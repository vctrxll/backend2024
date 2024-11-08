const {request, response} = require ('express');
const pool = require('../../db/connection');
const { usersQueries } = require('../models/users');

//const users = [
//    {id: 1, name: 'Jhon Doe'},
//    {id: 2, name: 'Jane Doe'},
//    {id: 3, name: 'Bob Smith'},
//];

const getAllUsers = async (req = request, res= response) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const users = await conn.query(usersQueries.getAll);

        res.send(users);
    }catch (error){
        res.status(500).send(error);
        return;
    }finally{
        if (conn) conn.end();
    }

}

const getUserById = async (req = request, res= response) =>{
    const {id} = req.params;
    if(isNaN(id)){
        res.status(400).send('Invalid ID');
        return;
    }
    let conn;
    try{
        conn = await pool.getConnection();
        const user = await conn.query(usersQueries.getById, [+id]);

        if(user.length ===0){
            res.status(404).send('User not found')
            return;
        }
        res.send(user);
    }catch (error){
        res.status(500).send(error);
    }finally{
        if(conn) conn.end();
    }

    //const user = users.find(user => user.id === +id);

}
//agregar un usuario
const CreateUser = async (req = request, res = response) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).send('Bad Request. Some fields are missing');
        return;
    }
    let conn;
    try{
        conn = await pool.getConnection();
        const user = conn.query(usersQueries.getByUsername, [username]);
        if(user.length > 0){
            res.status(409).send('Username already exits');
            return;
        }
        const newUser = await conn.query(usersQueries.create, [username, password, email]);
        if(newUser.affectedRows ===0){
            res.status(500).send('user could not be created');
            return;
        }
        res.status(201).send("user created succefully");
    }catch (error){
        res.status(500).send(error);
        return;
    }finally{
        if(conn) conn.end();
    }


    //const user = user.find(user => user.name === name);

    //if(user){
    //    res.status(409).send('User already exits');
    //}

}

const updateUser = async (req = request, res = response) => {
    const { id } = req.params;
    const { username } = req.body;

    if (isNaN(id) || !username ) {
        res.status(400).send("Invalid request");
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Verificar si el usuario existe
        const user = await conn.query(usersQueries.getById, [+id]);
        if (user.length === 0) {
            res.status(404).send("not found");
            return;
        }

        // Actualizar usuario
        const result = await conn.query(usersQueries.update, [username, +id]);

        if (result.affectedRows === 0) {
            res.status(500).send("not be updated");
            return;
        }

        res.send("User updated ");
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};


const remove = (req = request, res = response) => {
    const { id } = req.params;

    if (isNaN(id)) {
        res.status(400).send('ID must be a number');
        return;
    }

    const userIndex = users.findIndex(user => user.id === +id);

    if (userIndex === -1) {
        res.status(404).send(`User with id ${id} not found`);
        return;
    }

    users.splice(userIndex, 1);
    res.status(200).send('User deleted successfully');
}

module.exports = { getAllUsers, getUserById, CreateUser, updateUser, remove };
//tarea: agregar los endpoint de agregar, editar y eliminar un usuario
//module.exports = {getAll, getById}