import Timer from '../layer1/Timer.js';

/**
 * Manage IA
 * @class Ia
 */
export default class Ia {
  /**
   * Constructor
   * @method constructor
   * @param {string} id - Reference of the physic interface
   * @param {properties} properties - properties
   */
  constructor(id, properties) {
    this.id = id;
    this.timer = new Timer(3000);
    this.name = properties.name;
    this.perimeter = properties.perimeter !== undefined ? properties.perimeter : {x:0,y:0,dx:0,dy:0};
    this.physicInterface = null;
    this.omniscient = properties.omniscient !== undefined ? properties.omniscient : true;
    this.knownHitboxes = [];
    this.step = 0;

    this.physicEntity = null;
    this.speedReflection = properties.speedReflection !== undefined ? properties.speedReflection : 20;
  }
  /**
   * Set physic interface reference
   * @method setPhysicInterface
   * @param {physicInterface} physicInterface - Reference of the physic interface
   * @return {void}
   */
  setPhysicInterface(physicInterface) {
    this.physicInterface = physicInterface;
  }
  /**
   * Set physic entity reference
   * @method setPhysicEntity
   * @param {physicEntity} physicEntity - Reference of the physic entity
   * @return {void}
   */
  setPhysicEntity(physicEntity) {
    this.physicEntity = physicEntity;
  }
  /**
   * Update Known Hitboxes
   * @method updateKnownHitboxes
   * @return {void}
   */
  updateKnownHitboxes() {
    if (this.omniscient) {
      this.knownHitboxes = this.getHitboxByPerimeter();
    } else {
      this.knownHitboxes = this.getHitboxByView();
    }
  }
  /**
   * Get Hitbox By Perimeter
   * @method getHitboxByPerimeter
   * @return {void}
   */
  getHitboxByPerimeter() {
    //this.physicInterface
  }
  /**
   * Get Hitbox By View
   * @method getHitboxByView
   * @return {void}
   */
  getHitboxByView() {
    return this.perimeter;
  }
  /**
   * Update the IA state
   * @method updateStatus
   * @return {void}
   */
  updateStatus() {
    if (this.physicEntity) {
      if (this.timer.whatTimeIsIt()) {
        if (this.step === 0) {
          this.physicEntity.setWalk({
            direction: 'right',
            acc: 500,
            speed: 500
          });
          this.timer.setDelta(3000);
          this.step = 1;
        } else if (this.step === 1) {
          this.physicEntity.unsetWalk('right');
          this.timer.setDelta(1000);
          this.step = 2;
        } else if (this.step === 2) {
          this.physicEntity.setWalk({
            direction: 'left',
            acc: 500,
            speed: 500
          });
          this.timer.setDelta(2000);
          this.step = 3;
        } else if (this.step === 3) {
          this.physicEntity.spring({
            x: 0,
            y: -500
          });
          this.timer.setDelta(1000);
          this.step = 4;
        } else if (this.step === 4) {
          this.physicEntity.unsetWalk('left');
          this.timer.setDelta(1000);
          this.step = 0;
        }
      }
    }
  }
}
