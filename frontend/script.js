const API_URL = "http://localhost:3000";

const productListContainer = document.getElementById("product-list");
const cartCountDisplay = document.getElementById("cart-count");
const cartItemsList = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");

// Load sản phẩm khi mở trang
loadProducts();
loadCart();

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

// Kiểm tra đã đăng nhập chưa, trả về token hoặc null
function getToken() {
  return localStorage.getItem("token");
}

async function addToCart(productId) {
  const token = getToken();

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

  loadCart(); // Load lại giỏ hàng để cập nhật giao diện
}

async function loadCart() {
  const token = getToken();
  if (!token) {
    renderCart({ items: [] }); // Chưa đăng nhập -> hiện giỏ hàng rỗng
    return;
  }

  const response = await fetch(API_URL + "/cart", {
    headers: { Authorization: "Bearer " + token },
  });

  const cart = await response.json();
  renderCart(cart);
}

function renderCart(cart) {
  cartItemsList.innerHTML = "";
  let total = 0;
  let totalQuantity = 0;

  cart.items.forEach(function (item) {
    const product = item.productId; // Đã được populate đầy đủ thông tin
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    totalQuantity += item.quantity;

    const li = document.createElement("li");
    li.textContent =
      product.name +
      " x" +
      item.quantity +
      " - " +
      itemTotal.toLocaleString() +
      "đ  ";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Xóa";
    removeBtn.className = "btn-remove";
    removeBtn.addEventListener("click", function () {
      removeFromCart(product._id);
    });

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });

  cartCountDisplay.textContent = totalQuantity;
  cartTotalDisplay.textContent = total.toLocaleString();
}

async function removeFromCart(productId) {
  const token = getToken();

  await fetch(API_URL + "/cart/" + productId, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  loadCart();
}

async function checkout() {
  const token = getToken();

  if (!token) {
    alert("Vui lòng đăng nhập!");
    return;
  }

  const response = await fetch(API_URL + "/checkout", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
  });

  const data = await response.json();

  if (response.ok) {
    alert("Đặt hàng thành công!");
    loadCart();
  } else {
    alert(data.message);
  }
}
