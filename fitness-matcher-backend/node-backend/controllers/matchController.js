const { getMatchesFromPython, storeMatchesForUser } = require('../services/matchService');
const { getCachedMatches, setCachedMatches } = require('../services/matchCacheService');
const Match = require('../models/match');
const User = require('../models/user');
 
exports.getMatchResults = async (req, res) => {
  const userId = req.user.user_id;
  const topN = Number(req.query.top_n || 10);

  if (req.user.user_id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const cached = await getCachedMatches(userId);
    const result = cached || await getMatchesFromPython(userId, topN);

    if (!cached) {
      await setCachedMatches(userId, result);
      await storeMatchesForUser(userId, result.ranks);
    }

    // 🔍 Extract user_ids of matches
    const matchedIds = result.ranks.map(m => m.user_id);

    // 🔍 Get user profiles from DB
    const users = await User.find({ user_id: { $in: matchedIds } });

    // 🔗 Merge the user info into the matches
    const enrichedMatches = result.ranks.map(rank => {
      const user = users.find(u => u.user_id === rank.user_id);
      return {
        user_id: rank.user_id,
        score: rank.score,
        name: user?.name || null,
        Age: user?.Age || null,
        Gender: user?.Gender || null,
        Workout_Type: user?.Workout_Type || [],
        Fitness_Goal: user?.Fitness_Goal || [],
        home_location_label: user?.home_location_label || null
      };
    });

    res.json({
      from_cache: !!cached,
      matches: enrichedMatches,
      duration: result.duration
    });

  } catch (error) {
    console.error("Error in getMatchResults:", error);
    res.status(500).json({ error: 'Matching failed' });
  }
};
 
exports.getStoredMatches = async (req, res) => {
  const requestedUserId = Number(req.params.user_id);

  if (req.user.user_id !== requestedUserId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const matches = await Match.find({
      user_id_1: requestedUserId,
      liked: true
    })
      .sort({ score: -1 })
      .select({ user_id_2: 1, score: 1, _id: 0 });

    const matchedUserIds = matches.map(m => m.user_id_2);

    const users = await User.find({ user_id: { $in: matchedUserIds } })
      .select("-password -email -__v -_id"); 

    const fullMatches = matches.map(match => {
      const userData = users.find(u => u.user_id === match.user_id_2);
      return {
        user_id: match.user_id_2,
        score: match.score,
        ...userData?._doc
      };
    });

    res.json({
      user_id: requestedUserId,
      match_count: fullMatches.length,
      matches: fullMatches
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve liked matches', details: err.message });
  }
};

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

exports.markAsLiked = async (req, res) => {
  const user_id_1 = req.user.user_id;
  const user_id_2 = req.body.user_id_2;
  const liked = req.body.liked;

  if (!user_id_2 || typeof liked !== 'boolean') {
    return res.status(400).json({ error: "Missing user_id_2 or liked value" });
  }

  try {
    const result = await Match.updateOne(
      { user_id_1, user_id_2 },
      {
        $set: {
          liked,
          last_updated: new Date(),
        },
      },
      { upsert: true } // 🔁 insert if not exists
    );

    res.json({
      message: `Match ${liked ? 'liked 👍' : 'disliked 👎'} and saved`,
    });
  } catch (err) {
    console.error("Error updating like status:", err.message);
    res.status(500).json({ error: "Failed to update like status" });
  }
};