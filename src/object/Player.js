import Character from "./Character";

export default class Player extends Character {
  constructor(scene, key) {
    super(scene, key);
    this.moving;
    this.holding = false;
    this.heldObject = null;
    this.selected;
  }
}
