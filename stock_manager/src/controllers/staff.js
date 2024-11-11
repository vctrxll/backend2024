// controllers/staff.js
const { request, response } = require('express');
const pool = require('../../db/connection');
const { staffQueries } = require('../models/staff');

const getAllStaff = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const staff = await conn.query(staffQueries.getAll);
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

const getStaffById = async (req = request, res = response) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const staff = await conn.query(staffQueries.getById, [+id]);

        if (staff.length === 0) {
            res.status(404).send('Staff member not found');
            return;
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// controllers/staff.js
const createStaff = async (req = request, res = response) => {
    const { first_name, last_name, birth_date, gender, phone_number, email, address, user_id } = req.body;

    // Validación de datos
    if (!first_name || !last_name || !birth_date || !gender || !phone_number || !email || !address || isNaN(user_id)) {
        res.status(400).send('Bad Request. Some fields are missing or invalid');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Verificar si el user_id existe en la tabla users
        const [userExists] = await conn.query('SELECT id FROM users WHERE id = ? AND is_active = 1', [user_id]);
        if (!userExists) {
            res.status(404).send('User ID provided does not exist or is inactive');
            return;
        }

        // Crear el nuevo registro en la tabla staff
        const newStaff = await conn.query(staffQueries.create, [first_name, last_name, birth_date, gender, phone_number, email, address, user_id]);
        if (newStaff.affectedRows === 0) {
            res.status(500).send('Staff member could not be created');
            return;
        }

        res.status(201).send("Staff member created successfully");
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};



const updateStaff = async (req = request, res = response) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, address } = req.body;

    if (isNaN(id) || !first_name || !last_name || !email || !phone_number || !address) {
        res.status(400).send("Invalid request");
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const staff = await conn.query(staffQueries.getById, [+id]);
        if (staff.length === 0) {
            res.status(404).send("Staff member not found");
            return;
        }

        const result = await conn.query(staffQueries.update, [first_name, last_name, email, phone_number, address, +id]);
        if (result.affectedRows === 0) {
            res.status(500).send("Staff member could not be updated");
            return;
        }

        res.send("Staff member updated successfully");
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

const deleteStaff = async (req = request, res = response) => {
    const { id } = req.params;

    if (isNaN(id)) {
        res.status(400).send('ID must be a number');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const staff = await conn.query(staffQueries.getById, [+id]);
        if (staff.length === 0) {
            res.status(404).send('Staff member not found');
            return;
        }

        const deletedStaff = await conn.query(staffQueries.delete, [+id]);
        if (deletedStaff.affectedRows === 0) {
            res.status(500).send('Staff member could not be deleted');
            return;
        }
        res.send('Staff member deleted successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

module.exports = { getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff };