const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/auth");

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
app.post("/products", verifyToken, async function (req, res) {
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
app.put("/products/:id", verifyToken, async function (req, res) {
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
app.delete("/products/:id", verifyToken, async function (req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//route Đăng ký (/register)
app.post("/register", async function (req, res) {
  try {
    const { name, email, password } = req.body; //destructuring, cách viết gọn để lấy nhiều giá trị từ 1 object cùng lúc, tương đương: const name = req.body.name;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10); // Độ khó mã hoá(hash) = 10 càng cao càng an toàn nhưng càng chậm

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//route /login

app.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // So sánh password nhập vào với password đã hash trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Tạo token chứa id user, hết hạn sau 7 ngày
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập thành công!",
      token: token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const Cart = require("./models/Cart");

// Lấy giỏ hàng của user đang đăng nhập
app.get("/cart", verifyToken, async function (req, res) {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId",
    );

    if (!cart) {
      cart = { items: [] }; // Nếu chưa có giỏ hàng nào, trả về rỗng
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thêm sản phẩm vào giỏ hàng
app.post("/cart", verifyToken, async function (req, res) {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      // User chưa có giỏ hàng nào -> tạo mới
      cart = new Cart({ userId: req.userId, items: [] });
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.items.find(function (item) {
      return item.productId.toString() === productId;
    });

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: productId, quantity: quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa 1 sản phẩm khỏi giỏ hàng
app.delete("/cart/:productId", verifyToken, async function (req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    cart.items = cart.items.filter(function (item) {
      return item.productId.toString() !== req.params.productId;
    });

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const Order = require("./models/Order");

app.post("/checkout", verifyToken, async function (req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng đang trống" });
    }

    // Chuyển từng item trong giỏ hàng thành item của đơn hàng (chốt giá tại thời điểm này)
    const orderItems = cart.items.map(function (item) {
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
      };
    });

    const totalAmount = orderItems.reduce(function (sum, item) {
      return sum + item.price * item.quantity;
    }, 0);

    const newOrder = new Order({
      userId: req.userId,
      items: orderItems,
      totalAmount: totalAmount,
    });

    await newOrder.save();

    // Xóa sạch giỏ hàng sau khi đặt hàng thành công
    cart.items = [];
    await cart.save();

    res.json({ message: "Đặt hàng thành công!", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, function () {
  console.log("Server đang chạy tại http://localhost:3000");
});
