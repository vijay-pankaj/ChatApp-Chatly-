const authService = require("../services/auth.service");

const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.json({ message: "User created", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { signup, login };

