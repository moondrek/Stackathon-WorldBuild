import Phaser from "phaser";
import { Player, Character } from "../entity/";
import socket from "../socket";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.playerList = {};
  }

  preload() {
    this.load.image("bg", "assets/checkerboard.png");
    this.load.image("player", "assets/red_square.png");
    this.physics.world.gravity.y = 0;

    //add existing players
    socket.on("game_state", (data) => {
      for (let player in data.playerList) {
        if (player !== data.id) {
          this.playerList[player] = new Player(this, "player");
        }
      }
    });
  }

  create() {
    this.add.image(512, 512, "bg");
    this.player = new Player(this, "player");

    socket.on("joined", (data) => {
      this.playerList[data.id] = new Character(this, "player");
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

    socket.emit("request_game_state");
  }

  update() {
    this.physics.world.wrap(this.player.entity);
    this.player.controlListener();
  }
}
