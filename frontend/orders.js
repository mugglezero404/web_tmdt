const API_URL = "http://localhost:3000";
const orderListContainer = document.getElementById("order-list");

loadOrders();

async function loadOrders() {
  const token = localStorage.getItem("token");

  if (!token) {
    orderListContainer.innerHTML = "<p>Vui lòng đăng nhập để xem đơn hàng.</p>";
    return;
  }

  const response = await fetch(API_URL + "/orders", {
    headers: { Authorization: "Bearer " + token },
  });

  const orders = await response.json();
  renderOrders(orders);
}

function renderOrders(orders) {
  if (orders.length === 0) {
    orderListContainer.innerHTML = "<p>Bạn chưa có đơn hàng nào.</p>";
    return;
  }

  orderListContainer.innerHTML = "";

  orders.forEach(function (order) {
    const div = document.createElement("div");
    div.className = "cart-box";

    let itemsHtml = "";
    order.items.forEach(function (item) {
      itemsHtml +=
        "<li>" +
        item.name +
        " x" +
        item.quantity +
        " - " +
        (item.price * item.quantity).toLocaleString() +
        "đ</li>";
    });

    const orderDate = new Date(order.createdAt).toLocaleString("vi-VN");

    div.innerHTML = `
            <p><strong>Ngày đặt:</strong> ${orderDate}</p>
            <p><strong>Trạng thái:</strong> ${order.status}</p>
            <ul>${itemsHtml}</ul>
            <p><strong>Tổng tiền: ${order.totalAmount.toLocaleString()}đ</strong></p>
        `;

    orderListContainer.appendChild(div);
  });
}
