import Phaser from "phaser";
import { CreatePlayer } from "../entity/";
import socket from "../socket";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("bg", "assets/checkerboard.png");
    this.load.image("player", "assets/red_square.png");
    this.physics.world.gravity.y = 0;
  }

  create() {
    this.add.image(0, 0, "bg");
    this.player = new CreatePlayer(this, "player");
    socket.on("joined", (data) => {
      console.log(data);
    });
    socket.on("someone_moved", (data) => {
      this.player.entity.setPosition(data.location.x, data.location.y);
    });
  }

  update() {
    this.physics.world.wrap(this.player.entity);
    this.player.controlListener();
  }
}
