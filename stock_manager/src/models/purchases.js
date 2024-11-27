const purchasesQueries = {
    getAllPurchases: 'SELECT * FROM purchases',
    getPurchasesById: 'SELECT * FROM purchases WHERE purchaseId = ?',
    createPurchase: 'INSERT INTO purchases (products_suppliers_id, quantity, payment_method, ticket, invoice, price) VALUES (?, ?, ?, ?, ?, ?)',
    checkProductSupplierId: 'SELECT ps.product_id AS products_suppliers_id FROM products_suppliers ps JOIN products p ON ps.product_id = p.id JOIN suppliers s ON ps.supplier_rfc = s.rfc WHERE ps.product_id = 4',
};

module.exports = { purchasesQueries };
