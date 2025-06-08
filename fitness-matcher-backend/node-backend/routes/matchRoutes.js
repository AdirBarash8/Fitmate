const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const verifyToken = require('../middleware/authMiddleware');

// 🔍 Get fresh matches from Python + cache + store in DB
router.get('/match', verifyToken, matchController.getMatchResults);

// 📦 Get stored matches from MongoDB (per user)
router.get('/matches/:user_id', verifyToken, matchController.getStoredMatches);

// 🗂️ Get all matches involving a user
router.get('/matches', verifyToken, matchController.getMatchesByUser);

// ✅ NEW: Mark a match as liked
router.patch('/matches/like', verifyToken, matchController.markAsLiked);

module.exports = router;
