const { Router } = require('express');
const { getAllUsers, getUserById, CreateUser, updateUser, destroyUser} = require('../controllers/users');

const router = Router();
router.get('/', getAllUsers);
router.get('/:id',getUserById);
router.post('/', CreateUser);
router.put('/:id',updateUser);
router.delete('/:id', destroyUser);


module.exports = router;