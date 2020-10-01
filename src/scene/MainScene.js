import Phaser from "phaser";
import { CreatePlayer } from "../entity/";

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
  }

  update() {
    this.physics.world.wrap(this.player.entity);

    this.player.controlListener();
  }
}
