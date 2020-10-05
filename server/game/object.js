let id = 0;

module.exports = class Object {
  constructor(key, x, y) {
    this.id = id++;
    this.key = key;
    this.x = x;
    this.y = y;
    this.isHeld = false;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /* utility function -- shouldn't be called directly */
  grabbed() {
    this.isHeld = true;
  }

  /* utility function -- shouldn't be called directly */
  dropped() {
    this.isHeld = false;
  }
};
