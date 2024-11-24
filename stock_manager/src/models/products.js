const productsQueries = {
    getAll: 'SELECT * FROM products', // Elimina el filtro WHERE is_active = 1
    getById: 'SELECT * FROM products WHERE id = ?', // Elimina is_active de esta consulta también
    create: `
        INSERT INTO products (
            product, description, stock, measurement_unit, 
            price, discount
        ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    update: `
        UPDATE products 
        SET product = ?, 
            description = ?, 
            stock = ?, 
            measurement_unit = ?, 
            price = ?, 
            discount = ?
        WHERE id = ?
    `,
    delete: 'DELETE FROM products WHERE id = ?' // Cambia esto para eliminar completamente el producto
};

module.exports = {productsQueries};