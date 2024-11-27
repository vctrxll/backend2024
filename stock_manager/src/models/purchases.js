const purchasesQueries = {
    getAllPurchases: 'SELECT * FROM purchases',
    getPurchasesById: 'SELECT * FROM purchases WHERE id = ?',
    createPurchase: 'INSERT INTO purchases (products_suppliers_id, quantity, payment_method, ticket, invoice, price) VALUES (?, ?, ?, ?, ?, ?)',
    checkProductSupplierId: 'SELECT id FROM products_suppliers WHERE id = ?',
};

module.exports = { purchasesQueries };
