function renderNavbar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole"); // thêm dòng này

  // Tạo khung navbar
  const navbar = document.createElement("div");
  navbar.className = "navbar";

  // Các link điều hướng — luôn hiện, dù đăng nhập hay chưa
  const navLinks = document.createElement("div");
  navLinks.className = "nav-links";
  let linksHtml = `
    <a href="index.html">Trang chủ</a>
    <a href="orders.html">Đơn hàng của tôi</a>
  `;

  // Nếu là admin thì thêm Quản trị
  if (userRole === "admin") {
    linksHtml += `
      <a href="admin.html">Quản trị</a>
    `;
  }

  navLinks.innerHTML = linksHtml;

  // Khu vực bên phải: tùy trạng thái đăng nhập
  const navUser = document.createElement("div");
  navUser.className = "nav-user";

  if (token) {
    // Đã đăng nhập -> hiện tên + nút đăng xuất
    navUser.innerHTML = `
            <span>Xin chào, ${userName}</span>
            <button class="btn-logout" id="logout-btn">Đăng xuất</button>
        `;
  } else {
    // Chưa đăng nhập -> hiện link đăng nhập/đăng ký
    navUser.innerHTML = `<a href="login.html">Đăng nhập / Đăng ký</a>`;
  }

  navbar.appendChild(navLinks);
  navbar.appendChild(navUser);

  // Chèn navbar vào đầu thẻ <body>
  document.body.prepend(navbar);

  // Gắn sự kiện cho nút đăng xuất (nếu có)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole"); // thêm dòng này
  window.location.href = "login.html";
}

function renderNavbar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const navbar = document.createElement("div");
  navbar.className = "navbar";

  const navLinks = document.createElement("div");
  navLinks.className = "nav-links";

  let linksHtml = `
        <a href="index.html">Trang chủ</a>
        <a href="cart.html">🛒 Giỏ hàng (<span id="nav-cart-count">0</span>)</a>
        <a href="orders.html">Đơn hàng của tôi</a>
    `;

  if (userRole === "admin") {
    linksHtml += `<a href="admin.html">Quản trị</a>`;
  }

  navLinks.innerHTML = linksHtml;

  const navUser = document.createElement("div");
  navUser.className = "nav-user";

  if (token) {
    navUser.innerHTML = `
            <span>Xin chào, ${userName}</span>
            <button class="btn-logout" id="logout-btn">Đăng xuất</button>
        `;
  } else {
    navUser.innerHTML = `
            <a href="login.html">Đăng nhập</a>
            <a href="register.html">Đăng ký</a>
        `;
  }

  navbar.appendChild(navLinks);
  navbar.appendChild(navUser);
  document.body.prepend(navbar);

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  if (token) {
    updateCartBadge();
  }
}

// Gọi API lấy số lượng giỏ hàng, cập nhật lên số ở navbar
async function updateCartBadge() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const API_URL = "http://localhost:3000"; // hoặc link Render

  try {
    const response = await fetch(API_URL + "/cart", {
      headers: { Authorization: "Bearer " + token },
    });
    const cart = await response.json();

    const totalQuantity = (cart.items || []).reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);

    const badge = document.getElementById("nav-cart-count");
    if (badge) {
      badge.textContent = totalQuantity;
    }
  } catch (error) {
    console.log("Lỗi lấy giỏ hàng:", error);
  }
}

window.updateCartBadge = updateCartBadge; // để script.js gọi được sau khi thêm giỏ hàng

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
}

// Tự động render navbar ngay khi file này được load
renderNavbar();
