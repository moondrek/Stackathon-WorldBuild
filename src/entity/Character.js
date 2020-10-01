export default class Character {
  constructor(scene, key) {
    this.entity = scene.add.image(512, 512, key);
    this.entity.setOrigin(0, 0);
    scene.physics.add.existing(this.entity);
    scene.physics.world.wrap(this.entity);
  }
}
