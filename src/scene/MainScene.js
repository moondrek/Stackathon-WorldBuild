import Phaser from "phaser";
import { Player, Character, createControl } from "../object";
import socket from "../socket";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.playerList = {};
    this.objectList = {};

    //load all socket.ons in the constructor
    //otherwise they get declared every room change
    socket.on("game_state", (data) => {
      console.log(`data loaded, room: ${data.room.x}, ${data.room.y}`);
      this.bg.setFillStyle(data.room.color1);
      this.bg.setAltFillStyle(data.room.color2);

      //load objects
      for (let id in data.room.objects) {
        const obj = data.room.objects[id];
        this.objectList[id] = this.objects.create(obj.x, obj.y, obj.key);
        this.objectList[id].id = id;
        this.objectList[id].isHeld = false;
      }
      this.objects.setDepth(1);
      for (let id in data.playerList) {
        if (id == data.id) {
          let me = data.playerList[id];

          // set my location
          this.player.entity.setVisible(true);
          this.player.entity.setPosition(me.position.x, me.position.y);

          //load held object
          if (me.heldObject) {
            const id = me.heldObject.id;
            this.player.holding = true;
            this.player.heldObject = this.objectList[id];
          }
        } else {
          this.playerList[id] = new Character( // render other player
            this,
            "player",
            data.playerList[id].position
          );
        }
      }
    });

    /* Synchronize other player actions */
    socket.on("joined", (data) => {
      this.playerList[data.id] = new Character(this, "player", data.position);
    });
    socket.on("left", (data) => {
      this.playerList[data.id].entity.destroy();
      delete this.playerList[data.id];
    });
    socket.on("someone_moved", (data) => {
      this.playerList[data.id].entity.setPosition(
        data.position.x,
        data.position.y
      );
    });
    socket.on("object_updated", (object) => {
      this.objectList[object.id].x = object.x;
      this.objectList[object.id].y = object.y;
      this.objectList[object.id].isHeld = object.isHeld;
      this.objects.refresh();
    });

    socket.on("object_removed", (objectId) => {
      console.log(objectId);
      this.objectList[objectId].destroy();
      delete this.objectList[objectId];
    });
    socket.on("object_added", (obj) => {
      this.objectList[obj.id] = this.objects.create(obj.x, obj.y, obj.key);
      this.objectList[obj.id].id = obj.id;
      this.objectList[obj.id].isHeld = false;
      this.objects.setDepth(1);
    });
    /* Received new room */
    socket.on("room_changed", () => {
      console.log("room_changed");
      this.scene.start("MainScene");
    });
  }

  preload() {
    this.load.image("player", "assets/red_square.png");
    this.load.image("bush", "assets/bush.png");

    //flag to interrupt update loop
    this.sceneStopped = false;
  }

  create() {
    /* Initialize Background */
    this.bg = this.add.grid(0, 0, 1024, 1024, 32, 32);

    this.objects = this.physics.add.staticGroup();
    //this.objects.create(100, 100, "bush");
    this.objects.setDepth(1);

    /* Initialize Player */
    this.player = new Player(this, "player");
    this.player.entity.setVisible(false);
    this.controls = createControl(this, this.player);

    /* get current gamestate */
    socket.emit("request_game_state");

    /* change rooms upon worldbound collisions */
    this.player.entity.body.setCollideWorldBounds(true);
    this.player.entity.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      let dirs = { up, down, left, right };
      let moveTo;
      for (let dir in dirs) {
        if (dirs[dir]) moveTo = dir;
      }

      this.scene.stop();
      this.controls;
      this.sceneStopped = true; //flag to interrupt update loop
      socket.emit("change_room", moveTo);
    });

    //
    this.physics.add.overlap(
      this.objects,
      this.player.entity,
      (player, object) => {
        if (!object.isHeld) {
          this.player.selected = object;
        }
      }
    );
  }

  update() {
    if (this.sceneStopped) return; //flag to interrupt update loop
    this.controls();
  }
}
