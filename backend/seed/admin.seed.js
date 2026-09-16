require("dotenv").config();
const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs"),
  User = require("../models/User");
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || "admin@saddleandcrest.com",
    password = process.env.ADMIN_PASSWORD || "ChangeMe@123";
  let u = await User.findOne({ email });
  if (u) {
    u.role = "admin";
    u.isActive = true;
    u.password = await bcrypt.hash(password, 12);
    await u.save();
  } else
    await User.create({
      name: "Saddle & Crest Admin",
      email,
      password: await bcrypt.hash(password, 12),
      role: "admin",
    });
  console.log(`Admin ready: ${email}`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
