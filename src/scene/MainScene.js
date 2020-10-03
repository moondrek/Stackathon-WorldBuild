import Phaser from "phaser";
import { Player, Character } from "../entity/";
import socket from "../socket";

export default class MainScene extends Phaser.Scene {
  constructor(color1 = 0xffffff) {
    super({ key: "MainScene" });
    this.playerList = {};
    this.color1 = color1;

    socket.on("game_state", (data) => {
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
    this.color2 = Math.floor(Math.random() * 16 ** 6);
    this.load.image("bg", "assets/checkerboard.png");
    this.load.image("player", "assets/red_square.png");
    console.log("preload");
    this.physics.world.gravity.y = 0;
    this.sceneStopped = false;
    //update display to show current gamestate
  }

  create() {
    //this.add.image(512, 512, "bg");
    /* Background */
    const bg = this.add.grid(0, 0, 1024, 1024, 32, 32, this.color1);
    bg.showAltCells = true;
    bg.setAltFillStyle(this.color2);

    this.player = new Player(this, "player");
    this.player.entity.setVisible(false);

    /* get current gamestate */
    socket.emit("request_game_state");

    /* get and dostuff upon worldbound collisions */
    this.player.entity.body.setCollideWorldBounds(true);
    this.player.entity.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      let dirs = { up, down, left, right };
      let moveTo;
      for (let dir in dirs) {
        if (dirs[dir]) moveTo = dir;
      }

      this.scene.stop();
      this.sceneStopped = true;
      socket.emit("change_room", moveTo);
    });
  }

  update() {
    //this.physics.world.wrap(this.player.entity);
    if (this.sceneStopped) return;
    this.player.controlListener();
  }
}
