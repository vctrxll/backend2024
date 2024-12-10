const {request, response} = require('express');
const bcrypt = require('bcrypt');
const pool = require("../db/connection");
const {userQueries} = require("../models/users");

const login = async (req = request, res = response) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400).send({
            messange: "Some fields wrong",
        })
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const [user] = await conn.query(userQueries.getByEmail, [email]);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            res.status(401).send('Invalid credentials');
            return;
        }

        res.status(200).send({
            messange: "Successfully logged in",
            user
        });

    }catch(err) {
        res.status(500).send({error: err});
    }finally {
        if (conn) {conn.close();}
    }
}

module.exports = {
    login,
}