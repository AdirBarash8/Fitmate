const { addUser } = require('../services/userService');
const { clearCachedMatches } = require('../services/matchCacheService');
const User = require('../models/user');
 
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
 
    if (!userData.user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
 
    const newUser = await addUser(userData);
    res.status(201).json({ message: 'User created', user_id: newUser.user_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.updateUser = async (req, res) => {
  const targetId = Number(req.params.user_id);
 
  // ✅ Allow if same user or admin
  const isSelf = req.user.user_id === targetId;
  const isAdmin = req.user.isAdmin === true;
 
  if (!isSelf && !isAdmin) {
    return res.status(403).json({ error: "Unauthorized update attempt" });
  }
 
  try {
    const updateFields = req.body;
    delete updateFields.email;
    delete updateFields.password;
 
    const updatedUser = await User.findOneAndUpdate(
      { user_id: targetId },
      { $set: updateFields },
      { new: true }
    );
 
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
 
    // ✅ Clear cached matches for this user
    await clearCachedMatches(targetId);
 
    res.json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err.message });
  }
};
 
exports.getUserById = async (req, res) => {
  const userId = Number(req.params.user_id);
 
  if (req.user.user_id !== userId && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
 
  try {
    const user = await User.findOne({ user_id: userId }).select('-password -_id');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};