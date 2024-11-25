const {Router} = require('express');
const {getAllSuppliers, getSuppliersByRFC, createSupplier, updateSupplier, removeSupplier} = require('../controllers/suppliers');

const router = Router()

router.get('/', getAllSuppliers);
router.get('/:rfc', getSuppliersByRFC);
router.post('/', createSupplier);
router.put('/:rfc', updateSupplier);
router.delete('/:rfc', removeSupplier);

module.exports = router;