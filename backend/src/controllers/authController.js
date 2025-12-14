const authService = require('../services/authService');

async function signup(req, res) {
  try {
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const result = await authService.signup(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message,
      errorType: err.message === "User exists" ? "duplicate_email" : "validation_error"
    });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { signup, login };