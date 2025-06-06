const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  user_1: {
    type: Number,
    required: true,
  },
  user_2: {
    type: Number,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Declined'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
