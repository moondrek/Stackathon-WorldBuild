import Phaser from "phaser";
import { Player, Character } from "../entity/";
import socket from "../socket";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.playerList = {};

    //load all socket.ons in the constructor
    //otherwise they get declared every room change
    socket.on("game_state", (data) => {
      this.bg.setFillStyle(data.room.color1);
      this.bg.setAltFillStyle(data.room.color2);

      for (let id in data.playerList) {
        console.log(data.playerList[id]);
        if (id == data.id) {
          // set my location
          this.player.entity.setVisible(true);
          this.player.entity.setPosition(
            data.playerList[id].position.x,
            data.playerList[id].position.y
          );
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

    /* Received new room */
    socket.on("room_changed", () => {
      console.log("room_changed");
      this.scene.start("MainScene");
    });
  }

  preload() {
    this.load.image("player", "assets/red_square.png");

    //flag to interrupt update loop
    this.sceneStopped = false;
  }

  create() {
    /* Initialize Background */
    this.bg = this.add.grid(0, 0, 1024, 1024, 32, 32);

    this.player = new Player(this, "player");
    this.player.entity.setVisible(false);

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
      this.sceneStopped = true; //flag to interrupt update loop
      socket.emit("change_room", moveTo);
    });
  }

  update() {
    if (this.sceneStopped) return; //flag to interrupt update loop
    this.player.controlListener();
  }
}
