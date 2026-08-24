// Import module http có sẵn trong Node.js
const http = require("http");

// Tạo server, xử lý mỗi khi có request (yêu cầu) gửi tới
const server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Xin chào từ server Node.js!");
});

// Cho server "lắng nghe" ở cổng (port) 3000
server.listen(3000, function () {
  console.log("Server đang chạy tại http://localhost:3000");
});
