const {request, response} = require('express');
const pool = require('../../db/connection');
const {purchases} = require('../models/purchases');
const {purchasesQueries} = require("../models/users");

const getAllPurchases = async  (req = request, res = response) =>{
    let conn;
    try{
        conn = await pool.connect();
        const purchases = await conn.query(purchasesQueries.getPurchasesAll);

        res.send(purchases);
    }catch (error) {
        res.status(500).json(error);
        return;
    }finally {
        if(conn) conn.close();
    }
}

const getPurchasesById = async (req = request, res = response) =>{
    const {id} = req.params;
    if(isNaN(id)){
        res.status(400).send('Invalid ID');
    }

    let conn;
    try{
        conn = await pool.getConnection();
        const user = await conn.query(usersQueries.getPurchasesById, [+id]);
    }catch (error) {
        res.status(500).json(error);
    }finally {
        if(conn) conn.close();
    }
}

const createPurchase = async (req = request, res = response) =>{
    const {products_suppliers_id, quantity, payment_method, ticket, invoice, price, id} = req.body;
    if (isNaN(id) || isNaN(products_suppliers_id) || isNaN(quantity) || isNaN(price)) {
        res.status(400).send('Invalid request');
    }
    let conn;
    try{
        conn = await pool.connect();
        
    }
}