const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function signup({ name, email, phone, password }) {
  const existing = await userModel.getUserByEmail(email);
  if (existing) throw new Error("User exists");

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.createUser({
    name,
    email,
    phone,
    password_hash: hash,
  });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
}

async function login({ email, password }) {
  const user = await userModel.getUserByEmail(email);
  if (!user) throw new Error("Invalid login");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Invalid login");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
}

module.exports = { signup, login };
