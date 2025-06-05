const { getDashboardStats } = require('../services/exerciseService');

exports.getDashboardData = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const stats = await getDashboardStats(user_id);
    res.json(stats);
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
