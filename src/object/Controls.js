import socket from "../socket";
import Phaser from "phaser";

export default function createControls(scene, player) {
  const controls = scene.input.keyboard.createCursorKeys();

  //declare update loop controls here
  return function controlCheck() {
    if (player.moving) {
      socket.emit("i_move", player.entity.body.position);
    }
    player.moving = false;
    if (controls.up.isDown) {
      player.entity.body.setVelocityY(-300);
      player.moving = true;
    } else if (controls.down.isDown) {
      player.entity.body.setVelocityY(300);
      player.moving = true;
    } else player.entity.body.setVelocityY(0);
    if (controls.left.isDown) {
      player.entity.body.setVelocityX(-300);
      player.moving = true;
    } else if (controls.right.isDown) {
      player.entity.body.setVelocityX(300);
      player.moving = true;
    } else player.entity.body.setVelocityX(0);
    if (!player.moving) {
      player.entity.body.setVelocity(0, 0);
    }

    if (Phaser.Input.Keyboard.JustDown(controls.space)) {
      if (player.heldObject) {
        socket.emit("i_dropped_object");
        player.heldObject.isHeld = false;
        player.heldObject = null;
        player.holding = false;
      } else if (player.selected && !player.selected.isHeld) {
        socket.emit("i_grabbed_object", player.selected.id);
        player.holding = true;
        player.heldObject = player.selected;
        player.heldObject.isHeld = true;
      }
    }

    if (player.heldObject) {
      const before = { x: player.heldObject.x, y: player.heldObject.y };

      player.heldObject.setPosition(player.entity.x + 16, player.entity.y + 16);
      player.heldObject.refreshBody();

      const after = { x: player.heldObject.x, y: player.heldObject.y };

      if (before.x !== after.x || before.y !== after.y) {
        socket.emit("i_moved_object", after);
      }
    }

    player.selected = null;
  };
}
