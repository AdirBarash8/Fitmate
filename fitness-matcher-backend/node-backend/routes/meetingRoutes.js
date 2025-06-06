const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/meetings', verifyToken, meetingController.scheduleMeeting);
router.patch('/meetings/:meeting_id/status', verifyToken, meetingController.updateStatus); 
router.get('/meetings', verifyToken, meetingController.getMeetingsByUser);

module.exports = router;
