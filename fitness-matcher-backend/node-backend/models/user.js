const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  user_id: { type: Number, unique: true, required: true },
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    minlength: [3, 'Name must be at least 3 characters'] 
  },
  Age: Number,
  Gender: String,
  Travel_Willingness_km: Number,
  Motivation_Level: String,
  Time_Flexibility: String,
  Coaching_Preference: [String],
  Fitness_Goal: [String],
  Workout_Style: [String],
  Workout_Type: [String],
  Preferred_Workout_Time: [String],
  Available_Days: [String],
  Preferred_Partner_Gender: [String],
  Preferred_Partner_Age_Range: [String],
  Preferred_Partner_Experience_Level: [String],
  home_location: {
    lat: Number,
    lon: Number
  },
  home_location_label: String
});

module.exports = mongoose.model('User', userSchema);
