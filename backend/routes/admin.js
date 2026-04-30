const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  approveUser,
  rejectUser,
  approveAdminRequest,
  rejectAdminRequest,
  promoteUser,
  demoteUser,
  deleteUser,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.patch("/users/:id/approve", approveUser);
router.patch("/users/:id/reject", rejectUser);
router.patch("/users/:id/approve-admin", approveAdminRequest);
router.patch("/users/:id/reject-admin", rejectAdminRequest);
router.patch("/users/:id/promote", promoteUser);
router.patch("/users/:id/demote", demoteUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
