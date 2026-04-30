const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

const approveUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isSeededAdmin) return res.status(403).json({ message: "Cannot modify seeded admin" });

  user.isApproved = true;
  await user.save();
  res.json({ message: "User approved" });
};

const rejectUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isSeededAdmin) return res.status(403).json({ message: "Cannot modify seeded admin" });

  user.isApproved = false;
  await user.save();
  res.json({ message: "User rejected" });
};

const approveAdminRequest = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isSeededAdmin) return res.status(403).json({ message: "Cannot modify seeded admin" });

  user.role = "admin";
  user.adminRequestPending = false;
  await user.save();
  res.json({ message: "Admin role granted" });
};

const rejectAdminRequest = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.adminRequestPending = false;
  await user.save();
  res.json({ message: "Admin request rejected" });
};

const promoteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isSeededAdmin) return res.status(403).json({ message: "Cannot modify seeded admin" });

  user.role = "admin";
  user.adminRequestPending = false;
  await user.save();
  res.json({ message: "User promoted to admin" });
};

const demoteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isSeededAdmin) return res.status(403).json({ message: "Cannot modify seeded admin" });

  user.role = "user";
  await user.save();
  res.json({ message: "User demoted to user" });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isSeededAdmin) return res.status(403).json({ message: "Cannot delete seeded admin" });
  if (req.params.id === req.user._id.toString())
    return res.status(403).json({ message: "Cannot delete yourself" });

  await user.deleteOne();
  res.json({ message: "User deleted" });
};

module.exports = {
  getAllUsers,
  approveUser,
  rejectUser,
  approveAdminRequest,
  rejectAdminRequest,
  promoteUser,
  demoteUser,
  deleteUser,
};
