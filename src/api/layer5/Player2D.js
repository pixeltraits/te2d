import PhysicEntity from '../layer4/PhysicEntity.js';
import Logger from '../layer1/Logger.js';

/**
 * Player2D manager
 * @class Player2D
 */
export default class Player2D extends PhysicEntity {
  /**
   * Player2D manager
   * @method constructor
   * @param {player2d} properties - Object Properties
   * @param {string} id - Object ID
   * @return {void}
   */
  constructor(properties, id) {
    super(properties, id);

    this.accRight = 0;
    this.accLeft = 0;
    this.maxSpeed = 3;
  }
  /**
   * Make spring to player
   * @method spring
   * @param {vector} vector - Vector force
   * @return {void}
   */
  spring(vector) {
    this.physicInterface.setImpulse(this.physicBody, vector);
  }
  /**
   * Set walk action to player
   * @method setWalk
   * @param {walkObject} walkObject - Walk Object
   * @return {void}
   */
  setWalk(walkObject) {
    switch (walkObject.direction) {
      case 'right':
        this.accRight = walkObject.acc;
        break;
      case 'left':
        this.accLeft = -walkObject.acc;
        break;
      default:
        Logger.log('Action walk not defined');
        break;
    }
    this.maxSpeed = walkObject.speed;
  }
  /**
   * Unset walk action
   * @method unsetWalk
   * @param {string} direction - Direction
   * @return {void}
   */
  unsetWalk(direction) {
    switch (direction) {
      case 'right':
        this.accRight = 0;
        break;
      case 'left':
        this.accLeft = 0;
        break;
      default:
        Logger.log('Action walk not defined');
        break;
    }
  }
  /**
   * Update walk action
   * @method updatePhysicPosition
   * @return {void}
   */
  updatePhysicPosition() {
    super.updatePhysicPosition();

    const velocity = this.getVelocity();
    const force = {
      x: 0,
      y: 0
    };

    if (velocity.x < this.maxSpeed) {
      force.x += this.accRight;
    }
    if (velocity.x > -this.maxSpeed) {
      force.x += this.accLeft;
    }
    if (this.accLeft === 0 && this.accRight === 0) {
      this.physicInterface.stopForces(this.physicBody);
    }

    this.setVelocity(force);
  }
}
