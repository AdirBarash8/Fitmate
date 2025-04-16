// services/locationService.js
const redisClient = require('../redisClient');
const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '../logs/location_updates.log');

async function updateLiveLocation(user_id, lat, lon) {
  const key = `user:${user_id}:location`;
  const value = JSON.stringify({ lat, lon });

  try {
    await redisClient.set(key, value, { EX: 300 }); // 5-minute TTL

    const logEntry = `[✅ ${new Date().toISOString()}] user_id: ${user_id}, lat: ${lat}, lon: ${lon}\n`;
    fs.appendFileSync(LOG_PATH, logEntry);

    return { success: true, message: "Live location stored in Redis" };
  } catch (err) {
    const logEntry = `[❌ ${new Date().toISOString()}] user_id: ${user_id}, lat: ${lat}, lon: ${lon}, error: ${err.message}\n`;
    fs.appendFileSync(LOG_PATH, logEntry);
    throw new Error("Failed to store live location");
  }
}

module.exports = { updateLiveLocation };
