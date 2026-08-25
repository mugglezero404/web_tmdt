const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const verifyToken = require("../middleware/auth");

router.post("/checkout", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId",
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống" });

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const newOrder = new Order({
      userId: req.userId,
      items: orderItems,
      totalAmount,
    });
    await newOrder.save();

    cart.items = [];
    await cart.save();

    res.json({ message: "Đặt hàng thành công!", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
