class PlayerList {
  constructor() {
    this.list = {};
  }

  create(id) {
    this.list[id] = new Player(id);
    return this.list[id];
  }

  find(id) {
    return this.list[id];
  }

  destroy(id) {
    delete this.list[id];
  }

  setPosition(id, x, y) {
    let player = this.find(id);
    return player.setPosition(x, y);
  }

  setRoom(id, room) {
    let player = this.find(id);
    return player.setRoom(room);
  }

  moveRoom(id, dir) {
    let player = this.find(id);
    return player.moveRoom(dir);
  }
}

class Player {
  constructor(
    id,
    displayName = "Wanderer",
    room,
    position = { x: 100, y: 100 },
    holding = false,
    heldObject = {}
  ) {
    this.id = id;
    this.displayName = displayName;
    this.room = room;
    this.position = position;
    this.holding = holding;
    this.heldObject = heldObject;
  }

  get roomName() {
    return this.room.name;
  }

  setRoom(room) {
    if (this.room) {
      this.room.removePlayer(this.id);
    }
    this.room = room;
    room.addPlayer(this);
    return this;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    return this;
  }

  grabObject(object) {
    if (this.holding !== true) {
      this.heldObject = object;
      this.holding = true;
    }
    return this;
  }

  dropObject() {
    if (this.holding === true) {
      this.holding = false;
    }
    return this;
  }
}

module.exports = { Player, PlayerList };
