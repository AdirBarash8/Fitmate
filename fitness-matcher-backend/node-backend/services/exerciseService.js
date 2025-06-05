const ExerciseStat = require('../models/exercise');

async function getDashboardStats(user_id) {
  const pastWeek = new Date();
  pastWeek.setDate(pastWeek.getDate() - 7);

  const lastWeekExercises = await ExerciseStat.find({
    user_id,
    date: { $gte: pastWeek }
  });

  const totalCalories = lastWeekExercises.reduce((sum, entry) => sum + entry.calories, 0);
  const totalMinutes = lastWeekExercises.reduce((sum, entry) => sum + entry.duration, 0);

  const matchesThisWeek = 9; // TODO: Replace with real match count later

  return {
    matchesThisWeek,
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
