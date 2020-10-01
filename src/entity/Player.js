import socket from "../socket";

export default class CreatePlayer {
  constructor(scene, key) {
    this.entity = scene.add.image(0, 0, key);
    scene.physics.add.existing(this.entity);
    scene.physics.world.wrap(this.entity);
    this.controls = scene.input.keyboard.createCursorKeys();

    this.controlListener = this.controlListener.bind(this);
  }

  controlListener() {
    let moving = false;
    if (this.controls.up.isDown) {
      this.entity.body.setVelocityY(-300);
      moving = true;
    }
    if (this.controls.down.isDown) {
      this.entity.body.setVelocityY(300);
      moving = true;
    }
    if (this.controls.left.isDown) {
      this.entity.body.setVelocityX(-300);
      moving = true;
    }
    if (this.controls.right.isDown) {
      this.entity.body.setVelocityX(300);
      moving = true;
    }
    if (moving) {
      socket.emit("i_move", this.entity.body.position);
    }
    if (!moving) {
      this.entity.body.setVelocity(0, 0);
    }
    if (this.controls.space.isDown) {
      this.entity.body.position.x = 0;
      this.entity.body.position.y = 0;
    }
  }
}
