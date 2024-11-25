const {request, response} = require('express');
const pool = require('../../db/connection');
const {suppliersQueries} = require('../models/suppliers');

const getAllSuppliers = async (req = request, res = response) => {
    let conn
    try{
        conn = await pool.getConnection();
        const suppliers = await conn.query(suppliersQueries.getAll)

        res.send(suppliers);

    }catch (error) {
        res.status(500).send(error);
        return;
    }finally {
        if(conn) conn.close();
    }
}
const getSuppliersByRFC = async (req = request, res = response) => {
    const {rfc} = req.params
    if (rfc.length !== 13){
        res.status(400).send('Invalid RFC');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const suppliers =  await conn.query(suppliersQueries.getByRFC, [rfc]);
        res.send(suppliers);
    }catch (error) {
        res.status(500).send(error);
    }finally {
        if(conn) conn.close();
    }
};

const createSupplier = async (req = request, res = response) => {
    const {rfc, name, description, number_phone, email, address} = req.body;
    if (!rfc || !name || !description || !number_phone || !email || !address) {
        res.status(400).send('Bad Request. Some fields are missing');
        return;
    }
    if (rfc.length !== 13){
        res.status(400).send('Invalid RFC');
        return;
    }
    let conn;
    try{
        conn = await pool.getConnection();
        const supplier = conn.query(suppliersQueries.getByRFC, [rfc]);
        if(supplier.length > 0){
            res.status(400).send('RFC already exists');
            return;
        }
        const newSupplier = await conn.query(suppliersQueries.create, [rfc, name, description, number_phone, email, address]);
        if(newSupplier.affectedRows ===0){
            res.status(500).send('User could not be created');
            return;
        }
        res.status(201).send("user created succefully");
    }catch (error) {
        res.status(500).send(error);
        return;
    }finally {
        if(conn) conn.close();
    }
};

const updateSupplier = async (req = request, res = response) => {
    const {rfc} = req.params;
    const {name, description, number_phone, email, address} = req.body;

    if(rfc.length !== 13 || !name ){
        res.status(400).send('Invalid request');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const supplier = conn.query(suppliersQueries.getByRFC, [rfc]);
        if(supplier.length === 0){
            res.status(404).send('not found');
            return;
        }

        const result = await conn.query(suppliersQueries.update, [name, description, number_phone, email, address, rfc]);
        if(result.affectedRows ===0){
            res.status(500).send('Not be updated')
            return;
        }
        res.status(201).send("supplier updated succefully");
    }catch (error) {
        res.status(500).send(error);
    }finally {
        if(conn) conn.close();
    }
};

const removeSupplier = async (req = request, res = response) => {
    const {rfc} = req.params;

    if (rfc.length !== 13) {
        res.status(400).send('Invalid request');
        return;
    }
    let conn;
    try{
        conn = await pool.getConnection();
        const supplier = conn.query(suppliersQueries.getByRFC, [rfc]);
        if(supplier.length === 0){
            res.status(404).send('not found');
            return;
        }
        const result = await conn.query(suppliersQueries.delete, [rfc]);
        if(result.affectedRows ===0){
            res.status(500).send('Not been deleted');
            return;
        }
        res.status(201).send("supplier removed successfully");
    }catch (error) {
        res.status(500).send(error);
    }finally {
        if(conn) conn.close();
    }
}

module.exports = {getAllSuppliers, getSuppliersByRFC, updateSupplier, createSupplier, removeSupplier};