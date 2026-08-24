const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // Cho phép mọi nguồn gọi API tới server này

app.get("/", function (req, res) {
  res.send("Xin chào từ server Express!");
});

app.get("/products", function (req, res) {
  const products = [
    {
      id: 1,
      name: "Áo thun trắng basic",
      price: 150000,
      image:
        "https://aothun24h.vn/userfile/products/12301/2024_08_27_11_36_09_38.jpg",
    },
    {
      id: 2,
      name: "Quần jean xanh",
      price: 350000,
      image:
        "https://cdn.hstatic.net/products/1000402464/fwjn25fh04g___1__273ee08c2aa94c1c8f2a4c3f2ba0207e_master.jpg",
    },
    {
      id: 3,
      name: "Áo khoác denim",
      price: 450000,
      image:
        "https://cdn.hstatic.net/products/1000402464/jk26ss10p-ja_jean__1__2a766d876c00481fa234dfcded690885_master.jpg",
    },
  ];
  res.json(products);
});

app.listen(3000, function () {
  console.log("Server đang chạy tại http://localhost:3000");
});
