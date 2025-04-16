const User = require('../models/user');

async function addUser(userData) {
  const user = new User(userData);
  return await user.save();
}

module.exports = { addUser };
