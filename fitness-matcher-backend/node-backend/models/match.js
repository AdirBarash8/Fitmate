const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user_id_1: { type: Number, required: true }, // requesting user
  user_id_2: { type: Number, required: true }, // matched user
  score: { type: Number, required: true },
  last_updated: { type: Date, default: Date.now }
});

// Ensure uniqueness for user pair
matchSchema.index({ user_id_1: 1, user_id_2: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
