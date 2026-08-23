// Lấy TẤT CẢ các nút có class "btn-cart"
const cartButtons = document.querySelectorAll(".btn-cart");

// Biến đếm số sản phẩm trong giỏ
let cartCount = 0;

// Lặp qua từng nút, gắn sự kiện click cho mỗi nút
cartButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    cartCount = cartCount + 1;
    alert("Đã thêm vào giỏ hàng! Giỏ hàng hiện có " + cartCount + " sản phẩm.");
  });
});
