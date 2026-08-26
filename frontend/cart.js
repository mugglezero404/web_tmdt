const API_URL = "http://localhost:3000"; // hoặc link Render

const cartItemsList = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");

loadCart();

function getToken() {
  return localStorage.getItem("token");
}

async function loadCart() {
  const token = getToken();

  if (!token) {
    cartItemsList.innerHTML = "<p>Vui lòng đăng nhập để xem giỏ hàng.</p>";
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

  if (!cart.items || cart.items.length === 0) {
    cartItemsList.innerHTML = "<p>Giỏ hàng đang trống.</p>";
    cartTotalDisplay.textContent = "0";
    return;
  }

  let total = 0;

  cart.items.forEach(function (item) {
    const product = item.productId;
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

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

  const response = await fetch(API_URL + "/orders/checkout", {
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
