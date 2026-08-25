function renderNavbar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  // Tạo khung navbar
  const navbar = document.createElement("div");
  navbar.className = "navbar";

  // Các link điều hướng — luôn hiện, dù đăng nhập hay chưa
  const navLinks = document.createElement("div");
  navLinks.className = "nav-links";
  navLinks.innerHTML = `
        <a href="index.html">Trang chủ</a>
        <a href="orders.html">Đơn hàng của tôi</a>
        <a href="admin.html">Quản trị</a>
    `;

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
  window.location.href = "login.html";
}

// Tự động render navbar ngay khi file này được load
renderNavbar();
