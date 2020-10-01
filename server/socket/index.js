const socket = (socket) => {
  //on connection:
  console.log(`user ${socket.id} connected`);
  socket.broadcast.emit("joined", { id: socket.id, location: { x: 0, y: 0 } });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });

  socket.on("log", (msg) => {
    console.log(msg);
  });
  socket.on("i_move", (location) => {
    socket.broadcast.emit("someone_moved", { id: socket.id, location });
  });
};

module.exports = socket;
