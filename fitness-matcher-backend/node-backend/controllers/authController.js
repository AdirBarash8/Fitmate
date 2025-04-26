const { registerUser, loginUser } = require("../services/authService");

exports.register = async (req, res) => {
  const { email, password, ...rest } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const user = await registerUser(email, password, rest); // ⬅️ בלי user_id
    res.status(201).json({ message: "User registered", user_id: user.user_id });
  } catch (err) {
    res.status(400).json({ error: err.message || "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user_id } = await loginUser(email, password);
    res.json({ token, user_id });
  } catch (err) {
    const message = err.message || "Login failed";
    res.status(401).json({ error: message });
  }
};
