/**
 * Physic Entity
 * @class PhysicEntity
 * @param {physicEntity} properties
 * @param {string} id
 */
class PhysicEntity {
  constructor(properties, id) {
    /* Identity */
    this.id = id;
    this.name = properties.name;

    /* Gravity point */
    this.physicPosition = {
      x : 0,
      y : 0
    };
    /* Graphic position(top, left) */
    this.graphicPosition = {
      x : 0,
      y : 0
    };

    /* Calculated Size */
    this.originalSize = {
      dx : 0,
      dy : 0
    };
    /* Calculated Size with angle */
    this.size = {
      dx : 0,
      dy : 0
    };

    this.angle = 0;
    this.perimeter = [];

    /* Mouvement properties */
    this.velocity = {
      x : 0,
      y : 0
    };
    this.angleConstraint = properties.angleConstraint != undefined ? properties.angleConstraint : true;
    this.angularInertia = properties.rotateInertia != undefined ? properties.rotateInertia : 1;
    this.mass = properties.mass != undefined ? properties.mass : 1;
    this.dynamic = properties.dynamic != undefined ? properties.dynamic : false;

    /* Physic ressource */
    this.physicBody = null;
    this.physicInterface;
    this.geometricMath = new GeometricMath();

    /* Physic fixture */
    this.hitboxes = [];

    /* Scene Entity reference */
    this.graphicEntity = null;
    this.scene = null;
  }
  /**
   * Set scene entity reference
   * @method setGraphicEntity
   * @param {graphicEntity} graphicEntity
   */
  setGraphicEntity(graphicEntity) {
    this.graphicEntity = graphicEntity;
  }
  /**
   * Set physic ressource and context
   * @method setPhysicInterface
   * @param {physicInterface} physicInterface
   */
  setPhysicInterface(physicInterface) {
    this.physicInterface = physicInterface;
  }
  /**
   * Set original size
   * @method setOriginalSize
   * @private
   * @param {size} originalSize
   */
  setOriginalSize(originalSize) {
    this.originalSize = originalSize;
    this.updateSize();
  }
  /**
   * Get original size
   * @method getOriginalSize
   * @return {size}
   */
  getOriginalSize() {
    this.originalSize;
  }
  /**
   * Set size with angle
   * @method setSize
   * @private
   * @param {size} size
   */
  setSize(size) {
    /* Map update */
    if(this.scene != null) {
      this.scene.update(
        {
          position : this.physicPosition,
          size : this.size
        },
        {
          position : this.physicPosition,
          size : size
        },
        this.id
      );
    }

    this.size = size;
  }
  /**
   * Get size with angle
   * @method getSize
   * @return {size}
   */
  getSize() {
    return this.size;
  }
  /**
   * Set the graphic position of the physic entity.
   * @method setGraphicPosition
   * @param {position} graphicPosition
   */
  setGraphicPosition(graphicPosition) {
    var physicPostion = this.graphicToPhysicPosition(graphicPosition);

    this.physicPosition.x = physicPostion.x;
    this.physicPosition.y = physicPostion.y;

    if(this.physicBody != null) {

    }
    if(this.graphicEntity != null) {
      var delta = this.getPositionDelta();
      this.graphicPosition = graphicPosition;

      this.graphicEntity.setPosition({
        x : this.graphicPosition.x + delta.x,
        y : this.graphicPosition.y + delta.y
      });
    }
  }
  /**
   * Get the graphic position of the Entity.
   * @method getGraphicPosition
   * @return {position} position
   */
  getGraphicPosition() {
    return this.graphicPosition;
  }
  /**
   * Get position between Scene and Physic ????
   * @method getPositionDelta
   * @private
   * @return {physicPosition} position
   */
  getPositionDelta() {
    var graphicPosition = this.graphicEntity.getPosition();

    return {
      x : Math.abs(this.graphicPosition.x - graphicPosition.x),
      y : Math.abs(this.graphicPosition.y - graphicPosition.y)
    };
  }
  /**
   * Translate graphic position to physic position.
   * @method graphicToPhysicPosition
   * @private
   * @param {position} graphicPosition
   * @return {position}
   */
  graphicToPhysicPosition(graphicPosition) {
    //console.log()
    return {
      x : graphicPosition.x + (this.size.dx / 2),
      y : graphicPosition.y + (this.size.dy / 2)
    };
  }
  /**
   * Translate physic position to graphic position.
   * @method physicToGraphicPosition
   * @private
   * @param {position} physicPosition
   * @return {position}
   */
  physicToGraphicPosition(physicPosition) {
    return {
      x : physicPosition.x - (this.size.dx / 2),
      y : physicPosition.y - (this.size.dy / 2)
    };
  }
  /**
   * Add hitbox to the gravity point
   * @method addHitbox
   * @param {hitbox} hitbox
   */
  addHitbox(hitbox) {
    if(!this.verifyHitbox(hitbox.hitbox.id)) {
      var size = {
            dx : 0,
            dy : 0
          },
          length = this.hitboxes.length;

      hitbox.graphicEntity.setGeometry(hitbox.hitbox);

      switch(hitbox.hitbox.type) {
        case "circle" :
          size = this.geometricMath.getCircleSize(hitbox.hitbox.radius);
          break;
        case "box" :
          size.dx = hitbox.hitbox.dx;
          size.dy = hitbox.hitbox.dx;
          break;
        case "polygon" :
          size = this.geometricMath.getPolygonSize(hitbox.hitbox.vertices);
          break;
      }

      this.hitboxes[length] = {
        fixture : hitbox.hitbox,
        graphicEntity : hitbox.graphicEntity,
        originalSize : size,
        id : hitbox.hitbox.id
      };

      if(this.physicBody != null) {
        this.addFixtureToBody(this.hitboxes[length].fixture);
      }
    }
  }
  /**
   * Verify if hitbox already exist
   * @method verifyHitbox
   * @param {string} id
   * @return {boolean}
   */
  verifyHitbox(id) {
    var length = this.hitboxes.length,
        x = 0;

    for(; x < length; x++) {
      if(this.hitboxes[x].id == id) {
        return true;
      }
    }
    return false;
  }
  /**
   * Delete hitbox to the gravity point
   * @method deleteHitbox
   * @param {string} id
   */
  deleteHitbox(id) {
    var length = this.hitboxes.length,
        x = 0;

    for(; x < length; x++) {
      if(this.hitboxes[x].id == id) {
        this.hitboxes.splice(x, 1);
        return;
      }
    }
  }
  /**
   * Update size with angle
   * @method updateSize
   */
  updateSize() {
    var x = 0,
        length = this.perimeter.length,
        polygon = [];

    for(; x < length; x++) {
      polygon[x] = this.geometricMath.getRotatedPoint(
        this.perimeter[x],
        this.angle,
        {
          x : 0,
          y : 0
        }
      );
    }

    this.setSize(this.geometricMath.getPolygonSize(polygon));
  }
  /**
   * Update original size
   * @method updateOriginalSize
   */
  updateOriginalSize() {
    var length = this.hitboxes.length,
        x = 0,
        minX = 0,
        maxX = 0,
        minY = 0,
        maxY = 0;

    for(; x < length; x++) {
      switch(this.hitboxes[x].graphicEntity.type) {
        case "circle" :
          minX = Math.min(minX, this.hitboxes[x].x - this.hitboxes[x].radius);
          maxX = Math.max(maxX, this.hitboxes[x].x + this.hitboxes[x].radius);
          minY = Math.min(minY, this.hitboxes[x].y - this.hitboxes[x].radius);
          maxY = Math.max(maxY, this.hitboxes[x].y + this.hitboxes[x].radius);
          break;
        case "box" :
          minX = Math.min(minX, this.hitboxes[x].x);
          maxX = Math.max(maxX, this.hitboxes[x].x + this.hitboxes[x].dx);
          minY = Math.min(minY, this.hitboxes[x].y);
          maxY = Math.max(maxY, this.hitboxes[x].y + this.hitboxes[x].dy);
          break;
        case "polygon" :
          minX = Math.min(minX, this.hitboxes[x].x);
          maxX = Math.max(maxX, this.hitboxes[x].x + this.hitboxes[x].dx);
          minY = Math.min(minY, this.hitboxes[x].y);
          maxY = Math.max(maxY, this.hitboxes[x].y + this.hitboxes[x].dy);
          break;
      }
    }

    this.perimeter[0] = {
      x : minX,
      y : minY
    };
    this.perimeter[1] = {
      x : maxX,
      y : minY
    };
    this.perimeter[2] = {
      x : minX,
      y : maxY
    };
    this.perimeter[3] = {
      x : maxX,
      y : maxY
    };

    console.log({
      dx : maxX - minX,
      dy : maxY - minY
    })

    this.setOriginalSize({
      dx : maxX - minX,
      dy : maxY - minY
    });
  }
  /**
   * Add collision geometry to the gravity point
   * @method addFixtureToBody
   * @param {collisionGeometry} collisionGeometry
   */
  addFixtureToBody(collisionGeometry) {
    switch(collisionGeometry.shape) {
      case "circle" :
        return this.physicInterface.getCircle(
          collisionGeometry.id,
          collisionGeometry.x,
          collisionGeometry.y,
          collisionGeometry.radius,
          collisionGeometry.angle,
          collisionGeometry.sensor,
          collisionGeometry.restitution,
          collisionGeometry.friction,
          collisionGeometry.density,
          this.physicBody
        );
        break;
      case "box" :
        return this.physicInterface.getBox(
          collisionGeometry.id,
          collisionGeometry.x,
          collisionGeometry.y,
          collisionGeometry.dx,
          collisionGeometry.dy,
          collisionGeometry.angle,
          collisionGeometry.sensor,
          collisionGeometry.restitution,
          collisionGeometry.friction,
          collisionGeometry.density,
          this.physicBody
        );
        break;
      case "polygon" :
        return this.physicInterface.getPolygon(
          collisionGeometry.id,
          collisionGeometry.x,
          collisionGeometry.y,
          collisionGeometry.vertices,
          collisionGeometry.angle,
          collisionGeometry.sensor,
          collisionGeometry.restitution,
          collisionGeometry.friction,
          collisionGeometry.density,
          this.physicBody
        );
        break;
    }
    this.updateOriginalSize();
  }
  /**
   * Add the physic object to the physic context
   * @method addToPhysicContext
   * @param {scene} scene
   */
  addToPhysicContext(scene) {
    if(this.physicBody == null) {
      this.addToScene(scene);
      this.physicBody = this.physicInterface.getBody(
        this.id,
        this.physicPosition.x,
        this.physicPosition.y,
        this.angle,
        this.mass,
        this.angularConstraint,
        this.angularInertia,
        this.dynamic
      );

      var length = this.hitboxes.length,
          x = 0;

      for(; x < length; x++) {
        this.addFixtureToBody(this.hitboxes[x]);
      }
    }
  }
  /**
   * Delete the physic object to the physic context
   * @method deleteToPhysicContext
   */
  deleteToPhysicContext() {
    if(this.physicBody != null) {
      this.deleteToScene();
    }
  }
  /**
   * Add the object to the Scene
   * @method addToScene
   * @private
   * @param {scene} scene
   */
  addToScene(scene) {
    if(this.scene == null) {
      this.scene = scene;
      this.scene.add(
        {
          x : this.physicPosition.x,
          y : this.physicPosition.y,
          dx : this.size.dx,
          dy : this.size.dy
        },
        this.id
      );
    }
  }
  /**
   * Delete the object to the Scene
   * @method deleteToScene
   * @private
   */
  deleteToScene() {
    if(this.scene != null) {
      this.scene.delete(
        {
          x : this.physicPosition.x,
          y : this.physicPosition.y,
          dx : this.size.dx,
          dy : this.size.dy
        },
        this.id
      );
      this.scene = null;
    }
  }
  /**
   * Set angle
   * @method setAngle
   * @param {number} angle
   */
  setAngle(angle) {
    this.angle = angle;
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
   * @param {vector} vector
   */
  setVelocity(vector) {
    this.physicInterface.setVelocity(this.physicBody, {
      x : vector.x,
      y : vector.y
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
   * @param {scene} scene
   */
  show(scene) {
    var length = this.hitboxes.length,
        x = 0;

    for(; x < length; x++) {
      this.hitboxes[x].graphicEntity.addToScene(scene);
    }
  }
  /**
   * Hide collision geometries
   * @method hide
   */
  hide() {
    var length = this.hitboxes.length,
        x = 0;

    for(; x < length; x++) {
      this.hitboxes[x].graphicEntity.deleteToScene();
    }
  }
  /**
   * Update the physic position
   * @method updatePhysicPosition
   */
  updatePhysicPosition() {
    if(this.physicBody != null) {
      this.physicPosition = this.physicInterface.getPosition(this.physicBody);

      var graphicPosition = this.physicToGraphicPosition(this.physicPosition);

      if(this.name == "groundPhysic") {
        console.log(this.physicPosition)
        console.log(this.graphicPosition)
      }

      if(this.graphicEntity != null) {
        var delta = this.getPositionDelta();

        this.graphicEntity.setPosition({
          x : graphicPosition.x + delta.x,
          y : graphicPosition.y + delta.y
        });
      }

      var x = 0,
          length = this.hitboxes.length;

      for(; x < length; x++) {
        this.hitboxes[x].graphicEntity.setPosition({
          x : this.hitboxes[x].fixture.x + this.graphicPosition.x,
          y : this.hitboxes[x].fixture.y + this.graphicPosition.y
        });
      }

      this.graphicPosition = graphicPosition;
    }
  }
}
