const User = require("../models/User");

const requestAdminRole = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.role === "admin")
    return res.status(400).json({ message: "Already an admin" });
  if (user.adminRequestPending)
    return res.status(400).json({ message: "Request already pending" });

  user.adminRequestPending = true;
  await user.save();
  res.json({ message: "Admin role request submitted" });
};

const cancelAdminRequest = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.adminRequestPending = false;
  await user.save();
  res.json({ message: "Request cancelled" });
};

module.exports = { requestAdminRole, cancelAdminRequest };
