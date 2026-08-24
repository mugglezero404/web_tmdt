const API_URL = "http://localhost:3000/products";

const form = document.getElementById("product-form");
const adminProductList = document.getElementById("admin-product-list");

// Load danh sách sản phẩm khi mở trang
loadProducts();

async function loadProducts() {
  const response = await fetch(API_URL);
  const products = await response.json();
  renderAdminProducts(products);
}

function renderAdminProducts(products) {
  adminProductList.innerHTML = "";

  products.forEach(function (product) {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Giá: <span class="price">${product.price.toLocaleString()}đ</span></p>
            <button class="btn-remove">Xóa</button>
        `;

    const deleteBtn = div.querySelector(".btn-remove");
    deleteBtn.addEventListener("click", function () {
      deleteProduct(product._id);
    });

    adminProductList.appendChild(div);
  });
}

// Xử lý submit form thêm sản phẩm
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Ngăn form load lại trang (hành vi mặc định của <form>)

  const newProduct = {
    name: document.getElementById("input-name").value,
    price: Number(document.getElementById("input-price").value),
    image: document.getElementById("input-image").value,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  form.reset(); // Xóa trắng form sau khi thêm
  loadProducts(); // Load lại danh sách để thấy sản phẩm mới
});

async function deleteProduct(id) {
  const confirmDelete = confirm("Bạn có chắc muốn xóa sản phẩm này?");
  if (!confirmDelete) return;

  await fetch(API_URL + "/" + id, {
    method: "DELETE",
  });

  loadProducts();
}
