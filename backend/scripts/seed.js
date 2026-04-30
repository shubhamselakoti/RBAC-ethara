require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = "Super Admin";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Seeded admin already exists:", email);
    process.exit(0);
  }

  await User.create({
    name,
    email,
    password,
    role: "admin",
    isApproved: true,
    isSeededAdmin: true,
    authProvider: "local",
  });

  console.log("Admin seeded successfully:", email);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
