const mongoose = require('mongoose');

const ExerciseStatSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  exercise: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  calories: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExerciseStat', ExerciseStatSchema);
