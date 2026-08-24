const productListContainer = document.getElementById("product-list");
const cartCountDisplay = document.getElementById("cart-count");
const cartItemsList = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");

let cart = [];

// Gọi API lấy danh sách sản phẩm
fetch("http://localhost:3000/products")
  .then(function (response) {
    return response.json(); // Chuyển dữ liệu trả về thành JSON
  })
  .then(function (products) {
    renderProducts(products);
  })
  .catch(function (error) {
    console.log("Lỗi khi gọi API:", error);
  });

function renderProducts(products) {
  products.forEach(function (product) {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Giá: <span class="price">${product.price.toLocaleString()}đ</span></p>
            <button class="btn-cart">Thêm vào giỏ hàng</button>
        `;

    // Gắn sự kiện click cho nút vừa tạo
    const btn = div.querySelector(".btn-cart");
    btn.addEventListener("click", function () {
      addToCart(product.name, product.price);
    });

    productListContainer.appendChild(div);
  });
}

function addToCart(name, price) {
  const existingItem = cart.find(function (item) {
    return item.name === name;
  });

  if (existingItem) {
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(name) {
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
