/*import {
  b2Body,
  b2Vec2,
  b2BodyDef,
  b2FixtureDef,
  b2DistanceJointDef,
  b2World,
  b2PolygonShape,
  b2CircleShape,
  b2ContactListener
} from '../../lib/Box2D.js';*/
import { Box2D } from '../../lib/Box2D.js';

import PhysicInterface from './PhysicInterface.js';

/**
 * Physique engine implementation for Box2D
 * @class PhysicBox2D
 */
export default class PhysicBox2D extends PhysicInterface {
  /**
   * constructor
   * @method constructor
   * @param {function} collisionStart - collisionStart
   * @param {function} collisionEnd - collisionEnd
   * @param {object} gravity - collisionEnd
   * @param {number} pixelFactor - collisionEnd
   * @return {void}
   */
  constructor(collisionStart, collisionEnd, gravity, pixelFactor) {
    super(collisionStart, collisionEnd, gravity, pixelFactor);
    //Box2D implementation
    this.b2Vec2 = Box2D.Common.Math.b2Vec2;
    this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
    this.b2Body = Box2D.Dynamics.b2Body;
    this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    this.b2Fixture = Box2D.Dynamics.b2Fixture;
    this.b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
    this.b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
    this.b2World = Box2D.Dynamics.b2World;
    this.b2MassData = Box2D.Collision.Shapes.b2MassData;
    this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    /*this.b2Body.prototype.SetTransform = function (xf, angle) {//Correctif
      this.SetPositionAndAngle({x:xf.x, y:xf.y}, angle);
    };*/

    // Correctif de box2D
    this.b2Body.prototype.SetTransform = function(xf, angle) {
      this.SetPositionAndAngle(
        {
          x: xf.x,
          y: xf.y
        },
        angle
      );
    };

    // Physic context configuration
    this.pixelMetterFactor = pixelFactor;
    this.collisionCallbacks = [];

    this.physicContext = new this.b2World(
      new this.b2Vec2(gravity.x, gravity.y),
      true
    );

    const listener = new Box2D.Dynamics.b2ContactListener();
    listener.BeginContact = collisionStart;
    listener.EndContact = collisionEnd;
    this.physicContext.SetContactListener(listener);
  }
  /**
   * Add Collision Listener
   * @method addCollisionListener
   * @param {string} id - Entity id
   * @param {function} callback - callback
   * @param {string} type - type
   * @return {void}
   */
  addCollisionListener(id, callback, type) {
    const callbackProperties = {
      id: id,
      callback: callback,
      type: type
    };

    this.collisionCallbacks.push(callbackProperties);

    this.updateCollisionListener();
  }
  /**
   * Update Collision Listener
   * @method updateCollisionListener
   * @return {void}
   */
  updateCollisionListener() {
    let collisionStartListener;
    let collisionEndListener;

    const listener = new this.b2ContactListener();
    listener.BeginContact = (contacts) => {
      this.collisionCallbacks.every((callbackProperties) => {
      });
    };
    listener.EndContact = (contacts) => {
      this.collisionCallbacks.every((callbackProperties) => {
      });
    };

    this.physicContext.SetContactListener(listener);
  }
  /**
   * Get a body
   * @method getBody
   * @param {string} id - Entity id
   * @param {number} x - x
   * @param {number} y - y
   * @param {number} angle - angle
   * @param {number} mass - mass
   * @param {boolean} angularConstraint - angularConstraint
   * @param {number} angularInertia - angularInertia
   * @param {boolean} dynamic - dynamic
   * @return {body} body - body
   */
  getBody(id, x, y, angle, mass, angularConstraint, angularInertia, dynamic) {
    const bodyDef = new this.b2BodyDef();

    if (!dynamic) {
      bodyDef.type = this.b2Body.b2_staticBody;
    } else {
      bodyDef.type = this.b2Body.b2_dynamicBody;
    }

    bodyDef.position.x = this.pixelToMetter(x);
    bodyDef.position.y = this.pixelToMetter(y);
    bodyDef.angle = angle;
    bodyDef.fixedRotation = angularConstraint;
    bodyDef.mass = mass;
    bodyDef.userData = id;
    bodyDef.angularInertia = angularInertia;

    return this.addToPhysicContext(bodyDef);
  }
  /**
   * Get a box fixture
   * @method getBox
   * @param {string} id - id
   * @param {number} x - x
   * @param {number} y - y
   * @param {number} dx - dx
   * @param {number} dy - dy
   * @param {number} angle - angle
   * @param {boolean} sensor - sensor
   * @param {number} restitution - restitution
   * @param {number} friction - friction
   * @param {number} density - density
   * @param {body} bodyRef - bodyRef
   * @return {fixture} fixture - fixture
   */
  getBox(bodyId, fixtureId, x, y, dx, dy, angle, sensor, restitution, friction, density, bodyRef) {
    // Create box with polygon methode
    const leftTopPoint = {
      x: this.pixelToMetter(x),
      y: this.pixelToMetter(y)
    };
    const rightTopPoint = {
      x: this.pixelToMetter(x + dx),
      y: this.pixelToMetter(y)
    };
    const leftBottomPoint = {
      x: this.pixelToMetter(x),
      y: this.pixelToMetter(y + dy)
    };
    const rightBottomPoint = {
      x: this.pixelToMetter(x + dx),
      y: this.pixelToMetter(y + dy)
    };
    const vertices = [leftTopPoint, rightTopPoint, rightBottomPoint, leftBottomPoint];

    return this.getPolygon(
      bodyId,
      fixtureId,
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
   * Set distance joint between two bodies
   * @method setDistanceJoint
   * @param {bodyRef} bodyA - Body reference
   * @param {bodyRef} bodyB - Body Reference
   * @param {position} anchorAPosition - Anchor position
   * @param {position} anchorBPosition - Anchor position
   * @return {joint} joint
   */
  setDistanceJoint(bodyA, bodyB, anchorAPosition, anchorBPosition) {
    const anchorA = new this.b2Vec2(anchorAPosition);
    const anchorB = new this.b2Vec2(anchorBPosition);
    const joint = new this.b2DistanceJointDef();


    joint.bodyA = bodyA;
    joint.bodyB = bodyB;
    joint.localAnchorA = anchorA;
    joint.localAnchorB = anchorB;
    //joint.collideConnected = true;
    //joint.frequencyHz = 4.0;
    //joint.dampingRatio = 0.5;

    //this.physicContext.CreateJoint(joint);

    return joint;
  }
  /**
   * Set weld joint between two bodies
   * @method setWeldJoint
   * @param {bodyRef} bodyA - Body reference
   * @param {bodyRef} bodyB - Body Reference
   * @param {position} anchorAPosition - Anchor position
   * @param {position} anchorBPosition - Anchor position
   * @return {joint} joint
   */
  setWeldJoint(bodyA, bodyB, anchorAPosition, anchorBPosition) {
    const anchorA = new this.b2Vec2(anchorAPosition);
    const anchorB = new this.b2Vec2(anchorBPosition);
    const joint = new this.b2WeldJointDef();


    joint.bodyA = bodyA;
    joint.bodyB = bodyB;
    joint.localAnchorA = anchorA;
    joint.localAnchorB = anchorB;
    joint.referenceAngle = 0 * Math.PI / 3;
    joint.collideConnected = false;
    joint.frequencyHz = 40;
    joint.dampingRatio = 40;

    this.physicContext.CreateJoint(joint);

    return joint;
  }
  /**
   * Get a circle fixture
   * @method getCircle
   * @param {string} id - id
   * @param {number} x - x
   * @param {number} y - y
   * @param {number} radius - radius
   * @param {number} angle - angle
   * @param {boolean} sensor - sensor
   * @param {number} restitution - restitution
   * @param {number} friction - friction
   * @param {number} density - density
   * @param {body} bodyRef - bodyRef
   * @return {fixture} fixture - fixture
   */
  getCircle(bodyId, fixtureId, x, y, radius, angle, sensor, restitution, friction, density, bodyRef) {
    const fixDef = new this.b2FixtureDef();

    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.isSensor = sensor;
    fixDef.userData = {
      bodyId: bodyId,
      fixtureId: fixtureId
    };

    fixDef.shape = new this.b2CircleShape();
    fixDef.shape.m_p.Set(this.pixelToMetter(x), this.pixelToMetter(y));
    fixDef.shape.m_radius(radius);

    return bodyRef.CreateFixture(fixDef);
  }
  /**
   * Get a polygon fixture
   * @method getPolygon
   * @param {string} id - id
   * @param {position[]} vertices - vertices
   * @param {number} angle - angle
   * @param {boolean} sensor - sensor
   * @param {number} restitution - restitution
   * @param {number} friction - friction
   * @param {number} density - density
   * @param {body} bodyRef - bodyRef
   * @return {polygon} polygon - polygon
   */
  getPolygon(bodyId, fixtureId, vertices, angle, sensor, restitution, friction, density, bodyRef) {
    const fixDef = new this.b2FixtureDef();
    const polygonPoints = [];
    const verticesLength = vertices.length;

    for (let x = 0; x < verticesLength; x++) {
      polygonPoints[x] = new this.b2Vec2();
      polygonPoints[x].Set(vertices[x].x, vertices[x].y);
    }

    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.isSensor = sensor;
    fixDef.userData = {
      bodyId: bodyId,
      fixtureId: fixtureId
    };
    fixDef.angle = angle;

    fixDef.shape = new this.b2PolygonShape();
    fixDef.shape.SetAsArray(polygonPoints, verticesLength);

    return bodyRef.CreateFixture(fixDef);
  }
  /**
   * Translate pixel to metter
   * @method pixelToMetter
   * @param {number} x - x
   * @return {number} metter
   */
  pixelToMetter(x) {
    return x * this.pixelMetterFactor;
  }
  /**
   * Translate metter to pixel
   * @method metterToPixel
   * @param {number} x - x
   * @return {number} pixel
   */
  metterToPixel(x) {
    return x / this.pixelMetterFactor;
  }
  /**
   * Add the body to physic context
   * @method addToPhysicContext
   * @param {body} bodyRef - bodyRef
   * @return {body} bodyRef
   */
  addToPhysicContext(bodyRef) {
    return this.physicContext.CreateBody(bodyRef);
  }
  /**
   * Delete the body to physic context
   * @method deleteToPhysicContext
   * @param {body} bodyRef - bodyRef
   * @return {void}
   */
  deleteToPhysicContext(bodyRef) {
    this.physicContext.DestroyBody(bodyRef);
  }
  /**
   * Set position of a body, teleportation - Do nothing
   * @method setPosition
   * @param {body} bodyRef - bodyRef
   * @param {number} x - x
   * @param {number} y - y
   * @return {void}
   */
  setPosition(bodyRef, x, y) {
  }
  /**
   * Get position of an physic object
   * @method getPosition
   * @param {body} bodyRef - bodyRef
   * @return {position} position - position
   */
  getPosition(bodyRef) {
    const position = bodyRef.GetPosition();

    return {
      x: this.metterToPixel(position.x),
      y: this.metterToPixel(position.y)
    };
  }
  /**
   * Set angle of a body, teleportation - Do nothing
   * @method setAngle
   * @param {body} bodyRef - bodyRef
   * @param {number} angle - angle
   * @return {void}
   */
  setAngle(bodyRef, angle) {
  }
  /**
   * Get angle of a body
   * @method getAngle
   * @param {body} bodyRef - bodyRef
   * @return {number} angle - angle
   */
  getAngle(bodyRef) {
    return bodyRef.GetAngle();
  }
  /**
   * Recalculate the physic context
   * @method updateEngine
   * @param {number} framerate - Time past since the last update
   * @param {number} velocityPrecision - velocity iterations
   * @param {number} positionPrecision - position iterations
   * @return {void}
   */
  updateEngine(framerate, velocityPrecision, positionPrecision) {
    this.physicContext.Step(
      framerate,
      velocityPrecision,
      positionPrecision
    );
    this.physicContext.ClearForces();
  }
  /**
   * Set velocity of a body
   * @method stopForces
   * @param {body} bodyRef - bodyRef
   * @return {void}
   */
  stopForces(bodyRef) {
    const velocity = bodyRef.GetLinearVelocity();
    const force = {
      x: -(bodyRef.GetMass() * velocity.x) * 4,
      y: 0
    };

    bodyRef.ApplyForce(new this.b2Vec2(force.x, force.y), bodyRef.GetWorldCenter());
  }
  /**
   * Set velocity of a body
   * @method setVelocity
   * @param {body} bodyRef - bodyRef
   * @param {vector} vector - vector
   * @return {void}
   */
  setImpulse(bodyRef, vector) {
    const velocity = bodyRef.GetLinearVelocity();
    velocity.y = this.pixelToMetter(vector.y);
    bodyRef.SetLinearVelocity(velocity);
  }
  /**
   * Set velocity of a body
   * @method setVelocity
   * @param {body} bodyRef - bodyRef
   * @param {vector} vector - vector
   * @return {void}
   */
  setVelocity(bodyRef, vector) {
    const force = {
      x: this.pixelToMetter(vector.x),
      y: this.pixelToMetter(vector.y)
    };

    bodyRef.ApplyForce(new this.b2Vec2(force.x, force.y), bodyRef.GetWorldCenter());
  }
  /**
   * Get velocity of a body
   * @method getVelocity
   * @param {body} bodyRef - bodyRef
   * @return {vector} vector
   */
  getVelocity(bodyRef) {
    return bodyRef.GetLinearVelocity();
  }
}
