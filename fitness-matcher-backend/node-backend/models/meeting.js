const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  match_id: { type: Number, required: true },
  datetime: { type: Date, required: true },
  location: { type: String, required: true },
  confirmation_status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Declined'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Meeting', meetingSchema);
