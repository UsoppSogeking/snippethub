const express = require('express');
const { createUser, loginUser, getUserById, updateUser, deleteUser, getUserByName } = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');
const authenticateToken = require('../middlewares/authenticateToken');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/users', validateUser, createUser);
router.post('/login', loginUser);

router.get('/users/:id', authenticateToken, getUserById);
router.get('/getuserbyname', authenticateToken, getUserByName);
router.put('/users/:id', authenticateToken, upload.single('profile_picture'), updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

module.exports = router;