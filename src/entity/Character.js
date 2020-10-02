export default class Character {
  constructor(scene, key, position = { x: 256, y: 256 }) {
    console.log(position);
    this.entity = scene.add.image(position.x, position.y, key);
    this.entity.setOrigin(0, 0);
    scene.physics.add.existing(this.entity);
    scene.physics.world.wrap(this.entity);
  }
}
