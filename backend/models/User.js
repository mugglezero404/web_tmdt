const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // '"unique: true:" MongoDB sẽ chặn không cho 2 user trùng email.
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
