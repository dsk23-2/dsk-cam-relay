const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server: http });

let clients = [];

wss.on("connection", (socket) => {
  clients.push(socket);
  socket.on("message", (msg) => {
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  socket.on("close", () => {
    clients = clients.filter((c) => c !== socket);
  });
});

app.get("/", (req, res) => {
  res.send("🔁 WebSocket Relay Aktif");
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
  console.log("Relay aktif di port", PORT);
});
