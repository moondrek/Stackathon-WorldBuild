import socket from "../socket";
import Character from "./Character";

export default class Player extends Character {
  constructor(scene, key) {
    super(scene, key);
    this.controls = scene.input.keyboard.createCursorKeys();
    this.controlListener = this.controlListener.bind(this);
    this.moving;
  }

  controlListener() {
    if (this.moving) {
      socket.emit("i_move", this.entity.body.position);
    }
    this.moving = false;
    if (this.controls.up.isDown) {
      this.entity.body.setVelocityY(-300);
      this.moving = true;
    } else if (this.controls.down.isDown) {
      this.entity.body.setVelocityY(300);
      this.moving = true;
    } else this.entity.body.setVelocityY(0);
    if (this.controls.left.isDown) {
      this.entity.body.setVelocityX(-300);
      this.moving = true;
    } else if (this.controls.right.isDown) {
      this.entity.body.setVelocityX(300);
      this.moving = true;
    } else this.entity.body.setVelocityX(0);
    if (!this.moving) {
      this.entity.body.setVelocity(0, 0);
    }
    if (this.controls.space.isDown) {
      console.log(this.entity.body.position);
    }
  }
}
