/**
 * Graphic Entity
 * @class GraphicEntity
 */
class GraphicEntity {
  /**
   * Graphic Entity
   * @class GraphicEntity
   * @param {graphicEntity} properties - object properties
   * @param {string} id - Object Id
   */
  constructor(properties, id) {
    /* Identity */
    this.id = id;
    this.name = properties.name;

    /* Position and size */
    this.position = {
      x: 0,
      y: 0,
      z: properties.z
    };
    this.size = {
      dx: 0,
      dy: 0,
      dz: properties.dz
    };
    this.angle = 0;

    /* Sub Graphic entities properties */
    this.parent = null;
    this.subGraphicEntities = [];
    this.graphicObject = null;
    this.animation = false;

    /* Other */
    this.pause = false;
    this.scene = null;
  }
  /**
   * Set the graphic position of the entity and subGraphicEntities
   * @method setPosition
   * @param {position} position - New position of the graphic entity
   * @return {void}
   */
  setPosition(position) {
    /* Update position of subGraphicEntity */
    const subGraphicEntitiesLength = this.subGraphicEntities.length;

    for (let x = 0; x < subGraphicEntitiesLength; x++) {
      this.subGraphicEntities[x].addPosition({
        x: position.x - this.position.x,
        y: position.y - this.position.y
      });
      this.subGraphicEntities[x].addZPosition(position.y - this.position.y);
    }

    /* Map update */
    if (this.scene != null) {
      this.scene.update(
        {
          x: this.position.x,
          y: this.position.y,
          dx: this.size.dx,
          dy: this.size.dy
        },
        {
          x: position.x,
          y: position.y,
          dx: this.size.dx,
          dy: this.size.dy
        },
        this.id
      );
    }

    this.position.x = position.x;
    this.position.y = position.y;
    this.updateZ();
  }
  /**
   * Add position to the current position
   * @method addPosition
   * @param {position} position - position to add
   * @return {void}
   */
  addPosition(position) {
    this.setPosition({
      x: this.position.x + position.x,
      y: this.position.y + position.y
    });
  }
  /**
   * Set position relative to parent
   * @method setRelativePosition
   * @param {position} position - position relative to parent
   * @return {void}
   */
  setRelativePosition(position) {
    if (this.parent != null) {
      const parentPosition = this.parent.getPosition();

      this.setPosition({
        x: parentPosition.x + position.x,
        y: parentPosition.y + position.y
      });
    }
  }
  /**
   * Add position on z
   * @method addZPosition
   * @param {number} z
   * @return {void}
   */
  addZPosition(z) {
    this.position.z += z;
  }
  /**
   * Set plan position relative to parent
   * @method setRelativeZ
   * @param {number} z
   * @return {void}
   */
  setRelativeZ(z) {
    if (this.parent != null) {
      this.position.z = this.parent.z + z;
    }
  }
  /**
   * Set plan position(Fixe 2D)
   * @method setZ
   * @param {number} z
   * @return {void}
   */
  setZ(z) {
    if (this.size.dz === 0) {
      this.position.z = z;
    }
  }
  /**
   * Update plan position(Automatique 2.5D)
   * @method updateZ
   * @private
   * @return {void}
   */
  updateZ() {
    if (this.size.dz !== 0) {
      this.position.z = this.position.y + this.size.dy - this.size.dz;
    }
  }
  /**
   * Set plan size(0 = Fix)
   * @method setDz
   * @param {number} dz
   * @return {void}
   */
  setDz(dz) {
    this.size.dz = dz;
    this.updateZ();
  }
  /**
   * Set the graphic size of the entity
   * @method setSize
   * @param {size} size - new graphic size of the entity
   * @return {void}
   */
  setSize(size) {
    /* Map update */
    if (this.scene != null) {
      this.scene.update(
        {
          x: this.position.x,
          y: this.position.y,
          dx: this.size.dx,
          dy: this.size.dy
        },
        {
          x: this.position.x,
          y: this.position.y,
          dx: size.dx,
          dy: size.dy
        },
        this.id
      );
    }

    this.size.dx = size.dx;
    this.size.dy = size.dy;
  }
  /**
   * Get the graphic position of the entity.
   * @method getPosition
   * @return {position} - Last graphic entity position
   */
  getPosition() {
    return this.position;
  }
  /**
   * Get the graphic size of the entity.
   * @method getSize
   * @return {size} - Last graphic entity size
   */
  getSize() {
    return this.size;
  }
  /**
   * Set angle
   * @method setAngle
   * @param {number} angle - new angle(radian)
   * @return {void}
   */
  setAngle(angle) {
    this.angle = angle;
  }
  /**
   * Get angle
   * @method getAngle
   * @return {number} - Last graphic entity angle
   */
  getAngle() {
    return this.angle;
  }
  /**
   * Set new animation bitmap
   * @method setBitmap
   * @param {animation} animation - New animation properties
   * @return {void}
   */
  setBitmap(animation, animationCallbacks) {
    this.graphicObject = new Animation();
    this.animation = true;

    this.graphicObject.setAnimation(animation, animationCallbacks);

    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Set new text
   * @method setText
   * @param {text} text - New text properties
   * @return {void}
   */
  setText(text) {
    this.graphicObject = new Text();
    this.animation = false;
    this.graphicObject.setText(text.words, text.style);

    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Set new geometry
   * @method setGeometry
   * @param {geometry} geometry - New geometry properties
   * @return {void}
   */
  setGeometry(geometry) {
    switch (geometry.shape) {
      default:
        console.log('This geometry does not exist.');
        break;
      case 'box':
        this.graphicObject = new Box(geometry);
        this.graphicObject.setGeometry(geometry);
        break;
      case 'circle':
        this.graphicObject = new Circle(geometry);
        this.graphicObject.setGeometry(geometry);
        break;
      case 'polygon':
        this.graphicObject = new Polygon(geometry);
        this.graphicObject.setGeometry(geometry);
        break;
    }
    this.animation = false;
    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Update graphic object
   * @method updateGraphicObject
   * @param {canvasCtx} canvasCtx
   * @param {size} canvasSize
   * @param {position} cameraPosition
   * @return {void}
   */
  updateGraphicObject(canvasCtx, canvasSize, cameraPosition) {
    const mapPosition = this.getPosition();
    const relativePosition = {
      x: mapPosition.x - cameraPosition.x,
      y: mapPosition.y - cameraPosition.y
    };
    let animationInProcess;

    if (this.animation) {
      this.graphicObject.updateAnimationFrame();
      animationInProcess = this.graphicObject.getAnimationInProcess();
      Bitmap.show(animationInProcess, relativePosition, this.angle, canvasSize, canvasCtx);
    } else {
      this.graphicObject.show(relativePosition, this.angle, canvasSize, canvasCtx);
    }
  }
  /**
   * Set new audio file
   * @method setAudio
   * @param {audio} audio - New audio properties
   * @return {void}
   */
  setAudio(audio) {
    if (typeof this.audio === 'undefined') {
      this.audio = new Audio();
    }
    this.audio.setAudio(audio.audioConf, audio.audioContext);
  }
  /**
   * Stop the audio file
   * @method unsetAudio
   * @return {void}
   */
  unsetAudio() {
    this.audio.unsetAudio();
  }
  /**
   * Add the entity to the Scene
   * @method addToScene
   * @param {scene} scene - The scene where add object entity
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
      this.scene.add(zoneWithAngle, this.id);

      /* Update subObject */
      const subGraphicEntitiesLength = this.subGraphicEntities.length;

      for (let x = 0; x < subGraphicEntitiesLength; x++) {
        this.subGraphicEntities[x].addToScene(this.scene);
      }
    }
  }
  /**
   * Delete the entity to the Scene
   * @method deleteToScene
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

      /* Update subObject */
      const subGraphicEntitiesLength = this.subGraphicEntities.length;

      for (let x = 0; x < subGraphicEntitiesLength; x++) {
        this.subGraphicEntities[x].deleteToScene();
      }
    }
  }
  /**
   * Set Pause
   * @method setPause
   * @param {boolean} pause - State of the pause
   * @return {void}
   */
  setPause(pause) {
    if (typeof this.graphicObject !== 'undefined') {
      this.graphicObject.setPause(pause);
    }
    if (typeof this.audio === 'undefined') {
      this.audio.setPause(pause);
    }
    this.pause = pause;
  }
  /**
   * Add sub graphic entity
   * @method addSubEntity
   * @param {graphicEntity} subGraphicEntity - Sub Graphic Entity to add
   * @return {void}
   */
  addSubEntity(subGraphicEntity) {
    if (subGraphicEntity.parent == null) {
      subGraphicEntity.setPosition({
        x: this.position.x + subGraphicEntity.x,
        y: this.position.y + subGraphicEntity.y
      });

      subGraphicEntity.parent = this;
      subGraphicEntity.dz = 0;

      this.subGraphicEntities.push(subGraphicEntity);
    }
  }
  /**
   * Delete sub grphic entity
   * @method deleteSubObject
   * @param {graphicEntity} subGraphicEntity - Sub Graphic Entity to delete
   * @return {void}
   */
  deleteSubEntity(subGraphicEntity) {
    const subGraphicEntitiesLength = this.subGraphicEntities.length;

    for (let x = 0; x < subGraphicEntitiesLength; x++) {
      if (this.subGraphicEntities[x].id === subGraphicEntity.id) {
        subGraphicEntity.parent = null;
        this.subGraphicEntities.splice(x, 1);
        return;
      }
    }
  }
}
