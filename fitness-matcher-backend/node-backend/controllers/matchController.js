const { getMatchesFromPython, storeMatchesForUser } = require('../services/matchService');
const { getCachedMatches, setCachedMatches } = require('../services/matchCacheService');
const Match = require('../models/match');
 
exports.getMatchResults = async (req, res) => {
  const userId = req.user.user_id;
  const topN = Number(req.query.top_n || 10);
 
  // ✅ Identity Check
  if (req.user.user_id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
 
  try {
    // ✅ Try Redis cache first
    const cached = await getCachedMatches(userId);
    if (cached) {
      return res.json({ from_cache: true, ...cached });
    }
 
    // 🔁 No cache — get fresh matches from Python
    const result = await getMatchesFromPython(userId, topN);
 
    // ✅ Cache a lightweight version
    await setCachedMatches(userId, result);
 
    // ✅ Save current top matches to Match collection
    await storeMatchesForUser(userId, result.ranks);
 
    res.json({ from_cache: false, ...result });
 
  } catch (error) {
    console.error("Error in getMatchResults:", error);
    res.status(500).json({ error: 'Matching failed' });
  }
};
 
 
exports.getStoredMatches = async (req, res) => {
  const requestedUserId = Number(req.params.user_id);
 
  // ✅ Ensure user is fetching their own data
  if (req.user.user_id !== requestedUserId) {
    return res.status(403).json({ error: 'Access denied' });
  }
 
  try {
    const matches = await Match.find({ user_id_1: requestedUserId })
      .sort({ score: -1 })
      .select({ user_id_2: 1, score: 1, _id: 0 });
 
    res.json({
      user_id: requestedUserId,
      match_count: matches.length,
      matches: matches.map(m => ({
        user_id: m.user_id_2,
        score: m.score
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve matches', details: err.message });
  }
}

exports.getMatchesByUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    const matches = await Match.find({
      $or: [{ user_id_1: user_id }, { user_id_2: user_id }]
    }).sort({ last_updated: -1 });

    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

  