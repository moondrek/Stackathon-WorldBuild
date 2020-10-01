let playerList = {};

const socket = (socket) => {
  //on connection:
  console.log(`user ${socket.id} connected`);
  playerList[socket.id] = { x: 0, y: 0 };

  socket.broadcast.emit("joined", {
    id: socket.id,
    location: { x: 0, y: 0 },
  });

  socket.on("disconnect", () => {
    delete playerList[socket.id];
    socket.broadcast.emit("left", {
      id: socket.id,
    });
    console.log(`user ${socket.id} disconnected`);
  });

  socket.on("log", (msg) => {
    console.log(msg);
  });
  socket.on("i_move", (location) => {
    socket.broadcast.emit("someone_moved", { id: socket.id, location });
  });

  socket.on("request_game_state", () => {
    socket.emit("game_state", { playerList, id: socket.id });
  });
};

module.exports = socket;
