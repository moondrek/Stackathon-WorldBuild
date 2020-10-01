import Phaser from "phaser";
import { MainScene } from "./scene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [MainScene],
};

new Phaser.Game(config);

//SOCKET

/*
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      socket.emit("move", { dir: "y", delta: 1 });
      console.log("up");
      break;
    case "ArrowDown":
      socket.emit("move", { dir: "y", delta: -1 });
      console.log("down");
      break;
    case "ArrowLeft":
      socket.emit("move", { dir: "x", delta: -1 });
      console.log("left");
      break;
    case "ArrowRight":
      socket.emit("move", { dir: "x", delta: 1 });
      console.log("right");
      break;
    default:
      break;
  }
});
 */
