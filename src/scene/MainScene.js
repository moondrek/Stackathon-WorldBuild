import Phaser from "phaser";
import { Player, Character } from "../entity/";
import socket from "../socket";

export default class MainScene extends Phaser.Scene {
  constructor(color1 = 0xffffff) {
    super({ key: "MainScene" });
    this.playerList = {};
    this.color1 = color1;

    socket.on("game_state", (data) => {
      for (let player in data.playerList) {
        console.log(data);
        if (player == data.id) {
          // set my location
          this.player.entity.setVisible(true);
          this.player.entity.setPosition(
            data.playerList[player].location.x,
            data.playerList[player].location.y
          );
        } else if (
          data.playerList[player].room.x === data.room.x &&
          data.playerList[player].room.y === data.room.y
        ) {
          this.playerList[player] = new Character( // render other player
            this,
            "player",
            data.playerList[player].location
          );
        }
      }
    });

    /* Synchronize other player actions */
    socket.on("joined", (data) => {
      this.playerList[data.id] = new Character(this, "player", data.location);
    });
    socket.on("left", (data) => {
      this.playerList[data.id].entity.destroy();
      delete this.playerList[data.id];
    });
    socket.on("someone_moved", (data) => {
      this.playerList[data.id].entity.setPosition(
        data.location.x,
        data.location.y
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
