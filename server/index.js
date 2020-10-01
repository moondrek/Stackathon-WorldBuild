const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const app = express();
const PORT = process.env.PORT || 1337;

app.use(express.static(path.join(__dirname, "..", "dist")));

let coord = { x: 0, y: 0 };

function init() {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  const io = socketio(server);
  io.on("connect", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
    socket.on("move", (move) => {
      console.log(move);
      coord[move.dir] = coord[move.dir] + move.delta;
      io.emit("move", coord);
    });
    socket.on("log", (msg) => {
      console.log(msg);
    });
  });
}

init();
