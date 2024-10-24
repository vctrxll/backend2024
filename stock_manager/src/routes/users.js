const {Router} = require('express');
const {getMessage} = require('../controllers/users');

const router = Router();

router.get('/', getMessage);

module.exports = router