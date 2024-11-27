const {request, response} = require('express');
const pool = require('../../db/connection');
const {purchasesQueries} = require("../models/purchases");

const getAllPurchases = async  (req = request, res = response) =>{
    let conn;
    try{
        conn = await pool.connect();
        const purchases = await conn.query(purchasesQueries.getAllPurchases);

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
        const user = await conn.query(purchasesQueries.getPurchasesById, [+id]);
        res.send(user);
    }catch (error) {
        res.status(500).json(error);
    }finally {
        if(conn) conn.close();
    }
}

const createPurchase = async (req = request, res = response) => {
    const { products_suppliers_id, quantity, payment_method, ticket, invoice, price, id } = req.body;

    // Validar que los valores numéricos sean válidos
    if (isNaN(id) || isNaN(products_suppliers_id) || isNaN(quantity) || isNaN(price)) {
        return res.status(400).send('Invalid request: Numeric values are required');
    }

    let conn;
    try {
        conn = await pool.connect();

        // Verificar si el ID de la compra ya existe
        const idPurchase = await conn.query(purchasesQueries.getPurchasesById, [+id]);
        if (idPurchase.length > 0) {
            return res.status(409).send('Id already exists');
        }

        // Verificar si el products_suppliers_id es válido mediante el query con JOIN
        const productSupplierExists = await conn.query(purchasesQueries.checkProductSupplierId, [+products_suppliers_id]);
        if (productSupplierExists === 0) {
            res.status(404).send('products_suppliers_id  not found');
            return;
        }



        // Crear la compra
        const newPurchase = await conn.query(purchasesQueries.createPurchase, [+products_suppliers_id, +quantity, +payment_method, +ticket, +invoice, +price]);

        if (newPurchase.affectedRows === 0) {
            return res.status(500).send('Could not create Purchase');
        }

        res.status(201).send('Purchase created successfully');
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    } finally {
        if (conn) conn.close();
    }
};

module.exports = {createPurchase, getAllPurchases, getPurchasesById};