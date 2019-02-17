/**
 * Interface of physic API
 * @class PhysicInterface
 */
export default class PhysicInterface {
  /**
   * Interface of physic API
   * @method PhysicInterface
   * @param {function} collisionStart - function called when a collision begin
   * @param {function} collisionEnd - function called when a collision ending
   * @param {function} gravity - function called when a collision ending
   * @param {function} pixelFactor - function called when a collision ending
   * @return {void}
   */
  constructor(collisionStart, collisionEnd, gravity, pixelFactor) {
    //throw new Error(`Wrong implementation of => ${this.constructor.name}, constructor()`);
  }
  /**
   * Get a body
   * @method getBody
   * @param {string} id
   * @param {number} x
   * @param {number} y
   * @param {number} angle
   * @param {number} mass
   * @param {boolean} angularConstraint
   * @param {number} angularInertia
   * @param {boolean} dynamic
   * @return {body}
   */
  getBody(id, x, y, angle, mass, angularConstraint, angularInertia, dynamic) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, getBody()`);
  }
  /**
   * Set distance joint between two bodies
   * @method setDistanceJoint
   * @param {bodyRef} bodyA - Body reference
   * @param {bodyRef} bodyB - Body Reference
   * @param {position} anchorAPosition - Anchor position
   * @param {position} anchorBPosition - Anchor position
   * @return {joint} joint
   */
  setDistanceJoint(bodyA, bodyB, anchorAPosition, anchorBPosition) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, setDistanceJoint()`);
  }
  /**
   * Get a box fixture
   * @method getBox
   * @param {string} id
   * @param {number} x
   * @param {number} y
   * @param {number} dx
   * @param {number} dy
   * @param {number} angle
   * @param {boolean} sensor
   * @param {number} restitution
   * @param {number} friction
   * @param {number} density
   * @param {body} bodyRef
   * @return {fixture}
   */
  getBox(bodyId, fixtureId, x, y, dx, dy, angle, sensor, restitution, friction, density, bodyRef) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, getBox()`);
  }
  /**
   * Get an circle fixture
   * @method getCircle
   * @param {string} id
   * @param {string} id
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} angle
   * @param {boolean} sensor
   * @param {number} restitution
   * @param {number} friction
   * @param {number} density
   * @param {body} bodyRef
   * @return {fixture}
   */
  getCircle(bodyId, fixtureId, x, y, radius, angle, sensor, restitution, friction, density, bodyRef) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, getCircle()`);
  }
  /**
   * Get an polygon fixture
   * @method getPolygon
   * @param {string} id
   * @param {number} x
   * @param {number} y
   * @param {position[]} vertices
   * @param {number} angle
   * @param {boolean} sensor
   * @param {number} restitution
   * @param {number} friction
   * @param {number} density
   * @param {body} bodyRef
   * @return {fixture}
   */
  getPolygon(bodyId, fixtureId, x, y, vertices, angle, sensor, restitution, friction, density, bodyRef) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, getPolygon()`);
  }
  /**
   * Add the body to physic context
   * @method addToPhysicContext
   * @param {body} bodyRef
   */
  addToPhysicContext(bodyRef) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, addToPhysicContext()`);
  }
  /**
   * Remove the body to physic context
   * @method removeToPhysicContext
   * @param {body} bodyRef
   */
  removeToPhysicContext(bodyRef) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, removeToPhysicContext()`);
  }
  /**
   * Set position of a body, teleportation
   * @method setPosition
   * @param {body} bodyRef
   * @param {number} x
   * @param {number} y
   */
  setPosition(bodyRef, x, y) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, setPosition()`);
  }
  /**
   * Get position of a body
   * @method getPosition
   * @param {body} bodyRef
   * @return {position}
   */
  getPosition(bodyRef) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, getPosition()`);
  }
  /**
   * Set angle of a body, teleportation
   * @method setAngle
   * @param {body} bodyRef
   * @param {number} angle
   */
  setAngle(bodyRef, angle) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, setAngle()`);
  }
  /**
   * Get angle of a body
   * @method getAngle
   * @param {body} bodyRef
   * @return {number}
   */
  getAngle(bodyRef) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, getAngle()`);
  }
  /**
   * Recalculate of the physic context
   * @method updateEngine
   * @param {number} framerate - Time past since the last update
   * @param {number} velocityPrecision - velocity iterations
   * @param {number} positionPrecision - position iterations
   */
  updateEngine(framerate, velocityPrecision, positionPrecision) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, updateEngine()`);
  }
  /**
   * Set velocity of an physic object
   * @method setImpulse
   * @param physicObject
   * @param vector
   */
  setImpulse(physicObject, vector) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, setImpulse()`);
  }
  /**
   * Set velocity of an physic object
   * @method setVelocity
   * @param physicObject
   * @param vector
   */
  setVelocity(physicObject, vector) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, setVelocity()`);
  }
  /**
   * Get velocity of an physic object
   * @method getVelocity
   * @param physicObject
   * @return vector
   */
  getVelocity(physicObject) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, getVelocity()`);
  }
  /**
   * Get speed of an physic object
   * @method getSpeed
   * @param physicObject
   * @return speed
   */
  getSpeed(physicObject) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, getSpeed()`);
  }
  /**
   * Get speed of an physic object
   * @method getSpeed
   * @param physicObject
   * @return speed
   */
  stopForces(physicObject) {
    throw new Error(`Wrong implementation of => ${this.constructor.name}, stopForces()`);
  }
}
