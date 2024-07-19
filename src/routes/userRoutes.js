const express = require('express');
const { createUser, loginUser, getUserById, updateUser, getAllUsers, deleteUser, getUserByName } = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/users', validateUser, createUser);//registro
router.post('/login', loginUser);//login

router.get('/users/:id', authenticateToken, getUserById);// obter usuário pelo id
router.get('/getuserbyname', authenticateToken, getUserByName);
router.get('/users', authenticateToken, getAllUsers);//obter todos os usuário
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

module.exports = router;