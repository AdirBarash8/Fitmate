const Meeting = require('../models/meeting');

// Schedule a meeting
exports.scheduleMeeting = async (req, res) => {
  try {
    const { match_id, datetime, location } = req.body;

    if (!match_id || !datetime || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMeeting = new Meeting({
      match_id,
      datetime,
      location,
      confirmation_status: 'Pending'
    });

    await newMeeting.save();
    res.status(201).json({ message: 'Meeting scheduled', meeting: newMeeting });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update confirmation status
exports.updateStatus = async (req, res) => {
  try {
    const { meeting_id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Meeting.findByIdAndUpdate(
      meeting_id,
      { confirmation_status: status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Meeting not found' });

    res.json({ message: 'Status updated', meeting: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get meetings for a specific user (optional future use)
exports.getMeetingsByUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    const meetings = await Meeting.find({ match_id: { $exists: true } }); // Simplified
    res.json({ meetings });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
