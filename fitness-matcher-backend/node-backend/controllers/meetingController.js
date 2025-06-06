const Meeting = require('../models/meeting');

exports.scheduleMeeting = async (req, res) => {
  console.log("➡️ Incoming meeting request:", req.body);
  try {
    const { user_1, user_2, datetime, location, status } = req.body;

    // Basic validation
    if (!user_1 || !user_2 || !datetime || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const datetimeISO = new Date(datetime);
    const now = new Date();

    // ⛔ Prevent scheduling in the past
    if (datetimeISO < now) {
      return res.status(400).json({ error: "Cannot schedule a meeting in the past." });
    }

    // 🔄 Prevent duplicate meetings within 30-minute window
    const start = new Date(datetimeISO);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // +30 min

    console.log("🔎 Checking for existing meeting between", user_1, "and", user_2, "from", start.toISOString(), "to", end.toISOString());

    const existing = await Meeting.findOne({
      datetime: { $gte: start, $lt: end },
      $or: [
        { user_1, user_2 },
        { user_1: user_2, user_2: user_1 }
      ]
    });

    if (existing) {
      return res.status(409).json({ error: "A meeting between these users is already scheduled at this time." });
    }

    const meeting = new Meeting({
      user_1,
      user_2,
      datetime: datetimeISO,
      location,
      status: status || 'Pending',
    });

    await meeting.save();
    res.status(201).json({ message: 'Meeting scheduled', meeting });

  } catch (error) {
    console.error("❌ Server error scheduling meeting:", error);
    res.status(500).json({ error: error.message });
  }
};

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
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Meeting not found' });

    res.json({ message: 'Status updated', meeting: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMeetingsByUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    const meetings = await Meeting.find({
      $or: [{ user_1: user_id }, { user_2: user_id }]
    }).sort({ datetime: 1 });

    res.json({ meetings });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
