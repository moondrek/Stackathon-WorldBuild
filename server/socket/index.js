let Game = require("../game");
Game = new Game();

const socket = (socket) => {
  //on connection:
  console.log(`user ${socket.id} connected`);
  Game.createNewPlayer(socket);

  //on disconnect
  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
    Game.removePlayer(socket);
  });

  //log message
  socket.on("log", (msg) => {
    console.log(msg);
  });

  //when a player moves
  socket.on("i_move", (position) => {
    Game.changePlayerPosition(socket, position);
  });

  //on a request for game state
  socket.on("request_game_state", () => {
    socket.emit("game_state", {
      id: socket.id,
      playerList: Game.getRoommates(socket),
    });
  });

  //when a player changes rooms
  socket.on("change_room", (data) => {
    Game.changePlayerRoom(socket, data);
  });
};

module.exports = socket;

/*
playerId: {
  displayName: "",
  room: {x: 0, y: 0},
  location: {x: 100, y: 100},
  holding: true,
  heldObject: {
    name: "tree"
    displayName: "Tree",
    icon: "tree",
  }
}
*/

/*
  "0x0": {
    x: 0,
    y: 0,
    color1: 0x000000,
    color2: 0xffffff,
    contents: [
      {
        name: "tree"
        displayName: "Tree",
        icon: "tree",
        location: { x: 123, y: 123 } }
    ],
  },
*/
