const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Đăng ký
router.post("/register", async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Đăng nhập
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { userId: user._id, role: user.role }, // thêm role vào đây
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Đăng nhập thành công!",
      token: token,
      user: { name: user.name, email: user.email, role: user.role }, // trả thêm role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
