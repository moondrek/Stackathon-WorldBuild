class RoomList {
  constructor() {
    this.list = {
      "0, 0": new Room(0, 0),
    };

    this.create = this.create.bind(this);
    this.find = this.find.bind(this);
    this.findOrCreate = this.findOrCreate.bind(this);
  }

  create(x, y) {
    let newRoom = new Room(x, y);
    this.list[newRoom.name] = newRoom;
    return newRoom;
  }

  find(x = 0, y = 0) {
    return this.list[`${x}, ${y}`];
  }

  findOrCreate(x, y) {
    let room = this.find(x, y);
    if (room) {
      return room;
    } else {
      return this.create(x, y);
    }
  }
}

class Room {
  constructor(
    x,
    y,
    color1 = Math.floor(Math.random() * 16 ** 6),
    color2 = Math.floor(Math.random() * 16 ** 6),
    objects = [],
    players = {}
  ) {
    this.x = x;
    this.y = y;
    this.color1 = color1;
    this.color2 = color2;
    this.objects = objects;
    this.players = players;
  }

  get name() {
    return `${this.x}, ${this.y}`;
  }

  addPlayer(player) {
    const { id, displayName, position, holding, heldObject } = player;
    this.players[player.id] = {
      id,
      displayName,
      position,
      holding,
      heldObject,
    };
  }

  removePlayer(playerId) {
    delete this.players[playerId];
  }
}

module.exports = { RoomList, Room };
