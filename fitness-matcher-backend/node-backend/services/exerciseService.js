const ExerciseStat = require('../models/exercise');
const Match = require('../models/match');

async function getDashboardStats(user_id) {
  const pastWeek = new Date();
  pastWeek.setDate(pastWeek.getDate() - 7);

  const lastWeekExercises = await ExerciseStat.find({
    user_id,
    date: { $gte: pastWeek }
  });

  const totalCalories = lastWeekExercises.reduce((sum, entry) => sum + entry.calories, 0);
  const totalMinutes = lastWeekExercises.reduce((sum, entry) => sum + entry.duration, 0);
  const matchesTotal = await Match.countDocuments({
    $or: [
      { user_id_1: user_id },
      { user_id_2: user_id }
    ]
  });

  return {
    matchesTotal,
    avgWorkoutTime: totalMinutes > 0 ? formatMinutes(totalMinutes / lastWeekExercises.length) : "0m",
    caloriesBurned: totalCalories
  };
}

function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

module.exports = { getDashboardStats };
