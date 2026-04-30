const express = require("express");
const router = express.Router();
const { requestAdminRole, cancelAdminRequest } = require("../controllers/userController");
const { protect, approvedOnly } = require("../middleware/auth");

router.post("/request-admin", protect, approvedOnly, requestAdminRole);
router.delete("/request-admin", protect, approvedOnly, cancelAdminRequest);

module.exports = router;
