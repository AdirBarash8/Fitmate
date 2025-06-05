const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, dashboardController.getDashboardData);

module.exports = router;
