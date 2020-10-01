const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const app = express();
const PORT = process.env.PORT || 1337;

app.use(express.static(path.join(__dirname, "..", "dist")));

function init() {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  const io = socketio(server);
  io.on("connect", require("./socket"));
}

init();
