const { Router } = require('express');
const {createPurchase, getAllPurchases, getPurchasesById} = require('../controllers/purchases');

const router = Router();

router.get('/', getAllPurchases);
router.get('/:id', getPurchasesById);
router.post('/', createPurchase);

module.exports = router;