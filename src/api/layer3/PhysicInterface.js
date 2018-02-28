import PhysicBox2D from './PhysicBox2D.js';

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
   * @return {void}
   */
  constructor(collisionStart, collisionEnd) {
    this.physic = new PhysicBox2D(collisionStart, collisionEnd);
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
    return this.physic.getBody(
      id,
      x,
      y,
      angle,
      mass,
      angularConstraint,
      angularInertia,
      dynamic
    );
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
  getBox(id, x, y, dx, dy, angle, sensor, restitution, friction, density, bodyRef) {
    return this.physic.getBox(
      id,
      x,
      y,
      dx,
      dy,
      angle,
      sensor,
      restitution,
      friction,
      density,
      bodyRef
    );
  }
  /**
   * Get an circle fixture
   * @method getCircle
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
  getCircle(id, x, y, radius, angle, sensor, restitution, friction, density, bodyRef) {
    return this.physic.getCircle(
      id,
      x,
      y,
      radius,
      angle,
      sensor,
      restitution,
      friction,
      density,
      bodyRef
    );
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
  getPolygon(id, x, y, vertices, angle, sensor, restitution, friction, density, bodyRef) {
    return this.physic.getPolygon(
      id,
      x,
      y,
      vertices,
      angle,
      sensor,
      restitution,
      friction,
      density,
      bodyRef
    );
  }
  /**
   * Add the body to physic context
   * @method addToPhysicContext
   * @param {body} bodyRef
   */
  addToPhysicContext(bodyRef) {
    this.physic.addToPhysicContext(bodyRef);
  }
  /**
   * Remove the body to physic context
   * @method removeToPhysicContext
   * @param {body} bodyRef
   */
  removeToPhysicContext(bodyRef) {
    this.physic.removeToPhysicContext(bodyRef);
  }
  /**
   * Set position of a body, teleportation
   * @method setPosition
   * @param {body} bodyRef
   * @param {number} x
   * @param {number} y
   */
  setPosition(bodyRef, x, y) {
    this.physic.setPosition(bodyRef, x, y);
  }
  /**
   * Get position of a body
   * @method getPosition
   * @param {body} bodyRef
   * @return {position}
   */
  getPosition(bodyRef) {
    return this.physic.getPosition(bodyRef);
  }
  /**
   * Set angle of a body, teleportation
   * @method setAngle
   * @param {body} bodyRef
   * @param {number} angle
   */
  setAngle(bodyRef, angle) {
    this.physic.setAngle(bodyRef, angle);
  }
  /**
   * Get angle of a body
   * @method getAngle
   * @param {body} bodyRef
   * @return {number}
   */
  getAngle(bodyRef) {
    return this.physic.getAngle(bodyRef);
  }
  /**
   * Recalculate of the physic context
   * @method updateEngine
   * @param {number} framerate - Time past since the last update
   * @param {number} velocityPrecision - velocity iterations
   * @param {number} positionPrecision - position iterations
   */
  updateEngine(framerate, velocityPrecision, positionPrecision) {
    this.physic.updateEngine(framerate, velocityPrecision, positionPrecision);
  }
  /**
   * Set velocity of an physic object ------------------------Revision 0.8 final
   * @method setImpulse
   * @param physicObject
   * @param vector
   */
  setImpulse(physicObject, vector) {
    this.physic.setImpulse(physicObject, vector);
  }
  /**
   * Set velocity of an physic object
   * @method setVelocity
   * @param physicObject
   * @param vector
   */
  setVelocity(physicObject, vector) {
    this.physic.setVelocity(physicObject, vector);
  }
  /**
   * Get velocity of an physic object
   * @method getVelocity
   * @param physicObject
   * @return vector
   */
  getVelocity(physicObject) {
    return this.physic.getVelocity(physicObject);
  }
  /**
   * Get speed of an physic object
   * @method getSpeed
   * @param physicObject
   * @return speed
   */
  getSpeed(physicObject) {
    return this.physic.getSpeed(physicObject);
  }
  /**
   * Get speed of an physic object
   * @method getSpeed
   * @param physicObject
   * @return speed
   */
  stopForces(physicObject) {
    return this.physic.stopForces(physicObject);
  }
}
