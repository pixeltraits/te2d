/**
 * Graphic Entity
 * @class GraphicEntity
 * @param {graphicEntity} properties
 * @param {string} id
 */
class GraphicEntity {
  constructor(properties, id) {
    /* Identity */
    this.id = id;
    this.name = properties.name;

    /* Position and size */
    this.x = 0;
    this.y = 0;
    this.z = properties.z;
    this.dx = 0;
    this.dy = 0;
    this.dz = properties.dz;
    this.angle = 0;

    /* Sub Graphic entities properties */
    this.parent = null;
    this.subGraphicEntities = [];
    this.graphicObject = null;

    /* Other */
    this.pause = false;
    this.scene = null;
  }
  /**
   * Set the graphic position of the entity and subGraphicEntities
   * @method setPosition
   * @param {position} position
   */
  setPosition(position) {
    /* Update position of subGraphicEntity */
    if(typeof this.subGraphicEntities != "undefined"){
      var x=0,
          length = this.subGraphicEntities.length;

      for(; x < length; x++) {
        this.subGraphicEntities[x].addPosition({
          x : position.x - this.x,
          y : position.y - this.y
        });
        this.subGraphicEntities[x].addZ(position.y - this.y);
      }
    }

    /* Map update */
    if(this.scene != null) {
      this.scene.update(
        {
          x : this.x,
          y : this.y
        },
        {
          x : position.x,
          y : position.y
        },
        this.id
      );
    }

    this.x = position.x;
    this.y = position.y;
    this.updateZ();
  }
  /**
   * Add position to the current position
   * @method addPosition
   * @param {position} position
   */
  addPosition(position) {
    this.setPosition({
      x : this.x + position.x,
      y : this.y + position.y
    });
  }
  /**
   * Set position relative to parent
   * @method setRelativePosition
   * @param {position} position
   */
  setRelativePosition(position) {
    if(this.parent != null) {
      var parentPosition = this.parent.getPosition();

      this.setPosition({
        x : parentPosition.x + position.x,
        y : parentPosition.y + position.y
      });
    }
  }
  /**
   * Add position on z
   * @method addZ
   * @param {number} z
   */
  addZ(z) {
    this.z += z;
  }
  /**
   * Set plan position relative to parent
   * @method setRelativeZ
   * @param {number} z
   */
  setRelativeZ(z) {
    if(this.parent != null) {
      this.z = this.parent.z + z;
    }
  }
  /**
   * Set plan position(Fixe 2D)
   * @method setZ
   * @param {number} z
   */
  setZ(z) {
    if(this.dz == 0) {
      this.z = z;
    }
  }
  /**
   * Update plan position(Automatique 2.5D)
   * @method updateZ
   * @private
   */
  updateZ() {
    if(this.dz != 0) {
      this.z = this.y + this.dy - this.dz;
    }
  }
  /**
   * Set plan size(0 = Fix)
   * @method setDz
   * @param {number} dz
   */
  setDz(dz) {
    this.dz = dz;
    this.updateZ();
  }
  /**
   * Set the graphic size of the entity
   * @method setSize
   * @param {size} size
   */
  setSize(size) {
    /* Map update */
    if(this.scene != null) {
      this.scene.update(
        {
          x: this.x,
          y: this.y,
          dx: this.dx,
          dy: this.dy
        },
        {
          x: this.x,
          y: this.y,
          dx: size.dx,
          dy: size.dy
        },
        this.id
      );
    }

    this.dx = size.dx;
    this.dy = size.dy;
  }
  /**
   * Get the graphic position of the entity.
   * @method getPosition
   * @return {position}
   */
  getPosition() {
    return {
      x : this.x,
      y : this.y
    };
  }
  /**
   * Get the graphic size of the entity.
   * @method getSize
   * @return {size}
   */
  getSize() {
    return {
      dx : this.dx,
      dy : this.dy
    };
  }
  /**
   * Set new animation bitmap
   * @method setBitmap
   * @param {animation} animation
   */
  setBitmap(animation) {
    var bitmap = [],
        length = animation.length,
        x = 0;

    for(; x < length; x++) {
      bitmap[x] = animation[x];
    }

    this.graphicObject = new Bitmap();
    this.graphicObject.setAnimation(bitmap);

    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Set new text
   * @method setText
   * @param {text} text
   */
  setText(text) {
    this.graphicObject = new Text();
    this.graphicObject.setText(text.words, text.style);

    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Set new geometry
   * @method setGeometry
   */
  setGeometry(geometry) {
    switch(geometry.shape) {
      case "box" :
        this.graphicObject = new Box(geometry);
        this.graphicObject.setGeometry(geometry);
        break;
      case "circle" :
        this.graphicObject = new Circle(geometry);
        this.graphicObject.setGeometry(geometry);
        break;
      case "polygon" :
        this.graphicObject = new Polygon(geometry);
        this.graphicObject.setGeometry(geometry);
        break;
    }
    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Set new graphic object
   * @method setGraphicObject
   */
  setGraphicObject(graphicObject) {
    this.graphicObject = graphicObject;

    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Update graphic object
   * @method updateGraphicObject
   * @param {canvasCtx} canvasCtx
   * @param {size} canvasSize
   * @param {position} cameraPosition
   */
  updateGraphicObject(canvasCtx, canvasSize, cameraPosition) {
    var mapPosition = this.getPosition(),
        relativePosition = {
          x : mapPosition.x - cameraPosition.x,
          y : mapPosition.y - cameraPosition.y
        };

    this.graphicObject.show(relativePosition, this.angle, canvasSize, canvasCtx);
  }
  /**
   * Set new audio file
   * @method setAudio
   * @param {audio} audio
   */
  setAudio(audio) {
    if(typeof this.audio == "undefined") {
      this.audio = new Audio();
    }
    this.audio.setAudio(audio.audioConf, audio.audioContext);
  }
  /**
   * Stop the audio file
   * @method unsetAudio
   */
  unsetAudio() {
    this.audio.unsetAudio();
  }
  /**
   * Add the entity from the Scene
   * @method addToScene
   * @param {scene} scene
   */
  addToScene(scene) {
    if(this.scene == null) {
      this.scene = scene;
      this.scene.add(
        {
          x : this.x,
          y : this.y,
          dx : this.dx,
          dy : this.dy
        },
        this.id
      );

      /* Update subObject */
      var length = this.subGraphicEntities.length,
          x=0;

      for(; x < length; x++) {
        this.subGraphicEntities[x].addToScene(this.scene);
      }
    }
  }
  /**
   * Delete the entity from the Scene
   * @method deleteToScene
   */
  deleteToScene() {
    if(this.scene != null) {
      this.scene.delete(
        {
          x : this.x,
          y : this.y,
          dx : this.dx,
          dy : this.dy
        },
        this.id
      );
      this.scene = null;

      /* Update subObject */
      var length = this.subGraphicEntities.length,
          x = 0;

      for(; x < length; x++) {
        this.subGraphicEntities[x].deleteToScene();
      }
    }
  }
  /**
   * Set Pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    if(typeof this.skinMachine != "undefined") {
      this.skinMachine.setPause(pause);
    }
    if(typeof this.audio == "undefined") {
      this.audio.setPause(pause);
    }
    this.pause = true;
  }
  /**
   * Add sub graphic entity
   * @method addSubEntity
   * @param {graphicEntity} subGraphicEntity
   */
  addSubEntity(subGraphicEntity) {
    if(subGraphicEntity.parent == null) {
      subGraphicEntity.setPosition({
        x: this.x + subGraphicEntity.x,
        y: this.y + subGraphicEntity.y
      });

      subGraphicEntity.parent = this;
      subGraphicEntity.dz = 0;

      this.subGraphicEntities[this.subGraphicEntities.length] = subGraphicEntity;
    }
  }
  /**
   * Delete sub grphic entity
   * @method deleteSubObject
   * @param {graphicEntity} subGraphicEntity
   */
  deleteSubEntity(subGraphicEntity) {
    var length = this.subGraphicEntities.length,
        x = 0;

    for(; x < length; x++) {
      if(this.subGraphicEntities[x].id == subGraphicEntity.id) {
        subGraphicEntity.parent = null;
        this.subGraphicEntities.splice(x, 1);
        return;
      }
    }
  }
}
