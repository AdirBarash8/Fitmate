const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/meetings', verifyToken, meetingController.scheduleMeeting);
router.put('/meetings/:meeting_id', verifyToken, meetingController.updateStatus);
router.get('/meetings', verifyToken, meetingController.getMeetingsByUser);

module.exports = router;
