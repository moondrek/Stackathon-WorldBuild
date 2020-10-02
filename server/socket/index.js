let playerList = {};

function getRoomName(socket) {
  if (playerList[socket.id]) {
    return `${playerList[socket.id].room.x}x${playerList[socket.id].room.y}`;
  } else return "0x0";
}

const socket = (socket) => {
  //on connection:
  console.log(`user ${socket.id} connected`);
  playerList[socket.id] = {
    room: { x: 0, y: 0 },
    location: { x: 100, y: 100 },
  };
  socket.join(getRoomName(socket));
  socket.to(getRoomName(socket)).emit("joined", {
    id: socket.id,
    location: playerList[socket.id].location,
  });

  //on disconnect
  socket.on("disconnect", () => {
    delete playerList[socket.id];
    socket.to(getRoomName(socket)).emit("left", {
      id: socket.id,
    });
    console.log(`user ${socket.id} disconnected`);
  });

  //log message
  socket.on("log", (msg) => {
    console.log(msg);
  });

  //when a player moves
  socket.on("i_move", (location) => {
    playerList[socket.id].location = location;
    console.log(socket.rooms);
    socket
      .to(getRoomName(socket))
      .emit("someone_moved", { id: socket.id, location });
  });

  //on a request for game state
  socket.on("request_game_state", () => {
    console.log(playerList);
    socket.emit("game_state", {
      playerList,
      id: socket.id,
      room: playerList[socket.id].room,
    });
  });

  //when a player changes rooms
  socket.on("change_room", (data) => {
    console.log(data);
    socket.to(getRoomName(socket)).emit("left", {
      id: socket.id,
    });
    socket.leave(getRoomName(socket));

    switch (data) {
      case "up":
        playerList[socket.id].room.y++;
        playerList[socket.id].location.y = 480;
        break;
      case "down":
        playerList[socket.id].room.y--;
        playerList[socket.id].location.y = 0;
        break;
      case "left":
        playerList[socket.id].room.x--;
        playerList[socket.id].location.x = 480;
        break;
      case "right":
        playerList[socket.id].room.x++;
        playerList[socket.id].location.x = 0;
        break;
      default:
        break;
    }
    socket.join(getRoomName(socket));
    socket.emit("room_changed");

    socket.to(getRoomName(socket)).emit("joined", {
      id: socket.id,
      location: playerList[socket.id].location,
    });
    console.log("room_changed", playerList);
  });
};

module.exports = socket;
