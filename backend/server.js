const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(function () {
    console.log("Đã kết nối MongoDB thành công!");
  })
  .catch(function (error) {
    console.log("Lỗi kết nối MongoDB:", error);
  });

// Viết API CRUD cho producds.js
// CREATE - thêm sản phẩm mới
app.post("/products", async function (req, res) {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
    });
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - lấy tất cả sản phẩm
app.get("/products", async function (req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - lấy 1 sản phẩm theo id
app.get("/products/:id", async function (req, res) {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - sửa sản phẩm theo id
app.put("/products/:id", async function (req, res) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // trả về dữ liệu SAU khi update
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - xóa sản phẩm theo id
app.delete("/products/:id", async function (req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, function () {
  console.log("Server đang chạy tại http://localhost:3000");
});
