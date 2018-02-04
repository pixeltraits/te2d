/**
 * Physique engine implementation for Box2D
 * @class PhysicBox2D
 * @param {function} collisionStart
 * @param {function} collisionEnd
 */
class PhysicBox2D {
  constructor(collisionStart, collisionEnd) {
    //Box2D implementation
    this.b2Vec2 = Box2D.Common.Math.b2Vec2;
    this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
    this.b2Body = Box2D.Dynamics.b2Body;
    this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    this.b2Fixture = Box2D.Dynamics.b2Fixture;
    this.b2World = Box2D.Dynamics.b2World;
    this.b2MassData = Box2D.Collision.Shapes.b2MassData;
    this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    this.b2Body.prototype.SetTransform = function (xf, angle) {//Correctif
       this.SetPositionAndAngle({x:xf.x, y:xf.y}, angle);
    };


    //Physic context configuration
    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.BeginContact = collisionStart;
    this.pixelMetterFactor = 1;

    this.physicContext = new this.b2World(
       new this.b2Vec2(0, 70),
       true
    );
    this.physicContext.SetContactListener(listener);
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
   * @return body object
   */
  getBody(id, x, y, angle, mass, angularConstraint, angularInertia, dynamic) {
    var bodyDef = new this.b2BodyDef;

    if(!dynamic) {
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
    //Create box with polygon methode
    let leftTopPoint = {
      x : x,
      y : y
    };
    let rightTopPoint = {
      x : x + dx,
      y : y
    };
    let leftBottomPoint = {
      x : x,
      y : y + dy
    };
    let rightBottomPoint = {
      x : x + dx,
      y : y + dy
    };
    let vertices = [leftTopPoint, rightTopPoint, rightBottomPoint, leftBottomPoint];

    return this.getPolygon(
      id,
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
   * Get a circle fixture
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
    var fixDef = new this.b2FixtureDef;

    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.isSensor = sensor;
    fixDef.userData = id;

    fixDef.shape = new this.b2CircleShape;
    fixDef.shape.m_p.Set(this.pixelToMetter(x), this.pixelToMetter(y));
    fixDef.shape.m_radius(radius);

    return bodyRef.CreateFixture(fixDef);
  }
  /**
   * Get a polygon fixture
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
  getPolygon(id, vertices, angle, sensor, restitution, friction, density, bodyRef) {
    let fixDef = new this.b2FixtureDef;
    let polygonPoints = [];
    const verticesLength = vertices.length;

    for(let x = 0; x < verticesLength; x++) {
      polygonPoints[x] = new this.b2Vec2;
      polygonPoints[x].Set(vertices[x].x, vertices[x].y);
    }

    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.isSensor = sensor;
    fixDef.userData = id;

    fixDef.shape = new this.b2PolygonShape;
    fixDef.shape.SetAsArray(polygonPoints, verticesLength);

    return bodyRef.CreateFixture(fixDef);
  }
  /**
   * Translate pixel to metter
   * @method pixelToMetter
   * @param {number} x
   * @return {number}
   */
  pixelToMetter(x) {
    return x * this.pixelMetterFactor;
  }
  /**
   * Translate metter to pixel
   * @method metterToPixel
   * @param {number} x
   * @return {number}
   */
  metterToPixel(x) {
    return x / this.pixelMetterFactor;
  }
  /**
   * Add the body to physic context
   * @method addToPhysicContext
   * @param {body} bodyRef
   */
  addToPhysicContext(bodyRef) {
    return this.physicContext.CreateBody(bodyRef);
  }
  /**
   * Delete the body to physic context
   * @method deleteToPhysicContext
   * @param {body} bodyRef
   */
  deleteToPhysicContext(bodyRef) {
    this.physicContext.DestroyBody(bodyRef);
  }
  /**
   * Set position of a body, teleportation ------ A revoir
   * @method setPosition
   * @param {body} bodyRef
   * @param {number} x
   * @param {number} y
   */
  setPosition(bodyRef, x, y) {
    //var position = new this.b2Vec2(0.02 * x, 0.02 * y);
    //this.removeToPhysicContext(physicObject.reference);

    //this.getRectangle(physicObject.reference);
    //physicObject.reference.SetTransform(position, 1);
  }
  /**
   * Get position of an physic object
   * @method getPosition
   * @param {body} bodyRef
   * @return {position} position
   */
  getPosition(bodyRef) {
    var position = bodyRef.GetPosition();

    return {
      x : this.metterToPixel(position.x),
      y : this.metterToPixel(position.y)
    };
  }
  /**
   * Set angle of a body, teleportation -------------- A revoir
   * @method setAngle
   * @param {body} bodyRef
   * @param {number} angle
   */
  setAngle(bodyRef, angle) {
    //physicObject.state.angular.pos.set(angle);
  }
  /**
     * Get angle of a body
     * @method getAngle
     * @param {body} bodyRef
     * @return {number}
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
   */
  updateEngine(framerate, velocityPrecision, positionPrecision) {
    //console.log(framerate)
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
   * @param {body} bodyRef
   */
  stopForces(bodyRef) {
    var velocity = bodyRef.GetLinearVelocity(),
        force = {
          x : -(bodyRef.GetMass() * velocity.x) * 4,
          y : 0
        };

    //if(Math.abs(velocity.x) > 0.2) {
      bodyRef.ApplyForce(new this.b2Vec2(force.x, force.y), bodyRef.GetWorldCenter());
    //} else {
    //  velocity.x = 0;
    //  physicObject.SetLinearVelocity(velocity);
    //}
  }
  /**
   * Set velocity of a body
   * @method setVelocity
   * @param {body} bodyRef
   * @param vector
   */
  setImpulse(bodyRef, vector) {
    var velocity = bodyRef.GetLinearVelocity();
    velocity.y = vector.y;
    bodyRef.SetLinearVelocity(velocity);
  }
  /**
   * Set velocity of a body
   * @method setVelocity
   * @param {body} bodyRef
   * @param {vector} vector
   */
  setVelocity(bodyRef, vector) {
    var velocity = bodyRef.GetLinearVelocity(),
        force = {
          x : vector.x,
          y : vector.y
        };

    bodyRef.ApplyForce(new this.b2Vec2(force.x, force.y), bodyRef.GetWorldCenter());
  }
  /**
   * Get velocity of a body
   * @method getVelocity
   * @param {body} bodyRef
   * @return vector
   */
  getVelocity(bodyRef) {
    return bodyRef.GetLinearVelocity();
  }
  /**
   * Get speed of an physic object ------------- A revoir
   * @method getSpeed
   * @param physicObject
   * @return speed
   */
  getSpeed(physicObject) {
    return 0;
  }
}
