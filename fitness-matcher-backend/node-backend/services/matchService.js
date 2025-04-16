const axios = require('axios');
const Match = require('../models/match');
 
/**
 * Calls the Python match service and returns the result.
 */
async function getMatchesFromPython(userId, topN = 10) {
  try {
    const response = await axios.get(`http://localhost:5000/match`, {
      params: {
        user_id: userId,
        top_n: topN
      }
    });
    return response.data;
  } catch (err) {
    console.error("Error calling Python service:", err.message);
    throw err;
  }
}
 
/**
 * Stores or updates the top matches for a user.
 * Overwrites previous matches and sets a new timestamp.
 */
async function storeMatchesForUser(userId, matches) {
  const bulkOps = matches.map(match => ({
    updateOne: {
      filter: {
        user_id_1: userId,
        user_id_2: match.user_id
      },
      update: {
        $set: {
          score: match.score,
          last_updated: new Date()
        }
      },
      upsert: true
    }
  }));
 
  await Match.bulkWrite(bulkOps);
 
  // Optional: clean up stale matches not in current top-N
  const matchedUserIds = matches.map(m => m.user_id);
  await Match.deleteMany({
    user_id_1: userId,
    user_id_2: { $nin: matchedUserIds }
  });
}
 
module.exports = {
  getMatchesFromPython,
  storeMatchesForUser
};