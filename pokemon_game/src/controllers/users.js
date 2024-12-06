const {request, response} = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/connection');
const {userQueries} = require('../models/users');

const saltRounds = 10;

const getAllUsers = async (req = request, res=response) => {
    let conn;

    try{
        conn=await pool.getConnection();
        const users = await conn.query(userQueries.getAll);

        res.json(users);
        return;
    }catch(err){
        res.status(500).json(err);
        return;

    }finally{
        if(conn) conn.end()

    }
};
const getUserById = async (req = request, res= response) =>{
    const {id} = req.params;
    if(isNaN(id)){
        res.status(400).send('Invalid ID');
        return;
    }
    let conn;
    try{
        conn = await pool.getConnection();
        const [user] = await conn.query(userQueries.getById, [+id]);
        if(!user){
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
    const { first_name, last_name, email, password} = req.body;

    if (!first_name || !last_name || !email || !password) {
        res.status(400).send('Bad Request. Some fields are missing');
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();
        const [user_exits] = await conn.query(userQueries.getByEmail, [email]);
        if(user_exits){
            res.status(409).send('Email already exits');
            return;
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await conn.query(userQueries.create, [first_name, last_name, email, hashPassword]);
        if(newUser.affectedRows ===0){
            res.status(500).send('Error adding user');
            return;
        }
        res.status(201).send("user created succefully");
    }catch (error){
        res.status(500).send(error);
        return;
    }finally{
        if(conn) conn.end();
    }

}
const updateUser = async (req = request, res = response) => {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;
  
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
      conn = await pool.getConnection();
  
      // Verificar si el usuario existe
      const [user] = await conn.query(userQueries.getById, [+id]);
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
  
      // Verificar si el correo electrónico ya está en uso por otro usuario
      const [emailExist] = await conn.query(userQueries.emailvalid, [email, id]);
      if (emailExist) {
        res.status(409).send({ message: 'Email already in use' });
        return;
      }
  
      // Actualizar el usuario
      const { affectedRows } = await conn.query(userQueries.editUser, [
        first_name,
        last_name,
        email,
        id,
      ]);
  
      if (affectedRows === 0) {
        res.status(500).send({ message: 'User not updated' });
        return;
      }
  
      res.send("User updated successfully");
    } catch (error) {
      res.status(500).send(error);
      return;
    } finally {
      if (conn) conn.end();
    }
  };
  const destroyUser = async (req = request, res = response) => {
    const { id } = req.params;
  
    if (isNaN(id)) {
      res.status(400).send({ message: 'Invalid ID' });
      return;
    }
  
    let conn;
  
    try {
      conn = await pool.getConnection();
  
      // Verificar si el usuario existe
      const [user] = await conn.query(userQueries.getById, [+id]);
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
  
      // Eliminar el usuario
      const { affectedRows } = await conn.query(userQueries.deleteUser, [id]);
  
      if (affectedRows === 0) {
        res.status(500).send({ message: 'Error deleting user' });
        return;
      }
  
      res.send({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).send(error);
      return;
    } finally {
      if (conn) conn.end();
    }
  };



module.exports = {
    getAllUsers,
    getUserById,
    CreateUser,
    updateUser,
    destroyUser,
};