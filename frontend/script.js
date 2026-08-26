const API_URL = "http://localhost:3000";

const productListContainer = document.getElementById("product-list");
const cartCountDisplay = document.getElementById("cart-count");

// Load sản phẩm khi mở trang
loadProducts();

async function loadProducts() {
  const response = await fetch(API_URL + "/products");
  const products = await response.json();
  renderProducts(products);
}

function renderProducts(products) {
  productListContainer.innerHTML = "";

  products.forEach(function (product) {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Giá: <span class="price">${product.price.toLocaleString()}đ</span></p>
            <button class="btn-cart">Thêm vào giỏ hàng</button>
        `;

    const btn = div.querySelector(".btn-cart");
    btn.addEventListener("click", function () {
      addToCart(product._id);
    });

    productListContainer.appendChild(div);
  });
}

async function addToCart(productId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vui lòng đăng nhập trước khi mua hàng!");
    window.location.href = "login.html"; // Chuyển hướng sang trang đăng nhập
    return;
  }

  await fetch(API_URL + "/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ productId: productId, quantity: 1 }),
  });

  alert("Đã thêm vào giỏ hàng!");
  if (window.updateCartBadge) {
    window.updateCartBadge(); // cập nhật số ở navbar
  }
}
