const cartButtons = document.querySelectorAll(".btn-cart");
const cartCountDisplay = document.getElementById("cart-count");
const cartItemsList = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");

let cart = [];

cartButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const name = button.getAttribute("data-name");
    const price = Number(button.getAttribute("data-price"));

    addToCart(name, price);
  });
});

function addToCart(name, price) {
  // Tìm xem sản phẩm này đã có trong giỏ chưa
  const existingItem = cart.find(function (item) {
    return item.name === name;
  });

  if (existingItem) {
    // Nếu đã có → tăng số lượng lên 1
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    // Nếu chưa có → thêm mới với quantity = 1
    cart.push({ name: name, price: price, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(name) {
  // Giữ lại tất cả sản phẩm KHÔNG trùng tên với sản phẩm cần xóa
  cart = cart.filter(function (item) {
    return item.name !== name;
  });

  renderCart();
}

function renderCart() {
  cartItemsList.innerHTML = "";

  let total = 0;
  let totalQuantity = 0;

  cart.forEach(function (item) {
    const li = document.createElement("li");

    const itemTotal = item.price * item.quantity;
    total = total + itemTotal;
    totalQuantity = totalQuantity + item.quantity;

    li.textContent =
      item.name +
      " x" +
      item.quantity +
      " - " +
      itemTotal.toLocaleString() +
      "đ  ";

    // Tạo nút xóa
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Xóa";
    removeBtn.className = "btn-remove";
    removeBtn.addEventListener("click", function () {
      removeFromCart(item.name);
    });

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });

  cartCountDisplay.textContent = totalQuantity;
  cartTotalDisplay.textContent = total.toLocaleString();
}
