import GeometricMath from '../layer1/GeometricMath.js';

/**
 * Physic Entity
 * @class PhysicEntity
 */
export default class PhysicEntity {
  /**
   * Physic Entity
   * @method constructor
   * @param {physicEntity} properties - Object properties
   * @param {string} id - Object id
   */
  constructor(properties, id) {
    /* Identity */
    this.id = id;
    this.name = properties.name;

    /* Gravity point */
    this.position = {
      x: 0,
      y: 0
    };

    /* Calculated Size */
    this.originalSize = {
      dx: 0,
      dy: 0
    };
    /* Calculated Size with angle */
    this.size = {
      dx: 1,
      dy: 1
    };
    this.delta = {
      x: 0,
      y: 0,
      angle: 0
    };

    this.angle = 0;
    this.perimeter = [];

    /* Mouvement properties */
    this.velocity = {
      x: 0,
      y: 0
    };
    this.angleConstraint = properties.angleConstraint !== undefined ? properties.angleConstraint : false;
    this.angularInertia = properties.rotateInertia !== undefined ? properties.rotateInertia : 1;
    this.mass = properties.mass !== undefined ? properties.mass : 1;
    this.dynamic = properties.dynamic !== undefined ? properties.dynamic : false;

    /* Physic ressource */
    this.physicBody = null;
    this.physicInterface = null;

    /* Physic fixture */
    this.hitboxes = [];

    /* Scene Entity reference */
    this.graphicEntity = null;
    this.scene = null;
  }
  /**
   * Set graphic entity reference
   * @method setGraphicEntity
   * @param {graphicEntity} graphicEntity - Graphic entity to reference
   * @return {void}
   */
  setGraphicEntity(graphicEntity) {
    this.graphicEntity = graphicEntity;
  }
  /**
   * Set physic interface reference @Refactor
   * @method setPhysicInterface
   * @param {physicInterface} physicInterface - Reference of the physic interface
   * @return {void}
   */
  setPhysicInterface(physicInterface) {
    this.physicInterface = physicInterface;
  }
  /**
   * Set original size
   * @method setOriginalSize
   * @private
   * @param {size} originalSize - Original size
   * @return {void}
   */
  setOriginalSize(originalSize) {
    this.originalSize = originalSize;
    this.updateSize();
  }
  /**
   * Get original size
   * @method getOriginalSize
   * @return {size} - Original size
   */
  getOriginalSize() {
    return this.originalSize;
  }
  /**
   * Set size
   * @method setSize
   * @private
   * @param {size} size - The new size
   * @return {void}
   */
  setSize(size) {
    /* Map update */
    if (this.scene != null) {
      this.scene.update(
        {
          position: this.physicPosition,
          size: this.size
        },
        {
          position: this.physicPosition,
          size: size
        },
        this.id
      );
    }

    this.size = size;
  }
  /**
   * Get size with angle
   * @method getSize
   * @return {size} - the last size of physic entity
   */
  getSize() {
    return this.size;
  }
  /**
   * Set the position of the physic entity
   * @method setPosition
   * @param {position} position - New absolute position
   * @return {void}
   */
  setPosition(position) {
    this.position = position;
    this.updateGraphicEntityPosition();

    this.updateHitboxesPosition();
  }
  /**
   * Update graphic entity position of the hitboxes with last physic entity position
   * @method updateHitboxesPosition
   * @return {void}
   */
  updateHitboxesPosition() {
    const hitboxesLength = this.hitboxes.length;
    const graphicEntityPosition = {
      x: 0,
      y: 0,
      z: 9999999
    };

    for (let x = 0; x < hitboxesLength; x++) {
      this.hitboxes[x].graphicEntity.setPosition({
        x: this.position.x + this.hitboxes[x].fixture.x,
        y: this.position.y + this.hitboxes[x].fixture.y
      });
      this.hitboxes[x].graphicEntity.setZ(graphicEntityPosition.z + 1);
    }
  }
  /**
   * Update graphic entity position of the hitboxes with last physic entity position
   * @method updateHitboxesAngle
   * @return {void}
   */
  updateHitboxesAngle() {
    const hitboxesLength = this.hitboxes.length;

    for (let x = 0; x < hitboxesLength; x++) {
      this.hitboxes[x].graphicEntity.setAngle(this.angle + this.hitboxes[x].fixture.angle);
    }
  }
  /**
   * Get the position of the physic entity
   * @method getPosition
   * @return {position} - Last position of the physic entity
   */
  getPosition() {
    return this.position;
  }
  /**
   * Set the delta position and Angle between physic entity and graphic Entity
   * @method setDelta
   * @param {delta} delta - Delta position and Angle between physic entity and graphic Entity
   * @return {void}
   */
  setDelta(delta) {
    this.delta = delta;
    this.updateGraphicEntityPosition();
    this.updateGraphicEntityAngle();
  }
  /**
   * Update graphic position with last physic entity position and delta
   * @method updateGraphicEntityPosition
   * @return {void}
   */
  updateGraphicEntityPosition() {
    if (this.graphicEntity != null) {
      this.graphicEntity.setPosition({
        x: this.position.x + this.delta.x,
        y: this.position.y + this.delta.y
      });
    }
  }
  /**
   * Update graphic angle with last physic entity angle and delta
   * @method updateGraphicEntityAngle
   * @return {void}
   */
  updateGraphicEntityAngle() {
    if (this.graphicEntity != null) {
      this.graphicEntity.setAngle(this.angle + this.delta.angle);
    }
  }
  /**
   * Get delta position and angle between physic entity and graphic Entity
   * @method getDelta
   * @return {delta} delta
   */
  getDelta() {
    return this.delta;
  }
  /**
   * Add hitbox to the gravity point
   * @method addHitbox
   * @param {hitbox} hitbox - hitboxe
   * @return {void}
   */
  addHitbox(hitbox) {
    if (!this.verifyHitbox(hitbox.hitbox.id)) {
      let size = {
        dx: 0,
        dy: 0
      };

      hitbox.graphicEntity.setGeometry(hitbox.hitbox);

      switch (hitbox.hitbox.type) {
        case 'circle':
          size = GeometricMath.getCircleSize(hitbox.hitbox.radius);
          break;
        case 'box':
          size.dx = hitbox.hitbox.dx;
          size.dy = hitbox.hitbox.dx;
          break;
        case 'polygon':
          size = GeometricMath.getPolygonSize(hitbox.hitbox.vertices);
          break;
        default:
          console.log('Hitbox not defined');
          break;
      }

      const hit = this.hitboxes.push({
        fixture: hitbox.hitbox,
        graphicEntity: hitbox.graphicEntity,
        originalSize: size,
        id: hitbox.hitbox.id
      });

      if (this.physicBody != null) {
        this.addFixtureToBody(hit.fixture);
      }
    }
  }
  /**
   * Verify if hitbox already exist
   * @method verifyHitbox
   * @param {string} id - id entity
   * @return {boolean} - hitbox presence
   */
  verifyHitbox(id) {
    const length = this.hitboxes.length;

    for (let x = 0; x < length; x++) {
      if (this.hitboxes[x].id === id) {
        return true;
      }
    }

    return false;
  }
  /**
   * Delete hitbox to the gravity point
   * @method deleteHitbox
   * @param {string} id - Entity id
   * @return {void}
   */
  deleteHitbox(id) {
    const length = this.hitboxes.length;

    for (let x = 0; x < length; x++) {
      if (this.hitboxes[x].id === id) {
        this.hitboxes.splice(x, 1);
        return;
      }
    }
  }
  /**
   * Update size with angle
   * @method updateSize
   * @return {void}
   */
  updateSize() {
    const length = this.perimeter.length;
    const polygon = [];

    for (let x = 0; x < length; x++) {
      polygon[x] = GeometricMath.getRotatedPoint(
        this.perimeter[x],
        this.angle,
        {
          x: 0,
          y: 0
        }
      );
    }

    this.setSize(GeometricMath.getPolygonSize(polygon));
  }
  /**
   * Update original size
   * @method updateOriginalSize
   * @return {void}
   */
  updateOriginalSize() {
    const length = this.hitboxes.length;
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;

    if (length > 0) {
      switch (this.hitboxes[0].fixture.shape) {
        case 'circle':
          minX = this.hitboxes[0].fixture.x;
          maxX = this.hitboxes[0].fixture.x - this.hitboxes[0].fixture.radius;
          minY = this.hitboxes[0].fixture.y;
          maxY = this.hitboxes[0].fixture.y - this.hitboxes[0].fixture.radius;
          break;
        case 'box':
          minX = this.hitboxes[0].fixture.x;
          maxX = this.hitboxes[0].fixture.x + this.hitboxes[0].fixture.dx;
          minY = this.hitboxes[0].fixture.y;
          maxY = this.hitboxes[0].fixture.y + this.hitboxes[0].fixture.dy;
          break;
        case 'polygon':
          minX = this.hitboxes[0].fixture.x;
          maxX = this.hitboxes[0].fixture.x + this.hitboxes[0].fixture.dx;
          minY = this.hitboxes[0].fixture.y;
          maxY = this.hitboxes[0].fixture.y + this.hitboxes[0].fixture.dy;
          break;
        default:
          console.log('Hitbox not defined');
          break;
      }
    }

    for (let x = 0; x < length; x++) {
      switch (this.hitboxes[x].fixture.shape) {
        case 'circle':
          minX = Math.min(minX, this.hitboxes[x].fixture.x - this.hitboxes[x].fixture.radius);
          maxX = Math.max(maxX, this.hitboxes[x].fixture.x + this.hitboxes[x].fixture.radius);
          minY = Math.min(minY, this.hitboxes[x].fixture.y - this.hitboxes[x].fixture.radius);
          maxY = Math.max(maxY, this.hitboxes[x].fixture.y + this.hitboxes[x].fixture.radius);
          break;
        case 'box':
          minX = Math.min(minX, this.hitboxes[x].fixture.x);
          maxX = Math.max(maxX, this.hitboxes[x].fixture.x + this.hitboxes[x].fixture.dx);
          minY = Math.min(minY, this.hitboxes[x].fixture.y);
          maxY = Math.max(maxY, this.hitboxes[x].fixture.y + this.hitboxes[x].fixture.dy);
          break;
        case 'polygon':
          minX = Math.min(minX, this.hitboxes[x].fixture.x);
          maxX = Math.max(maxX, this.hitboxes[x].fixture.x + this.hitboxes[x].fixture.dx);
          minY = Math.min(minY, this.hitboxes[x].fixture.y);
          maxY = Math.max(maxY, this.hitboxes[x].fixture.y + this.hitboxes[x].fixture.dy);
          break;
        default:
          console.log('Hitbox not defined');
          break;
      }
    }

    this.setSize({
      dx: maxX - minX,
      dy: maxY - minY
    });
  }
  /**
   * Add collision geometry to the gravity point
   * @method addFixtureToBody
   * @param {collisionGeometry} collisionGeometry - Active the hitbox in the physic engine
   * @return {void}
   */
  addFixtureToBody(collisionGeometry) {
    switch (collisionGeometry.fixture.shape) {
      default:
        console.log('Ce type de geometry est inconnu');
        break;
      case 'circle':
        this.physicInterface.getCircle(
          collisionGeometry.fixture.id,
          collisionGeometry.fixture.x,
          collisionGeometry.fixture.y,
          collisionGeometry.fixture.radius,
          collisionGeometry.fixture.angle,
          collisionGeometry.fixture.sensor,
          collisionGeometry.fixture.restitution,
          collisionGeometry.fixture.friction,
          collisionGeometry.fixture.density,
          this.physicBody
        );
        break;
      case 'box':
        this.physicInterface.getBox(
          collisionGeometry.fixture.id,
          collisionGeometry.fixture.x,
          collisionGeometry.fixture.y,
          collisionGeometry.fixture.dx,
          collisionGeometry.fixture.dy,
          collisionGeometry.fixture.angle,
          collisionGeometry.fixture.sensor,
          collisionGeometry.fixture.restitution,
          collisionGeometry.fixture.friction,
          collisionGeometry.fixture.density,
          this.physicBody
        );
        break;
      case 'polygon':
        this.physicInterface.getPolygon(
          collisionGeometry.fixture.id,
          collisionGeometry.fixture.vertices,
          collisionGeometry.fixture.angle,
          collisionGeometry.fixture.sensor,
          collisionGeometry.fixture.restitution,
          collisionGeometry.fixture.friction,
          collisionGeometry.fixture.density,
          this.physicBody
        );
        break;
    }
    this.updateOriginalSize();
  }
  /**
   * Add the physic object to the physic context
   * @method addToPhysicContext
   * @param {scene} scene - The scene where is add Physic Entity
   * @return {void}
   */
  addToPhysicContext(scene) {
    if (this.physicBody == null) {
      this.physicBody = this.physicInterface.getBody(
        this.id,
        this.position.x,
        this.position.y,
        this.angle,
        this.mass,
        this.angularConstraint,
        this.angularInertia,
        this.dynamic
      );

      const hitboxesLength = this.hitboxes.length;

      for (let x = 0; x < hitboxesLength; x++) {
        this.addFixtureToBody(this.hitboxes[x]);
      }

      this.addToScene(scene);
    }
  }
  /**
   * Delete the physic object to the physic context
   * @method deleteToPhysicContext
   * @param {scene} scene - Scene object
   * @return {void}
   */
  deleteToPhysicContext(scene) {
    if (this.physicBody != null) {
      this.deleteToScene(scene);
    }
  }
  /**
   * Add the physic entity to the Scene
   * @method addToScene
   * @private
   * @param {scene} scene - Scene where is add the physic entity
   * @return {void}
   */
  addToScene(scene) {
    if (this.scene == null) {
      const zoneWithAngle = GeometricMath.getZoneWithAngle(
        {
          x: this.position.x,
          y: this.position.y,
          dx: this.size.dx,
          dy: this.size.dy
        },
        this.angle
      );

      this.scene = scene;
      this.scene.add(
        zoneWithAngle,
        this.id,
        'physic'
      );
    }
  }
  /**
   * Delete the physic entity to the Scene
   * @method deleteToScene
   * @private
   * @return {void}
   */
  deleteToScene() {
    if (this.scene != null) {
      const zoneWithAngle = GeometricMath.getZoneWithAngle(
        {
          x: this.position.x,
          y: this.position.y,
          dx: this.size.dx,
          dy: this.size.dy
        },
        this.angle
      );
      this.scene.delete(
        zoneWithAngle,
        this.id
      );
      this.scene = null;
    }
  }
  /**
   * Set angle of the physic position
   * @method setAngle
   * @param {number} angle - The new angle of physic position
   * @return {void}
   */
  setAngle(angle) {
    this.angle = angle;
    this.updateGraphicEntityAngle();
    this.updateHitboxesAngle();
  }
  /**
   * Get angle
   * @method getAngle
   * @return {number} angle
   */
  getAngle() {
    return this.angle;
  }
  /**
   * Set velocity
   * @method setVelocity
   * @param {vector} vector - Force on x and y
   * @return {void}
   */
  setVelocity(vector) {
    this.physicInterface.setVelocity(this.physicBody, {
      x: vector.x,
      y: vector.y
    });
  }
  /**
   * Get velocity
   * @method getVelocity
   * @return {vector} vector
   */
  getVelocity() {
    return this.physicInterface.getVelocity(this.physicBody);
  }
  /**
   * Show collision geometries
   * @method show
   * @param {scene} scene - Scene where to show the hitboxes
   * @return {void}
   */
  show(scene) {
    const hitboxesLength = this.hitboxes.length;

    for (let x = 0; x < hitboxesLength; x++) {
      this.hitboxes[x].graphicEntity.addToScene(scene);
    }
  }
  /**
   * Hide collision geometries
   * @method hide
   * @return {void}
   */
  hide() {
    const hitboxesLength = this.hitboxes.length;

    for (let x = 0; x < hitboxesLength; x++) {
      this.hitboxes[x].graphicEntity.deleteToScene();
    }
  }
  /**
   * Update the physic position
   * @method updatePhysicPosition
   * @return {void}
   */
  updatePhysicPosition() {
    if (this.physicBody != null) {
      this.setPosition(this.physicInterface.getPosition(this.physicBody));
      this.setAngle(this.physicInterface.getAngle(this.physicBody));
    }
  }
}
