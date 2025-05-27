// controllers/locationController.js
const { updateLiveLocation } = require('../services/locationService');

exports.handleUpdateLocation = async (req, res) => {
  const { user_id, lat, lon } = req.body;

  // ✅ Identity Check
  if (req.user.user_id !== user_id) {
    return res.status(403).json({ error: "You can't update another user's location" });
  }
  
  if (!user_id || !lat || !lon) {
    return res.status(400).json({ error: "Missing user_id, lat, or lon" });
  }

  try {
    const result = await updateLiveLocation(user_id, lat, lon);
    res.json({ status: result.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
