const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

async function registerUser(email, password, profileData) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 12);

  // 📢 חישוב user_id חדש אוטומטי
  const lastUser = await User.findOne().sort({ user_id: -1 });
  const newUserId = lastUser ? lastUser.user_id + 1 : 1;

  const user = new User({
    ...profileData,
    email,
    password: hashedPassword,
    user_id: newUserId, // 🔥 שים לב
  });

  await user.save();
  return user;
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });

  // 🔍 Now returns specific error if user not found
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid password');

  const token = jwt.sign(
    { user_id: user.user_id, email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user_id: user.user_id };
}

module.exports = { registerUser, loginUser };
