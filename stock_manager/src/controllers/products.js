const { request, response } = require('express');
const pool = require('../../db/connection');
const { productsQueries } = require('../models/products');

const getAllProducts = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const products = await conn.query(productsQueries.getAll);
        res.json(products);
    } catch (error) {
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
};

const getProductById = async (req = request, res = response) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const product = await conn.query(productsQueries.getById, [+id]);

        if (product.length === 0) {
            res.status(404).send("Product not found");

            return;
        }
        res.json(product[0]);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

const createProduct = async (req = request, res = response) => {
    const {
        product,
        description,
        stock,
        measurement_unit,
        price,
        discount
    } = req.body;

    // Validaciones básicas
    if (!product || !description || !stock || !measurement_unit || !price) {
        res.status(400).send("Required fields are missing");
        return;
    }

    // Validar que stock sea un número positivo
    if (isNaN(stock) || stock < 0) {
        res.status(400).send("Stock must be a positive number");
        return;
    }

    // Validar el precio
    if (isNaN(price) || price < 0 || price > 999.99) {
        res.status(400).send("Price must be a positive number and cannot exceed 999.99");
        return;
    }

    // Validar el descuento
    if (discount && (isNaN(discount) || discount < 0 || discount > 0.99)) {
        res.status(400).send("Discount must be between 0 and 0.99");
        return;
    }

    // Validar measurement_unit
    const validUnits = ['piece', 'meters', 'liters', 'square meters', 'cubic meters'];
    if (!validUnits.includes(measurement_unit)) {
        res.status(400).send("Invalid measurement unit");
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const result = await conn.query(
            productsQueries.create,
            [
                product,
                description,
                Math.floor(stock), // Asegurar que stock sea entero
                measurement_unit,
                Number(price).toFixed(2), // Formatear precio a 2 decimales
                discount ? Number(discount).toFixed(2) : null // Formatear descuento si existe
            ]
        );

        if (result.affectedRows === 0) {
            res.status(500).send("Product could not be created");
            return;
        }
        res.status(201).send("Product created successfully");
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
};

const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const {
        product,
        description,
        stock,
        measurement_unit,
        price,
        discount
    } = req.body;

    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    // Verificar que al menos un campo sea proporcionado
    if (!product && !description && stock === undefined &&
        !measurement_unit && price === undefined && discount === undefined) {
        res.status(400).json({ message: 'At least one field is required for update' });
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Verificar si el producto existe
        const existingProduct = await conn.query(productsQueries.getById, [+id]);
        if (existingProduct.length === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        // Preparar los campos a actualizar
        const updates = {
            product: product || existingProduct[0].product,
            description: description || existingProduct[0].description,
            stock: stock !== undefined ? stock : existingProduct[0].stock,
            measurement_unit: measurement_unit || existingProduct[0].measurement_unit,
            price: price !== undefined ? Number(price).toFixed(2) : existingProduct[0].price,
            discount: discount !== undefined ? Number(discount).toFixed(2) : existingProduct[0].discount
        };

        // Validaciones
        if (updates.stock < 0) {
            res.status(400).json({ message: 'Stock cannot be negative' });
            return;
        }

        if (updates.price < 0 || updates.price > 999.99) {
            res.status(400).json({ message: 'Price must be between 0 and 999.99' });
            return;
        }

        const validUnits = ['piece', 'meters', 'liters', 'square meters', 'cubic meters'];
        if (!validUnits.includes(updates.measurement_unit)) {
            res.status(400).json({ message: 'Invalid measurement unit' });
            return;
        }

        if (updates.discount && (updates.discount < 0 || updates.discount > 0.99)) {
            res.status(400).json({ message: 'Discount must be between 0 and 0.99' });
            return;
        }

        const result = await conn.query(
            productsQueries.update,
            [
                updates.product,
                updates.description,
                updates.stock,
                updates.measurement_unit,
                updates.price,
                updates.discount,
                +id
            ]
        );

        if (result.affectedRows === 0) {
            res.status(500).json({ message: 'Product could not be updated' });
            return;
        }

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
};


const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;

    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Verificar si el producto existe
        const product = await conn.query(productsQueries.getById, [+id]);
        if (product.length === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        const result = await conn.query(productsQueries.delete, [+id]);

        if (result.affectedRows === 0) {
            res.status(500).json({ message: 'Product could not be deleted' });
            return;
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};