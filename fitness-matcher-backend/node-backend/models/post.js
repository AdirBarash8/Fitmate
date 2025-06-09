const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user_id: {
    type: String, // או Number – תלוי איך את שומרת את ה־user_id
    required: true,
  },
  authorName: {
    type: String,
    default: "Anonymous",
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: [String], // או [Number]
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
