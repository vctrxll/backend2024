const {Router} = require('express');

const {getMessage} = require('../controllers/users');
const {getAllUsers, getById} = require('../controllers/users');


const router = Router();


router.get('/', getAllUsers);
router.get('/:id', getById);

module.exports = router