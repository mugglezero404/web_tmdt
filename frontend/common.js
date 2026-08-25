// Hiện tên user đã đăng nhập (nếu có)
const userName = localStorage.getItem("userName");
const greetingEl = document.getElementById("user-greeting");
if (greetingEl) {
  greetingEl.textContent = userName ? "Xin chào, " + userName : "";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}
