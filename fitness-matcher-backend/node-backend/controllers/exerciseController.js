const ExerciseStat = require("../models/exercise");

const addExercise = async (req, res) => {
  try {
    const { user_id, exercise, duration, calories } = req.body;

    if (!user_id || !exercise || !duration || !calories) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newExercise = new ExerciseStat({
      user_id,
      exercise,
      duration,
      calories,
    });

    await newExercise.save();
    res.status(201).json({ message: "Exercise added successfully", data: newExercise });
  } catch (error) {
    console.error("Error adding exercise:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getExercisesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const exercises = await ExerciseStat.find({ user_id }).sort({ date: -1 });
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addExercise,
  getExercisesByUser,
};
