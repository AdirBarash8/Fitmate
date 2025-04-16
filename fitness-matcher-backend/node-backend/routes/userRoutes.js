const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

// GET user profile
router.get('/users/:user_id', verifyToken, userController.getUserById);

// PUT update profile
router.put('/users/:user_id', verifyToken, userController.updateUser);

module.exports = router;
