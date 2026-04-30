const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    message: "Account created. Awaiting admin approval.",
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  const user = await User.findOne({ email, authProvider: "local" });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  if (!user.isApproved)
    return res.status(403).json({ message: "Account pending admin approval" });

  const token = generateToken(user._id);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved, adminRequestPending: user.adminRequestPending },
  });
};

const googleAuth = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: "No credential provided" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user && user.authProvider === "local") {
      return res.status(400).json({ message: "Email registered with password. Please login normally." });
    }

    if (!user) {
      user = await User.create({ name, email, googleId, authProvider: "google" });
    }

    if (!user.isApproved)
      return res.status(403).json({ message: "Account pending admin approval" });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved, adminRequestPending: user.adminRequestPending },
    });
  } catch (err) {
    res.status(400).json({ message: "Google authentication failed" });
  }
};

const getMe = async (req, res) => {
  const user = req.user;
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved, adminRequestPending: user.adminRequestPending });
};

module.exports = { signup, login, googleAuth, getMe };
