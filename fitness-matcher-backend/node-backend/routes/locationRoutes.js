// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/update_location', verifyToken, locationController.handleUpdateLocation);

module.exports = router;
