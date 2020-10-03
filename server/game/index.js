const { PlayerList } = require("./player");
const { RoomList } = require("./room");

class Game {
  constructor() {
    this.RoomList = new RoomList();
    this.PlayerList = new PlayerList(this.RoomList);
  }

  createNewPlayer(socket) {
    let player = this.PlayerList.create(socket.id);
    let room = this.RoomList.findOrCreate(0, 0);
    player.setRoom(room);
    room.addPlayer(player);

    socket.join(player.roomName);
    socket.to(player.roomName).emit("joined", player);
  }

  removePlayer(socket) {
    let player = this.PlayerList.find(socket.id);

    player.room.removePlayer(player.id);
    socket.to(player.roomName).emit("left", { id: socket.id });
    this.PlayerList.destroy(socket.id);
  }

  changePlayerPosition(socket, position) {
    let player = this.PlayerList.setPosition(socket.id, position.x, position.y);
    socket.to(player.roomName).emit("someone_moved", player);
  }

  getRoom(socket) {
    return this.PlayerList.find(socket.id).room;
  }

  changePlayerRoom(socket, dir) {
    const player = this.PlayerList.find(socket.id);

    //leave old room
    socket.to(player.roomName).emit("left", { id: socket.id });
    socket.leave(player.roomName);

    let { x, y } = player.room;
    switch (dir) {
      case "up":
        y++;
        player.position.y = 480;
        break;
      case "down":
        y--;
        player.position.y = 0;
        break;
      case "left":
        x--;
        player.position.x = 480;
        break;
      case "right":
        x++;
        player.position.x = 0;
        break;
      default:
        break;
    }

    player.setRoom(this.RoomList.findOrCreate(x, y));

    //join new room
    socket.join(player.roomName);
    console.log("rooms", socket.rooms);
    socket.to(player.roomName).emit("joined", player);
    socket.emit("room_changed");
  }

  getRoommates(socket) {
    let playerList = this.PlayerList.find(socket.id).room.players;

    return playerList;
  }
}

module.exports = Game;
