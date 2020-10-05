const Object = require("./object");

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
    objects = {},
    players = {} //not a reference to PlayerList objects
  ) {
    this.x = x;
    this.y = y;
    this.color1 = color1;
    this.color2 = color2;
    this.objects = objects;
    this.players = players;

    const randomObjects = () => {
      this.createRandomObject();
      if (Math.random() < 0.5) {
        randomObjects();
      }
    };

    randomObjects();
  }

  get name() {
    return `${this.x}, ${this.y}`;
  }

  createRandomObject() {
    const x = Math.floor(Math.random() * 480);
    const y = Math.floor(Math.random() * 480);
    this.createObject("bush", x, y);
  }

  createObject(key, x, y) {
    const obj = new Object(key, x, y);
    this.objects[obj.id] = obj;
    return this;
  }

  addObject(object) {
    this.objects[object.id] = object;
  }

  removeObject(id) {
    delete this.objects[id];
  }

  getObject(id) {
    return this.objects[id];
  }

  /* Player methods */

  addPlayer(player) {
    //copy keys to avoid circular reference
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

  getPlayer(playerId) {
    return this.players[playerId];
  }
}

module.exports = { RoomList, Room };
