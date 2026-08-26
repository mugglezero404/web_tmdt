const API_URL = "http://localhost:3000";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Xử lý đăng ký
if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const response = await fetch(API_URL + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    const registerMessage = document.getElementById("register-message");

    registerMessage.textContent = data.message;

    if (response.ok) {
      registerForm.reset();

      // Tự động chuyển sang trang đăng nhập sau khi đăng ký xong
      setTimeout(function () {
        window.location.href = "login.html";
      }, 1500);
    }
  });
}

// Xử lý đăng nhập
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(API_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    const loginMessage = document.getElementById("login-message");

    if (response.ok) {
      // Lưu token vào localStorage để dùng cho các lần gọi API sau
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", data.user.role); //thêm dòng này

      loginMessage.textContent =
        "Đăng nhập thành công! Xin chào " + data.user.name;
      // Tự động chuyển về trang chủ sau khi đăng nhập
      setTimeout(function () {
        window.location.href = "index.html";
      }, 1000);
    } else {
      loginMessage.textContent = data.message;
    }
  });
}
