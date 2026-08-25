const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Đã kết nối MongoDB thành công!"))
  .catch((err) => console.log("Lỗi kết nối MongoDB:", err));

// Sử dụng các Routes
app.use("/products", require("./routes/products"));
app.use("/", require("./routes/auth")); // Cho /register và /login
app.use("/cart", require("./routes/cart"));
app.use("/orders", require("./routes/orders")); // Bạn có thể gộp /checkout vào đây hoặc để riêng

// Route checkout nằm trong orderRoutes nên sẽ là /orders/checkout (tùy bạn đặt)
// Nếu muốn giữ đúng app.post("/checkout"), bạn hãy đổi trong server.js:
// app.use("/", orderRoutes);

app.listen(3000, () => {
  console.log("Server đang chạy tại http://localhost:3000");
});
