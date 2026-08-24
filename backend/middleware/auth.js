const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // Token thường được gửi kèm trong header dạng: "Bearer xxxxx"
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  const token = authHeader.split(" ")[1]; // Tách lấy phần token, bỏ chữ "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Gắn userId vào req để route sau dùng được
    next(); // Cho phép đi tiếp tới route handler thật sự
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

module.exports = verifyToken;
