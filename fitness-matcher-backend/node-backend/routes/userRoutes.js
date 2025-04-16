const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.put('/users/:user_id', verifyToken, userController.updateUser);

module.exports = router;
