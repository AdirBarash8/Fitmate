// services/matchCacheService.js
const redisClient = require('../redisClient');

async function getCachedMatches(user_id) {
  const key = `user:${user_id}:match_summary`;
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
}

async function setCachedMatches(user_id, matchResult) {
  const key = `user:${user_id}:match_summary`;

  const minimalResult = {
    summary: matchResult.summary,
    ranks: matchResult.ranks
  };

  await redisClient.set(key, JSON.stringify(minimalResult), { EX: 600 }); // 10 min
}

async function clearCachedMatches(user_id) {
  const key = `user:${user_id}:match_summary`;
  await redisClient.del(key);
}

module.exports = { getCachedMatches, setCachedMatches, clearCachedMatches };
