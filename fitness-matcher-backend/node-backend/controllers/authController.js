const { registerUser, loginUser } = require('../services/authService');

exports.register = async (req, res) => {
  const { email, password, user_id, ...rest } = req.body;

  if (!email || !password || !user_id) {
    return res.status(400).json({ error: 'Missing email, password, or user_id' });
  }

  try {
    const user = await registerUser(email, password, { user_id, ...rest });
    res.status(201).json({ message: 'User registered', user_id: user.user_id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user_id } = await loginUser(email, password);
    res.json({ token, user_id });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
