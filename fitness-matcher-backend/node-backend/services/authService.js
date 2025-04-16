const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

async function registerUser(email, password, profileData) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ ...profileData, email, password: hashedPassword });

  await user.save();
  return user;
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

    const token = jwt.sign(
    { user_id: user.user_id, email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '1h' }
    );
  return { token, user_id: user.user_id };
}

module.exports = { registerUser, loginUser };
