"use strict";/**
 * Clone object
 * @class Clone
 */
class Clone {
  /**
   * Clone object with Img object
   * @method cloneComplexObject
   * @param  {object} complexObject, an object like Image
   * @return {object} clone
   */
  cloneComplexObject(complexObject) {
    const clone = {};
    let i = 0;

    for(i in complexObject) {
      if (complexObject.hasOwnProperty(i)) {
        if(typeof complexObject[i] != 'object' || complexObject[i] instanceof HTMLImageElement) {
          clone[i] = complexObject[i];
        } else {
          clone[i] = this.cloneObject(complexObject[i]);
        }
      }
    }

    return clone;
  }
  /**
   * Clone simple object
   * @method cloneObject
   * @param  {object} simpleObject, js basic object
   * @return {object} clone of the simpleObject
   */
  cloneObject(simpleObject) {
    return JSON.parse(JSON.stringify(simpleObject));
  }
}

/**
 * Math tool for geometry
 * @class GeometricMath
 */
class GeometricMath {
  constructor() {
  }
  /**
   * Get size of a polygon
   * @method getPolygonSize
   * @param {position[]} vertices
   * @return {size}
   */
  getPolygonSize(vertices) {
    let polygonBox = getPolygonBox(vertices);

    return {
      dx : polygonBox.x2 - polygonBox.x1,
      dy : polygonBox.y2 - polygonBox.y1
    };
  }
  /**
   * Get size of a polygon
   * @method getPolygonSize
   * @param {position[]} vertices
   * @return {size}
   */
  getPolygonBox(vertices) {
    let x1 = vertices[0].x;
    let x2 = vertices[0].x;
    let y1 = vertices[0].y;
    let y2 = vertices[0].y;
    let i = 1;
    let length = vertices.length;

    for(; i < length; i++) {
      x1 = Math.min(vertices[i].x, x1);
      x2 = Math.max(vertices[i].x, x2);
      y1 = Math.min(vertices[i].y, y1);
      y2 = Math.max(vertices[i].y, y2);
    }

    return {
      x1 : x1,
      x2 : x2,
      y1 : y1,
      y2 : y2
    };
  }
  /**
   * Get size of a circle
   * @method getCircleSize
   * @param {number} radius
   * @return {size}
   */
  getCircleSize(radius) {
    var diameter = radius * 2;

    return {
      dx : diameter,
      dy : diameter
    };
  }
  /**
   * Get new position with angle
   * @method getRotatedPoint
   * @param {position} position
   * @param {number} angle
   * @param {position} center
   * @return {position}
   */
  getRotatedPoint(position, angle, center) {
    var distance = {
          x : position.x - center.x,
          y : position.y - center.y
        },
        cos = Math.cos(angle),
        sin = Math.sin(angle);

    return {
      x : (cos * distance.x) - (sin * distance.y) + center.x,
      y : (sin * distance.x) + (cos * distance.y) + center.y
    };
  }
  /**
   * Get new position with angle
   * @method getRotatedPolygon
   * @param {position[]} vertices
   * @param {number} angle
   * @param {position} center
   * @return {position}
   */
  getRotatedPolygon(vertices, angle, center) {
    let verticesLength = vertices.length;
    let rotatedVertices = [];

    for(let x = 0; x < verticesLength; x++) {
      rotatedVertices.push(this.getRotatedPoint(vertices[x], angle, center));
    }

    return rotatedVertices;
  }
}

/**
   * Generate unique ID
   * @class IdGenerator
   */
class IdGenerator {
  constructor() {
  }
  /**
     * JsFiddle source code
     * http://jsfiddle.net/briguy37/2mvfd/
     * Created and maintained by Piotr and Oskar.
     * This method generate a unique Id
     * @method generate
     * @return {string} uuid, Unique Id
    */
  generate() {
    var d = new Date().getTime(),
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });

    return uuid;
  }
}

/**
 * Timer system
 * @class Timer
 * @param {number} delta
 */
class Timer {
  constructor(delta) {
    this.t1 = 0;//Date of last execution
    this.t2 = 0;//Time waste for one iteration
    this.delta = delta;//Time before new execution
  }
  /**
   * Set timer delta
   * @method setDelta
   * @param {number} delta
   */
  setDelta(delta) {
    this.delta = delta;
  }
  /**
   * If delta time is past, true
   * @method whatTimeIsIt
   * @param {boolean}
   */
  whatTimeIsIt() {
    var timePast;

    if(this.t1 == 0) {
      this.t1 = Date.now();

      return true;
    } else {
      timePast = Date.now() - this.t1;

      if(timePast >= this.delta) {
        this.t1 = Date.now();

        return true;
      } else {
        return false;
      }
    }
  }
  /**
   * If delta time is past, true
   * With late !!! @refactor !!!
   * @method whatTimeIsItWithLate
   * @param {boolean}
   */
  whatTimeIsItWithLate() {
    var timePast;

    if(this.t1 == 0) {
      this.t1 = Date.now();

      return true;
    } else {
      timePast = Date.now() - this.t1;

      if(timePast + this.t2 >= this.delta) {
        this.t1 += this.delta;
        this.t2 = timePast - this.delta;

        return true;
      } else {
        return false;
      }
    }
  }
}

/**
 * Manage audio
 * @class Audio
 */
class Audio {
  constructor() {
    this.active = false;
    this.pannerNode = null;
    this.pause = false;
    this.source = null;
  }
  /**
   * Play audio
   * @method setAudio
   * @param {audioProfil} audioProfil
   * @param {audioContext} audioContext
   */
  setAudio(audioProfil, audioContext) {
    var self = this;

    if(!this.active && !this.pause) {
      this.active = true;

      /* Audio content implementation */
      this.source = audioContext.createBufferSource();
      this.pannerNode = audioContext.createPanner();
      this.source.connect(this.pannerNode);
      this.pannerNode.connect(audioContext.destination);

      this.source.buffer = audioProfil.audio;

      /* Audio spacialisation for 1.0
       * this.pannerNode.setPosition(0, 1, 1);
      */

      /* Repetition number and end play event */
      this.source.loop = audioProfil.loop;
      this.source.onended = function() {
        self.active = false;
      };

      this.source.start();
    }
  }
  /**
   * Stop audio
   * @method unsetAudio
   */
  unsetAudio() {
    if(!this.pause) {
      this.active = false;
      this.source.loop = false;
      this.source.disconnect(this.pannerNode);
    }
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    /** Pause sound for 1.0
      *  this.pause = pause;
      *  if(this.active) {
      *    if(this.pause) {
      *      this.source.stop();
      *    } else {
      *      this.source.start();
      *    }
      *  }
    */
  }
}

class Animation {
  constructor() {
    this.animation = 0;//Animation in progress
    this.animations = [];//Animation group in progress
    this.animationCallbacks = [];
    this.timer = new Timer();
    this.pause = false;
    this.frame = 0;//Animation frame in progress
  }
  /**
   * Set the animation
   * @method setAnimation
   * @param {animation[]} animations
   * @param {animationCallback[]} animationCallbacks
   */
  setAnimation(animations, animationCallbacks) {
    if(!this.pause) {
      this.animationCallbacks = animationCallbacks;
      this.animations = animations;
      this.frame = 0;
      this.animation = 0;
    }
  }
  /**
   * Get the animation in process
   * @method getAnimationInProcess
   * @return {animation}
   */
  getAnimationInProcess() {
    let animationInProcess = {
      bitmap : this.animations[this.animation].bitmap,
      dx : this.animations[this.animation].dx,
      dy : this.animations[this.animation].dy,
      name : this.animations[this.animation].name,
      repeatX : this.animations[this.animation].repeatX,
      repeatY : this.animations[this.animation].repeatY,
      reverse : this.animations[this.animation].reverse,
      x : this.animations[this.animation].x + (this.frame * this.animations[this.animation].dx),
      y : this.animations[this.animation].y
    }
    return animationInProcess;
  }
  /**
   * Get the size of bitmap with texture repetition
   * @method getSize
   * @return {size}
   */
  getSize() {
    return {
      dx : this.animations[this.animation].dx * this.animations[this.animation].repeatX,
      dy : this.animations[this.animation].dy * this.animations[this.animation].repeatY
    };
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    this.pause = pause;
  }
  /**
   * Update the frame of the animation
   * @method updateAnimationFrame
   */
  updateAnimationFrame() {
    if(this.animations[this.animation].frames > 0 || this.animations.length > 1 || this.animation < this.animations.length - 1) {
      /* The animation is not fix or is an animation group where is not the last animation */
      this.timer.setDelta(this.animations[this.animation].fps);

      if(this.timer.whatTimeIsIt()) {
        /* The time rate is past */

        if(!this.pause) {
          /* The pause is inactive */

          if(this.frame >= this.animations[this.animation].frames) {
            /* The animation is in the last frame */
            this.animationCallbacks[this.animation]();
            this.frame = 0;

            if(this.animations.length > 1 && this.animation < this.animations.length - 1) {
              /* The animation is not the last or unique */
              this.animation++;
            }
          }

          if(this.animations[this.animation].frames > 0) {
            /* The animation have more one frame */
            this.frame++;
          }
        }
      }
    }
  }
}

/**
 * Create animations for bitmap
 * @class Bitmap
 */
class Bitmap {
  constructor() {
    this.geometricMath = new GeometricMath();
  }
  /**
   * Show bitmap on the canvas context
   * @method show
   * @param {position} position
   * @param {number} angle
   * @param {size} canvasSize
   * @param {canvas2dContext} canvasCtx
   */
  show(animation, position, angle, canvasSize, canvasCtx) {
    let center = {
      x : position.x,
      y : position.y
    };
    let repeat = this.getRepetitionBitmapToShow(animation, position, canvasSize, center, angle);

    canvasCtx.translate(center.x, center.y);
    canvasCtx.rotate(angle);

    for(let x = 0; x < repeat.x; x++) {
      for(let y = 0; y < repeat.y; y++) {
        if(animation.reverse) {
          canvasCtx.drawImage(
            this.flipBitmap(animation.bitmap),
            0,
            0,
            animation.dx,
            animation.dy,
            -animation.dx / 2,
            -animation.dy / 2,
            animation.dx,
            animation.dy
          );
        } else {
          canvasCtx.drawImage(
            animation.bitmap,
            animation.x,
            animation.y,
            animation.dx,
            animation.dy,
            animation.dx * x,
            animation.dy * y,
            animation.dx,
            animation.dy
          );
        }
      }
    }

    canvasCtx.rotate(-angle);
    canvasCtx.translate(-center.x, -center.y);
  }
  /**
   * Determinate the number of repeat texture to show
   * @method getRepBitmap
   * @private
   * @param {position} positionBitmap
   * @param {size} sizeView
   * @return {repeatBitmap}
   */
  getRepetitionBitmapToShow(animation, positionBitmap, sizeView, center, angle) {
    let polygon = [
      {
        x : positionBitmap.x,
        y : positionBitmap.y
      },
      {
        x : positionBitmap.x + animation.dx * animation.repeatX,
        y : positionBitmap.y
      },
      {
        x : positionBitmap.x + animation.dx * animation.repeatX,
        y : positionBitmap.y + animation.dy * animation.repeatY
      },
      {
        x : positionBitmap.x,
        y : positionBitmap.y + animation.dy * animation.repeatY
      }
    ];
    let polygonBox = this.geometricMath.getPolygonBox(this.geometricMath.getRotatedPolygon(polygon, angle, center));
    let visibleSize = {
      dx : this.getVisibleLength(polygonBox.x1, polygonBox.x2, sizeView.dx),
      dy : this.getVisibleLength(polygonBox.y1, polygonBox.y2, sizeView.dy)
    };
    let maxVisibleSize = Math.max(visibleSize.dx, visibleSize.dy);

    return {
      x : Math.min(animation.repeatX, Math.ceil(maxVisibleSize / animation.dx)),
      y : Math.min(animation.repeatY, Math.ceil(maxVisibleSize / animation.dy))
    };
  }
  /**
   * Reverse pixel of bitmap(Horyzontal)
   * @method flipBitmap
   * @param {animation} animation
   * @return {canvas} canvas
   */
  getVisibleLength(x, x2, dxLimit) {
    let dx = 0;

    if(x > 0) {
      if(x2 < dxLimit) {
        dx = x2 - x;
      } else {
        dx = dxLimit - x;
      }
    } else {
      if(x2 < dxLimit) {
        dx = x2;
      } else {
        dx = dxLimit;
      }
    }

    return dx;
  }
  /**
   * Reverse pixel of bitmap(Horyzontal)
   * @method flipBitmap
   * @param {animation} animation
   * @return {canvas} canvas
   */
  flipBitmap(animation) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = animation.dx;
    canvas.height = animation.dy;

    context.drawImage(
      animation.bitmap,
      animation.x,
      animation.y,
      animation.dx,
      animation.dy,
      0,
      0,
      animation.dx,
      animation.dy
    );

    let imageData = context.getImageData(0, 0, animation.dx, animation.dy);

    /* Bitmap flipping */
    for (let i = 0; i < imageData.height; i++) {
      for (let j = 0; j < imageData.width / 2; j++) {
        let index = (i * 4) * imageData.width + (j * 4);
        let mirrorIndex = ((i + 1) * 4) * imageData.width - ((j + 1) * 4);

        for (let p = 0; p < 4; p++) {
          let temp = imageData.data[index + p];
          imageData.data[index + p] = imageData.data[mirrorIndex + p];
          imageData.data[mirrorIndex + p] = temp;
        }
      }
    }
    context.putImageData(imageData, 0, 0);

    return canvas;
  }
}

/**
 * Manage text
 * @class Text
 */
class Text {
  constructor() {
    this.pause = false;
    this.dx = 0;
    this.dy = 0;

    /* Text content */
    this.text = "";

    /* Text style */
    this.color = "";
    this.font = "";
    this.fontSize = 0;
  }
  /**
   * Update size
   * @method updateSize
   * @private
   */
  updateSize() {
    var canvas = document.createElement('canvas'),
        canvasCtx = canvas.getContext('2d');

    canvasCtx.font = this.fontSize + "px " + this.font;

    this.dx = canvasCtx.measureText(this.text).width;
    this.dy = this.fontSize;
  }
  /**
   * Get size
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
   * Set text
   * @method setText
   * @param {string} text
   * @param {textProfil} style
   */
  setText(text, style) {
    this.text = text;
    this.color = style.color;
    this.font = style.font;
    this.fontSize = style.size;

    this.updateSize();
  }
  /**
   * Show text on the canvas context
   * @method show
   * @param {position} position
   * @param {number} angle
   * @param {size} canvasSize
   * @param {canvas2dContext} canvasCtx
   */
  show(position, angle, canvasSize, canvasCtx) {
    var absX = position.x + (this.dx / 2),
        absY = position.y + (this.dy / 2);

    canvasCtx.translate(absX, absY);
    canvasCtx.rotate(angle);

    canvasCtx.font = this.fontSize + "px " + this.font;
    canvasCtx.fillStyle = this.color;
    canvasCtx.fillText(this.text, position.x, position.y);

    canvasCtx.translate(-absX, -absY);
    canvasCtx.rotate(-angle);
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    this.pause = pause;
  }
}

/**
 * Manage Geometry
 * @class Geometry
 */
class Geometry {
  constructor() {
    this.type = "";
    this.pause = false;
    this.color = "";
    this.borderColor = "";
    this.borderSize = 0;
    this.size = {
      dx : 0,
      dy : 0
    };
  }
  /**
   * Get size
   * @method getSize
   * @return {size}
   */
  getSize() {
    return this.size;
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {geometry} geometry
   */
  setGeometry(geometry) {
    this.color = geometry.color;
    this.borderColor = geometry.borderColor;
    this.borderSize = geometry.borderSize;
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    this.pause = pause;
  }
  /**
   * Show Geometry on the canvas context
   * @method show
   * @param {position} position
   * @param {number} angle
   * @param {size} canvasSize
   * @param {canvas2dContext} canvasCtx
   */
  show(position, angle, canvasSize, canvasCtx) {
  }
}

/**
 * Manage Box
 * @class Box
 */
class Box extends Geometry {
  constructor() {
    super();

    this.type = "box";
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {box} box
   */
  setGeometry(box) {
    super.setGeometry(box);

    this.size.dx = box.dx;
    this.size.dy = box.dy;
  }
  /**
   * Show Geometry on the canvas context
   * @method show
   * @param {position} position
   * @param {number} angle
   * @param {size} canvasSize
   * @param {canvas2dContext} canvasCtx
   */
  show(position, angle, canvasSize, canvasCtx) {
    super.show(position, angle, canvasSize, canvasCtx);

    var center = {
      x : position.x,
      y : position.y
    };

    canvasCtx.translate(center.x, center.y);
    canvasCtx.rotate(angle);

    canvasCtx.fillStyle = this.borderColor;
    canvasCtx.fillRect(
      0,
      0,
      this.size.dx + (this.borderSize * 2),
      this.size.dy + (this.borderSize * 2)
    );
    canvasCtx.fillStyle = this.color;
    canvasCtx.fillRect(
      this.borderSize - (0),
      this.borderSize - (0),
      this.size.dx,
      this.size.dy
    );

    canvasCtx.rotate(-angle);
    canvasCtx.translate(-center.x, -center.y);
  }
}

/**
 * Manage Circle
 * @class Circle
 */
class Circle extends Geometry {
  constructor() {
    super();

    this.type = "circle";
    this.radius = 0;
    this.geometricMath = new GeometricMath();
  }
  /**
   * Update the size of geometry
   * @method updateSize
   */
  updateSize() {
    this.size = this.geometricMath.getCircleSize(this.radius);
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {circle} circle
   */
  setGeometry(circle) {
    super.setGeometry(circle);

    this.radius = circle.radius;
    this.updateSize();
  }
  /**
   * Show Geometry on the canvas context
   * @method show
   * @param {position} position
   * @param {number} angle
   * @param {size} canvasSize
   * @param {canvas2dContext} canvasCtx
   */
  show(position, angle, canvasSize, canvasCtx) {
    super.show(position, angle, canvasSize, canvasCtx);

    var centerX = position.x + this.radius,
        centerY = position.y + this.radius;

    canvasCtx.translate(centerX, centerY);
    canvasCtx.rotate(angle);

    canvasCtx.beginPath();
    canvasCtx.arc(
      position.x,
      position.y,
      this.radius,
      0,
      2 * Math.PI
    );
    canvasCtx.fillStyle = this.color;
    canvasCtx.lineWidth = this.borderSize;
    canvasCtx.strokeStyle = this.borderColor;
    canvasCtx.fill();

    canvasCtx.stroke();

    canvasCtx.rotate(-angle);
    canvasCtx.translate(-centerX, -centerY);
  }
}

/**
 * Manage Polygon
 * @class Polygon
 */
class Polygon extends Geometry {
  constructor() {
    super();

    this.type = "Polygon";
    this.geometricMath = new GeometricMath();
    this.vertices = [];
  }
  /**
   * Update the size of geometry
   * @method updateSize
   */
  updateSize() {
    this.size = this.geometricMath.getPolygonSize(this.vertices);
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {polygon} polygon
   */
  setGeometry(polygon) {
    super.setGeometry(polygon);

    this.vertices = polygon.vertices;
    this.updateSize();
  }
  /**
   * Show Geometry on the canvas context
   * @method show
   * @param {position} position
   * @param {number} angle
   * @param {size} canvasSize
   * @param {canvas2dContext} canvasCtx
   */
  show(position, angle, canvasSize, canvasCtx) {
    super.show(position, angle, canvasSize, canvasCtx);

    var centerX = position.x + (this.size.dx / 2),
        centerY = position.y + (this.size.dy / 2),
        x = 0,
        length = this.vertices.length;

    canvasCtx.translate(centerX, centerY);
    canvasCtx.rotate(angle);

    //Draw Geometry
    canvasCtx.beginPath();

    for (; x < length; x++) {
      canvasCtx.moveTo(
        this.vertices[x].x + position.x,
        this.vertices[x].y + position.y
      );
    }

    canvasCtx.lineTo(this.vertices[0].x + position.x, this.vertices[0].y + position.y);
    canvasCtx.closePath();

    //Style geometry
    canvasCtx.fillStyle = this.color;
    canvasCtx.lineWidth = this.borderSize;
    canvasCtx.strokeStyle = this.borderColor;

    canvasCtx.fill();
    canvasCtx.stroke();

    canvasCtx.rotate(-angle);
    canvasCtx.translate(-centerX, -centerY);
  }
}

/**
 * Manage keyboard event
 * @class Keyboard
 * @param {domElement} domELement
 * @param {keyboardEvent} onKeydown
 * @param {keyboardEvent} onKeyup
 */
class Keyboard {
  constructor(domELement, onKeydown, onKeyup) {
    this.domELement = domELement;
    this.onKeydown = onKeydown;
    this.onKeyup = onKeyup;
    this.active = false;
    this.activeKey = [];

    this.addEvents();
  }
  /**
   * Event implementation
   * @method handleEvent
   * @private
   * @param {keyboardEvent} event
   */
  handleEvent(event) {
    switch(event.type) {
      case 'keydown':
        this.keydown(event);
        break;
      case 'keyup':
        this.keyup(event);
        break;
      case 'blur':
        this.blur();
        break;
    }
  }
  /**
   * Called everytime one key is down
   * @method keydown
   * @private
   * @param {keyboardEvent} event
   */
  keydown(event) {
    var keyInfo = {
      code : event.code,
      key : event.key
    };

    if(!this.isActive(keyInfo)) {
      this.addKey(keyInfo);
      this.onKeydown(keyInfo);
    }
  }
  /**
   * Called everytime one key is up
   * @method keyup
   * @private
   * @param {keyboardEvent} event
   */
  keyup(event) {
    var keyInfo = {
      code : event.code,
      key : event.key
    };

    this.deleteKey(keyInfo);
    this.onKeyup(keyInfo);
  }
  /**
   * Called everytime the domElement is focusout
   * @method blur
   * @private
   */
  blur() {
    var x = 0,
        length = this.activeKey.length;

    for(; x < length; x++) {
      this.onKeyup(this.activeKey[x]);
    }
    this.deleteAllKeys();
  }
  /**
   * Active all events
   * @method addEvents
   */
  addEvents() {
    if(!this.active) {
      this.domELement.addEventListener('keydown', this, false);
      this.domELement.addEventListener('keyup', this, false);
      this.domELement.addEventListener('blur', this, false);
      this.active = true;
    }
  }
  /**
   * Delete all events
   * @method deleteEvents
   */
  deleteEvents() {
    if(!this.active) {
      this.domELement.removeEventListener('keydown', this, false);
      this.domELement.removeEventListener('keyup', this, false);
      this.domELement.removeEventListener('blur', this, false);
      this.active = false;
    }
  }
  /**
   * Add one key
   * @method addKey
   * @private
   * @param {keyInfo} keyInfo
   */
  addKey(keyInfo) {
    this.activeKey[this.activeKey.length] = keyInfo;
  }
  /**
   * Delete one key
   * @method deleteKey
   * @private
   * @param {keyInfo} keyInfo
   */
  deleteKey(keyInfo) {
    var x = 0,
        length = this.activeKey.length;

    for(; x < length; x++) {
      if(this.activeKey[x].code == keyInfo.code) {
        this.activeKey.splice(x, 1);

        return;
      }
    }
  }
  /**
   * Delete all keys
   * @method deleteAllKeys
   * @private
   */
  deleteAllKeys() {
    this.activeKey = [];
  }
  /**
   * Get the status of key
   * @method isActive
   * @param {keyInfo} keyInfo
   * @return {boolean}
   */
  isActive(keyInfo) {
    var x = 0,
        length = this.activeKey.length;

    for(; x < length; x++) {
      if(this.activeKey[x].code == keyInfo.code) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Manage Click event
 * @class Mouse
 * For 0.9 version
 */
class Mouse {
	constructor() {
  }
}

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
    this.pixelMetterFactor = 0.05;

    this.physicContext = new this.b2World(
       new this.b2Vec2(0, 100),
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
      x : this.pixelToMetter(x),
      y : this.pixelToMetter(y)
    };
    let rightTopPoint = {
      x : this.pixelToMetter(x + dx),
      y : this.pixelToMetter(y)
    };
    let leftBottomPoint = {
      x : this.pixelToMetter(x),
      y : this.pixelToMetter(y + dy)
    };
    let rightBottomPoint = {
      x : this.pixelToMetter(x + dx),
      y : this.pixelToMetter(y + dy)
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
    fixDef.angle = angle;

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
    velocity.y = this.pixelToMetter(vector.y);
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
          x : this.pixelToMetter(vector.x),
          y : this.pixelToMetter(vector.y)
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

/**
   * Interface of physic API
   * @class PhysicInterface
   * @param {function} collisionStart
   * @param {function} collisionEnd
   */
class PhysicInterface {
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
    this.animation = null;

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
          y : this.y,
          dx : this.dx,
          dy : this.dy
        },
        {
          x : position.x,
          y : position.y,
          dx : this.dx,
          dy : this.dy
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
   * Set angle
   * @method setAngle
   * @param {number} angle
   */
  setAngle(angle) {
    this.angle = angle;
  }
  /**
   * Set angle
   * @method setAngle
   * @param {number} angle
   */
  getAngle(angle) {
    return this.angle;
  }
  /**
   * Set new animation bitmap
   * @method setBitmap
   * @param {animation} animation
   */
  setBitmap(animation) {
    this.graphicObject = new Bitmap();
    this.animation = new Animation();

    this.animation.setAnimation(animation);

    this.setSize(this.animation.getSize());
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
    let mapPosition = this.getPosition();
    let relativePosition = {
      x : mapPosition.x - cameraPosition.x,
      y : mapPosition.y - cameraPosition.y
    };
    let animationInProcess;

    if(this.animation) {
      this.animation.updateAnimationFrame();
      animationInProcess = this.animation.getAnimationInProcess();
      this.graphicObject.show(animationInProcess, relativePosition, this.angle, canvasSize, canvasCtx);
    } else {
      this.graphicObject.show(relativePosition, this.angle, canvasSize, canvasCtx);
    }

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
    this.graphicDelta = {
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
      dx : 1,
      dy : 1
    };

    this.angle = 0;
    this.perimeter = [];

    /* Mouvement properties */
    this.velocity = {
      x : 0,
      y : 0
    };
    this.angleConstraint = properties.angleConstraint != undefined ? properties.angleConstraint : false;
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
   * Set scene entity reference
   * @method setGraphicEntity
   * @param {position} position
   */
  setGraphicDelta(position) {
    this.graphicDelta = position;
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
    var physicPosition = this.graphicToPhysicPosition(graphicPosition);

    this.physicPosition.x = physicPosition.x;
    this.physicPosition.y = physicPosition.y;

    if(this.physicBody != null) {

    }
    if(this.graphicEntity != null) {
      this.graphicPosition = graphicPosition;

      this.graphicEntity.setPosition({
        x : this.physicPosition.x + this.graphicDelta.x,
        y : this.physicPosition.y + this.graphicDelta.y
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
      let size = {
        dx : 0,
        dy : 0
      };

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

      let hit = this.hitboxes.push({
        fixture : hitbox.hitbox,
        graphicEntity : hitbox.graphicEntity,
        originalSize : size,
        id : hitbox.hitbox.id
      });

      if(this.physicBody != null) {
        this.addFixtureToBody(hit.fixture);
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
        x = 0;

    if(length > 0) {
      switch(this.hitboxes[0].fixture.shape) {
        case "circle" :
          var minX = this.hitboxes[0].fixture.x,
              maxX = this.hitboxes[0].fixture.x - this.hitboxes[0].fixture.radius,
              minY = this.hitboxes[0].fixture.y,
              maxY = this.hitboxes[0].fixture.y - this.hitboxes[0].fixture.radius;
          break;
        case "box" :
          var minX = this.hitboxes[0].fixture.x,
              maxX = this.hitboxes[0].fixture.x + this.hitboxes[0].fixture.dx,
              minY = this.hitboxes[0].fixture.y,
              maxY = this.hitboxes[0].fixture.y + this.hitboxes[0].fixture.dy;
          break;
        case "polygon" :
          var minX = this.hitboxes[0].fixture.x,
              maxX = this.hitboxes[0].fixture.x + this.hitboxes[0].fixture.dx,
              minY = this.hitboxes[0].fixture.y,
              maxY = this.hitboxes[0].fixture.y + this.hitboxes[0].fixture.dy;
          break;
      }
    }

    for(; x < length; x++) {
      switch(this.hitboxes[x].fixture.shape) {
        case "circle" :
          minX = Math.min(minX, this.hitboxes[x].fixture.x - this.hitboxes[x].fixture.radius);
          maxX = Math.max(maxX, this.hitboxes[x].fixture.x + this.hitboxes[x].fixture.radius);
          minY = Math.min(minY, this.hitboxes[x].fixture.y - this.hitboxes[x].fixture.radius);
          maxY = Math.max(maxY, this.hitboxes[x].fixture.y + this.hitboxes[x].fixture.radius);
          break;
        case "box" :
          minX = Math.min(minX, this.hitboxes[x].fixture.x);
          maxX = Math.max(maxX, this.hitboxes[x].fixture.x + this.hitboxes[x].fixture.dx);
          minY = Math.min(minY, this.hitboxes[x].fixture.y);
          maxY = Math.max(maxY, this.hitboxes[x].fixture.y + this.hitboxes[x].fixture.dy);
          break;
        case "polygon" :
          minX = Math.min(minX, this.hitboxes[x].fixture.x);
          maxX = Math.max(maxX, this.hitboxes[x].fixture.x + this.hitboxes[x].fixture.dx);
          minY = Math.min(minY, this.hitboxes[x].fixture.y);
          maxY = Math.max(maxY, this.hitboxes[x].fixture.y + this.hitboxes[x].fixture.dy);
          break;
      }
    }

    this.setSize({
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
    switch(collisionGeometry.fixture.shape) {
      case "circle" :
        return this.physicInterface.getCircle(
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
      case "box" :
        return this.physicInterface.getBox(
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
      case "polygon" :
        return this.physicInterface.getPolygon(
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
   * @param {scene} scene
   */
  addToPhysicContext(scene) {
    if(this.physicBody == null) {
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

      this.addToScene(scene);
    }
  }
  /**
   * Delete the physic object to the physic context
   * @method deleteToPhysicContext
   */
  deleteToPhysicContext(scene) {
    if(this.physicBody != null) {
      this.deleteToScene(scene);
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
        this.id,
        "physic"
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
      this.angle = this.physicInterface.getAngle(this.physicBody);

      var graphicPosition = this.physicToGraphicPosition(this.physicPosition);

      if(this.graphicEntity != null) {
        this.graphicEntity.setPosition({
          x : graphicPosition.x + this.graphicDelta.x,
          y : graphicPosition.y + this.graphicDelta.y
        });
        this.graphicEntity.setAngle(this.angle);
      }

      var x = 0,
          length = this.hitboxes.length;

      for(; x < length; x++) {
        this.hitboxes[x].graphicEntity.setPosition({
          x : this.hitboxes[x].fixture.x + this.graphicPosition.x,
          y : this.hitboxes[x].fixture.y + this.graphicPosition.y
        });
        this.hitboxes[x].graphicEntity.setAngle(this.angle + this.hitboxes[x].fixture.angle);
      }

      this.graphicPosition = graphicPosition;
    }
  }
}

/**
 * Scene Manager
 * @class Scene
 * @param {size} size
 * @param {number} ratio
 */
﻿class Scene {
  constructor(size, ratio) {
    this.map = [];
    this.ratio = ratio;

    this.cases = {
      x : Math.ceil(size.dx / this.ratio),
      y : Math.ceil(size.dy / this.ratio)
    };

    for(var x = 0; x < this.cases.x; x++) {
      this.map[x] = [];
      for(var y = 0; y < this.cases.y; y++) {
        this.map[x][y] = [];
      }
    }
  }
  /**
   * Get entities in the zone defined
   * @method getEntities
   * @param {zone} zone
   * @return {entity[]} entities
   */
  getEntities(zone) {
    var firstCaseX = Math.floor(zone.x / this.ratio),
        firstCaseY = Math.floor(zone.y / this.ratio),
        lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio),
        lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio),
        entities = [],
        list = [],
        x = firstCaseX;

    for(; x < lastCaseX; x++) {
      /* Read every cases in x between zone.x and zone.dx */
      for(var y = firstCaseY; y < lastCaseY; y++) {
        /* Read every cases in y between zone.y and zone.dy */
        var length = this.map[x][y].length,
            z=0;

        for(; z < length; z++) {
          /* Read every entity in this case */
          if(typeof list[this.map[x][y][z]] == "undefined") {
            /* The entity is not set yet */
            entities[entities.length] = this.map[x][y][z];
            list[this.map[x][y][z]] = true;
          }
        }
      }
    }

    return entities;
  }
  /**
   * Update entity position
   * @method update
   * @param {zone} oldZone
   * @param {zone} newZone
   * @param {string} id
   */
  update(oldZone, newZone, id) {
    this.delete(oldZone, id);
    this.add(newZone, id);
  }
  /**
   * Add entity in map
   * @method add
   * @param {zone} zone
   * @param {string} id
   */
  add(zone, id) {
    var firstCaseX = Math.floor(zone.x / this.ratio),
        firstCaseY = Math.floor(zone.y / this.ratio),
        lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio),
        lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio),
        x = firstCaseX;

    for(; x < lastCaseX; x++) {
      for(var y = firstCaseY; y < lastCaseY; y++) {
        this.map[x][y][this.map[x][y].length] = id;
      }
    }
  }
  /**
   * Delete entity in map
   * @method delete
   * @param {zone} zone
   * @param {string} id
   */
  delete(zone, id) {
    var firstCaseX = Math.floor(zone.x / this.ratio),
      firstCaseY = Math.floor(zone.y / this.ratio),
      lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio),
      lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio),
      x = firstCaseX;

    for(;x < lastCaseX;x++){
      for(var y = firstCaseY; y < lastCaseY; y++) {
        var length = this.map[x][y].length,
            z = 0;

        for(; z < length; z++) {
          if(this.map[x][y][z] == id) {
            this.map[x][y].splice(z, 1);
          }
        }
      }
    }
  }
}

/**
 * Display manager
 * @class Camera
 * @param {camera} properties
 * @param {string} id
 */
class Camera extends PhysicEntity {
  constructor(properties, id) {
    super(properties, id);

    /* Camera Properties */
    this.canvas = document.getElementById(properties.canvasId);
    this.ctx = this.canvas.getContext("2d", {
      antialias : true
    });
    this.dx = properties.dx != undefined ? properties.dx : 0;
    this.dy = properties.dy != undefined ? properties.dy : 0;
    this.scale = properties.scale != undefined ? properties.scale : 1;
    this.displayMode = properties.displayMode != undefined ? properties.displayMode : "default";
    this.stopDisplayLoop = false;
    this.onDisplayUpdate = function(){};

    /* Fps system */
    this.fpsDisplay = false;
    this.lastFrameDate = Date.now();
    this.fps = 0;
    this.fpsFont = {
        size : 25,
        font : "Courier New",
        style : "white bold"
    };
    this.fpsPosition = {
        x : 20,
        y : 20
    };

    /* Event called when display is updated */
    this.displayUpdated = new CustomEvent("displayUpdated", {
      bubbles : false,
      cancelable : true,
      detail : {}
    });

    this.updateDisplaySize();
  }
  /**
   * Update the calculated size
   * @method updateDisplaySize
   * @param {size} size - new size of the display
   */
  setDisplaySize(size) {
    this.dx = size.dx;
    this.dy = size.dy;
    this.updateDisplaySize();
  }
  /**
   * Update the calculated size
   * @method updateDisplaySize
   */
  updateDisplaySize() {
    switch(this.displayMode) {
      case "default":
        this.activeDefaultDisplay();
        break;
      case "fullwindow":
        this.activeFullwindow();
        break;
      case "fullscreen":
        this.activeFullscreen();
        break;
      default:
        this.activeDefaultDisplay();
    }
  }
  /**
   * The camera take the full display of the screen
   * @method activeFullscreen
   */
  activeFullscreen() {
    /* For 1.0, by default fullwindow mode is actived */
    this.activeFullwindow();
  }
  /**
   * The camera take the full display of the window browser
   * @method activeFullwindow
   */
  activeFullwindow() {
    var winDx = window.innerWidth,
        winDy = window.innerHeight,
        scale = this.displayScale(this.dx, this.dy, winDx, winDy);

    this.canvas.width = winDx;
    this.canvas.height = winDy;
    this.ctx.scale(scale, scale);
    this.ctx.imageSmoothingEnabled = false;
  }
  /**
   * The camera display without adaptative parameters
   * @method activeDefaultDisplay
   */
  activeDefaultDisplay() {
    this.canvas.width = this.dx * this.scale;
    this.canvas.height = this.dy * this.scale;
    this.ctx.scale(this.scale, this.scale);
    this.ctx.imageSmoothingEnabled = false;
  }
  /**
     * The camera display without adaptative parameters
     * @method activeDefaultDisplay
     */
  scale(x) {
    this.ctx.scale(x, x);
  }
  /**
   * Calculate the scale of canvas to new resolution
   * Without deform the render or get empty space on display
   * @method displayScale
   * @param {number} dx1 - width of original resolution
   * @param {number} dy1 - height of original resolution
   * @param {number} dx2 - width of new resolution
   * @param {number} dy2 - height of new resolution
   * @return {number} scale - the higher scale between width and height of canvas
   */
  displayScale(dx1, dy1, dx2, dy2) {
    var scaleX = dx2 / dx1,
        scaleY = dy2 / dy1;

    if(Math.abs(scaleX) < Math.abs(scaleY)) {
      return scaleY;
    } else {
      return scaleX;
    }
  }
  /**
   * Start the display loop
   * @method start
   */
  start() {
    this.displayUpdate(0);
  }
  /**
   * Stop the display loop
   * @method stop
   */
  stop() {
    this.stopDisplayLoop = true;
  }
  /**
   * Update fps and his display
   * @method fpsUpdate
   */
  fpsUpdate() {
    /* Fps calcul */
    var frameDate = Date.now(),
    delta = frameDate - self.lastFrameDate;

    /* Fps update */
    this.fps = 1000 / delta;
    this.lastFrameDate = frameDate;

    /* Fps Display update */
    this.ctx.font = this.fpsFont.size+'px '+this.fpsFont.font;
    this.ctx.fillStyle = this.fpsFont.style;
    this.ctx.fillText(this.fps, this.fpsPosition.x, this.fpsPosition.y);
  }
  /**
   * Show the framerate performance on display
   * @method showFps
   */
  showFps() {
    if(!this.fpsDisplay) {
      this.fpsDisplay = true;
      this.canvas.addEventListener("displayUpdated", this.fpsUpdate, false);
    }
  }
  /**
   * Hide the framerate performance on display
   * @method hideFps
   */
  hideFps() {
    if(this.fpsDisplay) {
      this.fpsDisplay = false;
      this.canvas.removeEventListener("displayUpdated", this.fpsUpdate, false);
    }
  }
  /**
   * Set method called in displayUpdate
   * @method setDisplayUpdateMethod
   */
  setDisplayUpdateMethod(onDisplayUpdate) {
    this.onDisplayUpdate = onDisplayUpdate;
  }
  /**
   * Update the display on browser framerate(~60fps)
   * @method displayUpdate
   */
  displayUpdate(timePast) {
    var startDate = Date.now(),
        self = this;

    this.onDisplayUpdate(timePast);
    this.canvas.dispatchEvent(this.displayUpdated);

    /* Stop command */
    if(this.stopDisplayLoop) {
      this.stopDisplayLoop = false;
      return;
    }

    /* Framerate Loop */
    window.requestAnimationFrame(function() {
      self.displayUpdate((Date.now() - startDate) / 1000);
    });
  }
}

class Player2D extends PhysicEntity {
  constructor(properties, id) {
    super(properties, id);

    this.accRight = 0;
    this.accLeft = 0;
    this.maxSpeed = 3;
  }
  spring(vector) {
    this.physicInterface.setImpulse(this.physicBody, vector);
  }
  setWalk(walkObject) {
    switch(walkObject.direction) {
      case "right" :
        this.accRight = walkObject.acc;
        break;
      case "left" :
        this.accLeft = -walkObject.acc;
        break;
    }
    this.maxSpeed = walkObject.speed;
  }
  unsetWalk(direction) {
    var velocity =  this.getVelocity();
    switch(direction) {
      case "right" :
        this.accRight = 0;
        break;
      case "left" :
        this.accLeft = 0;
        break;
    }
  }
  updatePhysicPosition() {
    super.updatePhysicPosition();

    var velocity = this.getVelocity(),
        force = {
          x : 0,
          y : 0
        };

    if(velocity.x < this.maxSpeed) {
      force.x += this.accRight;
    }
    if(velocity.x > -this.maxSpeed) {
      force.x += this.accLeft;
    }
    if(this.accLeft == 0 && this.accRight == 0) {
      this.physicInterface.stopForces(this.physicBody);
    }

    this.setVelocity(force);
  }
}

/**
 * Load Audio ressource.
 * @class AudioLoader
 */
class AudioLoader {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }
  /**
   * Load Audio ressource.
   * @method getContext
   * @return {audioContext} this.context
   */
  getContext() {
    return this.context;
  }
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method load
   * @param {ajaxRequest} ajaxRequest
   */
	load(ajaxRequest) {
    var requestType = typeof ajaxRequest.type != "undefined" ? ajaxRequest.type : 'GET',
        requestRef = typeof ajaxRequest.ref != "undefined" ? ajaxRequest.ref : "",
        requestOnload = ajaxRequest.onLoad,
        requestUrl = ajaxRequest.url,
        xhr = new XMLHttpRequest(),
        self = this;

    try {
      xhr.open(requestType, requestUrl, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        self.context.decodeAudioData(xhr.response, function(buffer) {
          requestOnload(buffer, requestRef);
        });
      }
      xhr.send();
    }
    catch(e) {
      console.log('An ajax request(Audio) have an error : ', e.message);
      console.log("Request parameters : ", ajaxRequest);
    }
  }
}

/**
 * Load Bitmap ressource.
 * @class BitmapLoader
 */
class BitmapLoader {
  constructor() {
  }
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method load
   * @param {ajaxRequest} ajaxRequest
   */
  load(ajaxRequest) {
    var requestRef = typeof ajaxRequest.ref != "undefined" ? ajaxRequest.ref : "",
        requestOnload = ajaxRequest.onLoad,
        requestUrl = ajaxRequest.url,
        bitmap = new Image();

    try {
      bitmap.src = requestUrl;
      bitmap.onload = requestOnload(bitmap, requestRef);
    }
    catch(e) {
      console.log('An ajax request(Bitmap) have an error : ', e.message);
      console.log("Request parameters : ", ajaxRequest);
    }
  }
}

class EntitiesFactory {
    constructor() {
    }
    getInstance(className, data) {
      switch(className) {
        case "GraphicEntity" :
          return new GraphicEntity(data.properties, data.id);
          break;
        case "PhysicEntity" :
          return new PhysicEntity(data.properties, data.id);
          break;
        case "Camera" :
          return new Camera(data.properties, data.id);
          break;
        case "Player2D" :
          return new Player2D(data.properties, data.id);
          break;
      }

      return false;
    }
}

/**
 * Load Json ressource.
 * @class JsonLoader
 */
class JsonLoader {
  constructor() {
  }
  /**
   * Create xhr object and load json ressource with ajax.
   * @method load
   * @param {ajaxRequest} ajaxRequest
   */
  load(ajaxRequest) {
    var requestType = typeof ajaxRequest.type != "undefined" ? ajaxRequest.type : 'GET',
        requestData = typeof ajaxRequest.data != "undefined" ? ajaxRequest.data : null,
        requestRef = typeof ajaxRequest.ref != "undefined" ? ajaxRequest.ref : "",
        requestOnload = ajaxRequest.onLoad,
        requestUrl = ajaxRequest.url,
        xhr = new XMLHttpRequest();

    try {
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
          var content = JSON.parse(xhr.responseText);
          requestOnload(content, requestRef);
        }
      };

      xhr.open(requestType, requestUrl, true);
      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xhr.send(requestData);
    }
    catch(e) {
      console.log('An ajax request have an error : ', e.message);
      console.log("Request parameters : ", ajaxRequest);
    }
  }
}

/**
   * Load contents configuration
   * @class Loader
   * @param {bitmap object} bitmapLoader
   * @param {elements positions in bitmapLoader} bitmapConfig
   * @param {HTML5 canvas object} canvas
   * @param {function called when the loading is at 100%} onEnd
   */
class Loader {
  constructor(bitmapLoader, bitmapConfig, canvasProperties, onComplete) {
    this.loading = 0;
    this.infoLoad = "";
    this.canvasContext = canvasProperties.context;
    this.displayDx = canvasProperties.dx;
    this.displayDy = canvasProperties.dy;
    this.dx = bitmapConfig.dx;
    this.infoFont = bitmapConfig.infoFont;
    this.pourcentFont = bitmapConfig.pourcentFont;
    this.onComplete = onComplete != undefined ? onComplete : function(){};

    //Bitmap ressource of loader
    this.bitmapLoader = bitmapLoader;

    //Bitmap Configuration
    this.emptyLoader = bitmapConfig.emptyLoader;
    this.completedLoader = bitmapConfig.completedLoader;
    this.pourcentDesign = bitmapConfig.pourcentDesign;

    this.upCanvasDisplay();
  }
  /**
     * Set onComplete method,
     * called when the loader is complete
     * @method setOnCompleteMethod
     */
  setOnCompleteMethod(onComplete) {
    this.onComplete = onComplete;
  }
  /**
     * Add int to pourcent value of loading
     * @method getPourcentCompleted
     * @return {value of pourcent loaded}
     */
  getPourcentCompleted() {
    return this.loading;
  }
  /**
     * Add int to pourcent value of loading
     * @method addPourcentLoaded
     * @param {value of pourcent added} x
     */
  addPourcentLoaded(x) {
    this.loading += x;
    this.upCanvasDisplay();
    if(this.loading >= 100){
      this.onComplete();
    }
  }
  /**
     * Change text information
     * @method upTextInfo
     * @param {text info} info
     */
  upTextInfo(info) {
    this.infoLoad = info;
    this.upCanvasDisplay();
  }
  /**
     * Update canvas display
     * @method getCenteredPosition(Private)
     * @param {size of child element} childDx
     * @param {size of parent element} parentDx
     * @return {centered position of child element}
     */
  getCenteredPosition(childDx, parentDx){
    return (parentDx/2)-(childDx/2);
  }
  /**
     * Update canvas display
     * @method upCanvasDisplay
     */
  upCanvasDisplay() {
    var displayDx = this.displayDx,
    displayDy = this.displayDy,
    totalDx = Math.round((this.dx/100)*displayDx),
    varientDx = Math.round((totalDx-this.emptyLoader.end.dx-this.emptyLoader.start.dx)/this.emptyLoader.varient.dx),
    completedDx = Math.round(varientDx*(this.getPourcentCompleted()/100)),

    start = {
      x : parseInt(this.getCenteredPosition(totalDx, displayDx)),
      y : parseInt(this.getCenteredPosition(this.emptyLoader.start.dy, displayDy))
    },
    varient = {
      x : start.x+this.emptyLoader.start.dx,
      y : start.y
    },
    end = {
      x : varient.x+varientDx,
      y : start.y
    },
    pourcentText = {
      x : varient.x+completedDx-20,
      y : start.y-60
    },
    infoText = {
      x : start.x,
      y : start.y+120
    },
    x=0;

    this.canvasContext.clearRect(0, 0, displayDx, displayDy);

    //Draw empty part
    //Start part
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.emptyLoader.start.x,
      this.emptyLoader.start.y,
      this.emptyLoader.start.dx,
      this.emptyLoader.start.dy,
      start.x,
      start.y,
      this.emptyLoader.start.dx,
      this.emptyLoader.start.dy
    );
    //Varient part
    for(; x < varientDx; x += this.emptyLoader.varient.dx){
      this.canvasContext.drawImage(
        this.bitmapLoader,
        this.emptyLoader.varient.x,
        this.emptyLoader.varient.y,
        this.emptyLoader.varient.dx,
        this.emptyLoader.varient.dy,
        varient.x+x,
        varient.y,
        this.emptyLoader.varient.dx,
        this.emptyLoader.varient.dy
      );
    }
    //End part
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.emptyLoader.end.x,
      this.emptyLoader.end.y,
      this.emptyLoader.end.dx,
      this.emptyLoader.end.dy,
      end.x,
      end.y,
      this.emptyLoader.end.dx,
      this.emptyLoader.end.dy
    );

    //Draw completed part
    //Start part
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.completedLoader.start.x,
      this.completedLoader.start.y,
      this.completedLoader.start.dx,
      this.completedLoader.start.dy,
      start.x,
      start.y,
      this.completedLoader.start.dx,
      this.completedLoader.start.dy
    );
    //Varient part
    for(x = 0; x < completedDx; x += this.emptyLoader.varient.dx){
      this.canvasContext.drawImage(
        this.bitmapLoader,
        this.completedLoader.varient.x,
        this.completedLoader.varient.y,
        this.completedLoader.varient.dx,
        this.completedLoader.varient.dy,
        varient.x+x,
        varient.y,
        this.completedLoader.varient.dx,
        this.completedLoader.varient.dy
      );
    }

    //End part
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.completedLoader.end.x,
      this.completedLoader.end.y,
      this.completedLoader.end.dx,
      this.completedLoader.end.dy,
      varient.x+completedDx,
      end.y,
      this.completedLoader.end.dx,
      this.completedLoader.end.dy
    );

    //Image for pourcent value
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.pourcentDesign.x,
      this.pourcentDesign.y,
      this.pourcentDesign.dx,
      this.pourcentDesign.dy,
      varient.x+completedDx-(this.pourcentDesign.dx/2),
      end.y-50,
      this.pourcentDesign.dx,
      this.pourcentDesign.dy
    );

    //Text part
    this.canvasContext.font = this.pourcentFont.weight+' '+this.pourcentFont.size+'px '+this.pourcentFont.font;
    this.canvasContext.fillStyle = this.pourcentFont.color;
    this.canvasContext.fillText(this.loading+'%', pourcentText.x, pourcentText.y);
    this.canvasContext.font = this.infoFont.size+'px '+this.infoFont.font;
    this.canvasContext.fillStyle = this.infoFont.style;
    this.canvasContext.fillText(
      this.infoLoad,
      this.getCenteredPosition(this.canvasContext.measureText(this.infoLoad).width, displayDx),
      infoText.y
    );
  }
}

/**
   * Load contents configuration
   * @class Game
   * @param {string} configUrl
   * @param {string} gameConfigUrl
   * @param {function} onLoad
   */
class Game {
  constructor(configUrl, gameConfigUrl, onLoad) {
    var self = this;
    this.configUrl = configUrl;
    this.lang = 'fr';
    this.widthGame = 800;
    this.heightGame = 600;
    this.fullscreen = false;
    this.canvasId = "";
    this.loaderConfig = "loader.json";
    this.entitiesFactory = new EntitiesFactory();
    this.idGenerator = new IdGenerator();

    //Content loader
    this.audioLoader = new AudioLoader();
    this.jsonLoader = new JsonLoader();
    this.bitmapLoader = new BitmapLoader();

    //Game Ressources for one Level
    this.bitmaps = [];
    this.audios = [];
    this.audioContext = this.audioLoader.getContext();
    this.entities = [];
    this.entityGroups = [];
    this.texts = [];
    this.controlers = [];
    this.controlers['keyboard'] = [];
    this.controlers['mouse'] = [];
    this.scene = [];

    //Game Ressources configuration for one Level
    this.animations = [];
    this.audioProfils = [];
    this.entityProfils = [];
    this.keyboardProfils = [];
    this.mouseProfiles =  [];
    this.textProfils =  [];
    this.physicProfils =  [];

    //Physic Engine(Interface)
    this.physicInterface = new PhysicInterface(
      function(contact){
        self.collisionStart(contact);
      },
      function(contact) {
        self.collisionEnd(contact);
      }
    );
    this.game = this;

    //Load game config file
    this.jsonLoader.load({
      url : this.configUrl + gameConfigUrl,
      onLoad : function(gameConfig, reference) {
        self.lang = gameConfig.lang != undefined ? gameConfig.lang : self.lang;
        self.widthGame = gameConfig.widthGame != undefined ? gameConfig.widthGame : self.widthGame;
        self.heightGame = gameConfig.heightGame != undefined ? gameConfig.heightGame : self.heightGame;
        self.displayMode = gameConfig.displayMode != undefined ? gameConfig.displayMode : self.displayMode;
        self.bitmapLoader = gameConfig.bitmapLoader != undefined ? gameConfig.bitmapLoader : self.bitmapLoader;
        self.canvasId = gameConfig.canvasId;

        self.camera = new Camera({
          "name": gameConfig.cameraName,
          "scale": 1,
          "canvasId": self.canvasId,
          "displayMode": self.displayMode,
          "dx": self.widthGame,
          "dy": self.heightGame,
        }, "default");

        self.jsonLoader.load({
          url : self.configUrl + gameConfig.loaderConfig,
          onLoad : function(bitmapConfig, reference) {
            self.bitmapLoader.load({
              url : self.configUrl+bitmapConfig.bitmapUrl,
              onLoad : function(bitmap, reference) {
                self.loader = new Loader(
                  bitmap,
                  bitmapConfig,
                  {
                    dx : self.camera.dx,
                    dy : self.camera.dy,
                    context : self.camera.ctx
                  },
                  function(){}
                );
                onLoad();
              }
            });
          }
        });
      }
    });
  }
  /**
     * Load contents configuration
     * @method loadLevel
     * @param {string} name
     * @param {function} onLoad
     */
  loadLevel(name, onLoad) {
    var self = this;
    this.loader.setOnCompleteMethod(onLoad);

    this.jsonLoader.load({
      url : self.configUrl + "/levels/"+name+".json",
      onLoad : function(levelConfig, reference) {
        self.level = levelConfig.levelInfo;
        self.startProperties = {
          startActions : levelConfig.startActions,
          startObjects : levelConfig.entities
        };

        //Load Texts
        self.loadContent(
          self.configUrl + "resources/texts/"+self.lang+"/",
          levelConfig.texts,
          self.jsonLoader,
          function(texts){//When all contents are loaded
            self.texts = texts;
            self.loader.addPourcentLoaded(10);
          },
          function(text){//When One contents is loaded
            self.loader.upTextInfo("Le text "+text.name+" a été chargé.");
          }
        );
        //Load Collisions
        self.loadContent(
          self.configUrl + "resources/physicProfils/",
          levelConfig.physicProfils,
          self.jsonLoader,
          function(physicProfils){//When all contents are loaded
            self.physicProfils = physicProfils;
            self.loader.addPourcentLoaded(10);
          },
          function(physicProfil){//When One contents is loaded
            self.loader.upTextInfo("Les collisions "+physicProfil.name+" ont été chargées.");
          }
        );
        //Load textProfils
        self.loadContent(
          self.configUrl + "resources/textProfils/",
          levelConfig.textProfils,
          self.jsonLoader,
          function(textProfils){//When all contents are loaded
            self.textProfils = textProfils;
            self.loader.addPourcentLoaded(10);
          },
          function(textProfil){//When One contents is loaded
            self.loader.upTextInfo("Le design de text "+textProfil.name+" a été chargé.");
          }
        );
        //Load bitmaps and theirs configurations
        self.loadContent(
          self.configUrl + "resources/bitmaps/",
          levelConfig.bitmaps,
          self.bitmapLoader,
          function(bitmaps){//When all contents are loaded
            self.bitmaps = bitmaps;
            //load Configurations
            self.loadContent(
              self.configUrl + "resources/animations/",
              levelConfig.animations,
              self.jsonLoader,
              function(animations){//When all contents are loaded
                //Load animations group
                self.loadContent(
                  self.configUrl + "resources/animations/",
                  levelConfig.animationsGroups,
                  self.jsonLoader,
                  function(animationsGroups){//When all contents are loaded
                    self.loader.addPourcentLoaded(10);
                  },
                  function(animationsGroup){//When One content is loaded
                    var tab = [],
                    x = 0,
                    length = animationsGroup.length;
                    for(; x < length; x++){
                      tab[x] = self.animations[animationsGroup[x]][0];
                    }
                    self.animations[animationsGroup.name] = tab;
                    self.loader.upTextInfo("Le groupe d'animation "+animationsGroup.name+" a été chargé.");
                  }
                );
                self.loader.addPourcentLoaded(10);
              },
              function(animation){//When One content is loaded
                animation.bitmap = self.bitmaps[animation.bitmap];
                self.animations[animation.name] = [animation];
                self.loader.upTextInfo("L'animation "+animation.name+" a bien été chargé.");
              }
            );
            self.loader.addPourcentLoaded(10);
          },
          function(bitmap){//When One content is loaded
            self.loader.upTextInfo("L'image "+bitmap.name+" a été chargé.");
          }
        );

        //Load audio files and theirs configurations
        self.loadContent(
          self.configUrl + "resources/audios/",
          levelConfig.audios,
          self.audioLoader,
          function(audios) {//When all contents are loaded
            self.audios = audios;
            //load profils
            self.loadContent(
              self.configUrl + "resources/audioProfils/",
              levelConfig.audioProfils,
              self.jsonLoader,
              function(audioProfils) {//When all contents are loaded
                self.audioProfils = audioProfils;
                self.loader.addPourcentLoaded(10);
              },
              function(audioProfil) {//When One content is loaded
                audioProfil.audio = self.audios[audioProfil.audio];
                self.loader.upTextInfo("La configuration du fichier audio "+audioProfil.name+" a été chargé.");
              }
            );
            self.loader.addPourcentLoaded(10);
          },
          function(audio) {//When One content is loaded
            self.loader.upTextInfo("Le fichier audio "+audio.name+" a été chargé.");
          }
        );

        //Load objects of scene
        self.loadContent(
            self.configUrl + "resources/entityProfils/",
            levelConfig.entityProfils,
            self.jsonLoader,
            function(entityProfils) {//When all contents are loaded
              self.entityProfils = entityProfils;
              //Generation des objets
              var length = levelConfig.entities.length,
                  x = 0;
              for(; x < length; x++) {
                self.createSceneObject(self.entityProfils[levelConfig.entities[x].objectConf], levelConfig.entities[x].id);
              }

              self.loader.addPourcentLoaded(10);
              //Configuration of Entity groups -- 0.9
              //x = 0;
              //length = levelConfig.entityGroups.length;

              //var y = 0,
              //    layer;
              //for(; x < length; x++){
              //  var lengthY = levelConfig.entityGroups[x].objectList.length;
              //  layer = [];
              //  for(; y < lengthY; y++){
              //    layer[y] = self.entities[levelConfig.entityGroups[x].objectList[y]];
              //  }
              //  self.entityGroups[levelConfig.entityGroups[x].name] = layer;
              //}

            },
            function(entityProfil) {//When One content is loaded
              self.loader.upTextInfo("La configuration de l'objet "+entityProfil.name+" a été chargé.");
            }
        );

        //Load Command systeme
        if(navigator.userAgent.match(/(android|iphone|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
        } else {
          //Mouse -- 1.0
          //Keyboard
          self.loadContent(
            self.configUrl + "resources/controlerProfils/keyboards/",
            levelConfig.keyboard,
            self.jsonLoader,
            function(players){//When all contents are loaded
              self.loader.addPourcentLoaded(10);
            },
            function(player){//When One content is loaded
              self.controlers['keyboard'][player.config.player] = new Keyboard(
                window,
                function(keyInfo) {//keydown
                  if(typeof player.keys[keyInfo.code] != 'undefined') {
                    var x = 0,
                    length = player.keys[keyInfo.code].down.length;

                    for(; x < length; x++) {
                      self.setAction(player.keys[keyInfo.code].down[x], '', '');
                    }
                  }
                },
                function(keyInfo) {//keyup
                  if(typeof player.keys[keyInfo.code] != 'undefined') {
                    var x = 0,
                    length = player.keys[keyInfo.code].up.length;

                    for(; x < length; x++) {
                      self.setAction(player.keys[keyInfo.code].up[x], '', '');
                    }
                  }
                }
              );
              self.loader.upTextInfo("Les commandes de "+player.name+" a été chargé.");
            }
          );
        }

        //Creation of the graphic scene
        self.scene['graphic'] = new Scene(
          {
            dx: self.level.widthScene,
            dy: self.level.heightScene
          },
          self.level.ratioScene
        );
        //Creation of the physic scene
        self.scene['physic'] = new Scene(
          {
            dx: self.level.widthScene,
            dy: self.level.heightScene
          },
          self.level.ratioScene
        );
      }
    });
  }
  /**
     * Load contents configuration
     * @method loadContent
     * @param {string} url
     * @param {array} list
     * @param {contentLoader} contentLoader
     * @param {function} allContentLoad
         * @param {object[]} contents
         * @param {object} content
     * @param {function} oneContentLoad
     */
  loadContent(url, list, contentLoader, allContentLoad, oneContentLoad) {
    try {
      var contents = [],
          length = list.length,
          x = 0,
          y = 0;
      if(length > 0) {
        for(; x < length; x++) {
          contentLoader.load({
            ref : list[x].name,
            url : url+list[x].content,
            onLoad : function(content, reference) {
              contents[reference] = content;
              oneContentLoad(contents[reference]);
              y++;
              if(y >= length) {
                allContentLoad(contents);
              }
            }
          });
        }
      } else {
        allContentLoad([]);
      }
    }
    catch(e) {
      console.log(e.message);
    }
  }
  /**
     * Start the loaded level
     * @method startLevel
     */
  startLevel() {
    var self = this;

    var myMap = new Map([
      [ "id1", "test1" ],
      [ "id2", "test2" ],
    ]);

    var myObject = {
      "test1": "value",
      "test2": "value",
      "test3": "value",
      "test4": "value",
      "test5": "value",
      "test6": "value",
      "test7": "value",
      "test8": "value",
      "test9": "value",
      "test10": "value",
      "test11": "value",
      "test12": "value",
      "test13": "value",
      "test14": "value",
      "test15": "value",
      "test16": "value",
      "test17": "value",
      "test18": "value",
      "test19": "value",
      "test20": "value"
    };
    var myTab = [];
    for(var y=0; y<10000;y++) {
      myTab[y] = "value";
    }

    var time = new Date();
    for (var prop in myObject) {

    }

    time = new Date();
    var length = myTab.length,
        x=0;
    for(; x<length;x++) {

    }


    this.entities[this.level.cameraId].setDisplayUpdateMethod(function(framerate) {
      var inView = self.scene['graphic'].getEntities({
            x : self.entities[self.level.cameraId].graphicPosition.x,
            y : self.entities[self.level.cameraId].graphicPosition.y,
            dx : self.entities[self.level.cameraId].dx,
            dy : self.entities[self.level.cameraId].dy
          }),
          inPhysic = self.scene['physic'].getEntities({
            x : self.entities[self.level.cameraId].graphicPosition.x,
            y : self.entities[self.level.cameraId].graphicPosition.y,
            dx : self.entities[self.level.cameraId].dx,
            dy : self.entities[self.level.cameraId].dy
          }),
          x=0,
          length = inView.length;
        //console.log(self.scene['physic'])
      //Increase sort of the objects by z propertie
      inView.sort(function(a, b) {
        return (self.entities[a].z > self.entities[b].z) ? 1 : -1;
      });

        //console.log(self.entities['50ib636f-8779-47d5-9fcb-ff98c8583dec'])

      //Update of display------------------------------------
      //Clear display
      self.entities[self.level.cameraId].ctx.clearRect(
        0,
        0,
        self.entities[self.level.cameraId].dx + self.entities[self.level.cameraId].dx,
        self.entities[self.level.cameraId].dy + self.entities[self.level.cameraId].dy
      );

      //Call of entities graphic system
      for(; x < length; x++) {
        self.entities[inView[x]].updateGraphicObject(
          self.entities[self.level.cameraId].ctx,
          {
            dx : self.entities[self.level.cameraId].dx,
            dy : self.entities[self.level.cameraId].dy
          },
          {
            x : self.entities[self.level.cameraId].graphicPosition.x,
            y : self.entities[self.level.cameraId].graphicPosition.y
          }
        );
      }
      x = 0;
      length = inPhysic.length;

      //Call of entities graphic system
      for(; x < length; x++) {
        self.entities[inPhysic[x]].updatePhysicPosition();
      }

      self.physicInterface.updateEngine(framerate, 6, 2);
    });

    //Camera configuration for the level
    this.entities[this.level.cameraId].setGraphicPosition({
      x: this.level.xCam,
      y: this.level.yCam
    });
    this.entities[this.level.cameraId].setDisplaySize({
      dx: this.level.widthCam,
      dy: this.level.heightCam
    });
    this.entities[this.level.cameraId].activeFullwindow();

    var lengthX = this.startProperties.startObjects.length,
    x = 0,
    lengthY = this.startProperties.startActions.length,
    y = 0;
    for(; x < lengthX; x++) {
      this.setObjectOfSceneConfig(
        this.entityProfils[this.startProperties.startObjects[x].objectConf].config,
        this.startProperties.startObjects[x].id
      );
    }

    var obj = this.startProperties.startActions[y];
    for(; y < lengthY; y++) {
      this.setAction(this.startProperties.startActions[y], '', '');
    }

    this.entities[this.level.cameraId].start();
  }
  destroyLevel() {
    //this.controlers['mouse'].killAllEvent();
    this.camera.stop();
  }
  /**
     * Clone json configuration
     * @method clone
     * @param {json object} jsonObject
     */
  clone(jsonObject) {
    if(typeof jsonObject != "undefined") {
      return JSON.parse(JSON.stringify(jsonObject));
    } else {
      console.log("L'objet json à cloner est indéfini.");
    }
  }
  /**
     * Json actions
     * @method setObjectOfSceneConfig
     * @param {action} actionConfiguration
     * @return the result function called by the action
     */
  setAction(actionConfiguration, self, him) {
    var action = this.clone(actionConfiguration);
    //try {
      switch(action.type) {
        case "action" :
          if(action.id != false) {
            switch(action.id) {
              case "self":
                action.id = self;
                break;
              case "him":
                action.id = him;
                break;
            }
            var objectReference = this[action.context][action.id];
          } else {
            var objectReference = this[action.context];
          }
          return objectReference[action.method](this.setAction(action.argument, self, him));
          break;
        case "simple" :
          return action.argument;
          break;
        case "resource" :
          if(action.id != false) {
            switch(action.id) {
              case "self":
                action.id = self;
                break;
              case "him":
                action.id = him;
                break;
            }
            return this[action.context][action.id];
          }  else {
            return this[action.context];
          }
          break;
        case "object" :
          var resource = {},
              x = 0,
              length = action.properties.length;

          for(; x < length; x++) {
            resource[action.properties[x].name] = this.setAction(action.properties[x].content, self, him);
          }

          return resource;
          break;
        case "newObject" :
          if(action.context != false) {
            if(action.id != false) {
              switch(action.id) {
                case "self":
                  action.id = self;
                  break;
                case "him":
                  action.id = him;
                  break;
              }
              var objectReference = this[action.context][action.id];
            } else {
              var objectReference = this[action.context];
            }
            var id = this.createSceneObject(objectReference, "auto");
            this.setObjectOfSceneConfig(objectReference.config, id);
            if(typeof action.config != 'undefined') {
              this.setObjectOfSceneConfig(action.config, id);
            }
          } else {
            var id = this.createSceneObject(action.argument, "auto");
          }

          return this.entities[id];
          break;
      }
    //} catch(e) {
      //console.log("Une action est buguée : ", e.message);
      //console.log("Son context : ", action.context);
      //console.log("Son objet : ", action.id);
      //console.log("Sa methode : ", action.method);
      //console.log("Son Argument : ", action.argument);
    //}
  }
  /**
     * Generate an objectofscene
     * @method setObjectOfSceneConfig
     * @param { pre configuration of the object } config
     * @param id
     */
  setObjectOfSceneConfig(config, id) {
    var length = config.length,
    objectConfig = this.clone(config),
    x = 0;
    for(; x < length; x++) {
      this.setAction(objectConfig[x], id, '');
    }
  }
  /**
     * Generate an objectofscene
     * @method createSceneObject
     * @param { configuration of the object } objectConf
     * @param id
     * @return objectId
     */
  createSceneObject(configuration, id) {
    var objectId = id != "auto" ? id : this.idGenerator.generate(),
        objectConf = this.clone(configuration);

    this.entities[objectId] = this.entitiesFactory.getInstance(
      objectConf.type,
      {
        properties : objectConf,
        id : objectId
      }
    );

    return objectId;
  }
  /**
     * Generate an objectofscene
     * @method collisionStart
     */
  collisionStart(contact) {
    this.collisionEffects(contact.m_fixtureA.m_userData, contact.m_fixtureB.m_userData, 'active');
    this.collisionEffects(contact.m_fixtureB.m_userData, contact.m_fixtureA.m_userData, 'active');
  }
  /**
     * Generate an objectofscene
     * @method collisionEnd
     */
  collisionEnd(contact) {
    this.collisionEffects(contact.m_fixtureA.m_userData, contact.m_fixtureB.m_userData, 'end');
    this.collisionEffects(contact.m_fixtureB.m_userData, contact.m_fixtureA.m_userData, 'end');
  }
  /**
     * Generate an objectofscene
     * @method collisions
     */
  collisions() {
    var collisions = this.physicInterface.getCollision(),
    x=0,
    lengthX = collisions.start.length,
    y=0,
    lengthY = collisions.active.length,
    z=0,
    lengthZ = collisions.end.length;

    for(; x < lengthX; x++){
      this.collisionEffects(collisions.start[x].bodyA, collisions.start[x].bodyB, 'start');
      this.collisionEffects(collisions.start[x].bodyB, collisions.start[x].bodyA, 'start');
    }
    for(; y < lengthY; y++){
      this.collisionEffects(collisions.active[y].bodyA, collisions.active[y].bodyB, 'active');
      this.collisionEffects(collisions.active[y].bodyB, collisions.active[y].bodyA, 'active');
    }
    for(; z < lengthZ; z++){
      this.collisionEffects(collisions.end[z].bodyA, collisions.end[z].bodyB, 'end');
      this.collisionEffects(collisions.end[z].bodyB, collisions.end[z].bodyA, 'end');
    }
  }
  /**
     * Generate an objectofscene
     * @method collisionsEffects
     * @param hitboxA id
     * @param hitboxB id
     * @param type
     */
  collisionEffects(hitboxA, hitboxB, type) {
    var y = 0,
        lengthY = this.physicProfils.length;

    for(; y < length; y++) {
      if(typeof this.physicProfils[y][type][this.entities[hitboxA].name] != 'undefined') {
        if(typeof this.physicProfils[y][type][this.entities[hitboxA].name][this.entities[hitboxB].name] != 'undefined') {
          var actions = this.clone(this.physicProfils[y][type][this.entities[hitboxA].name][this.entities[hitboxB].name]),
          x = 0,
          length = actions.length;

          for(; x < length; x++) {
            this.setAction(actions[x], this.entities[hitboxA].parent.id, this.entities[hitboxB].parent.id);
          }
        }
      }
    }
  }
  //Systeme de pause a revoir entierement une fois le reste du systeme revu
  setPause() {
    var length = this.group.length,
    x=0;
    for(;x<length;x++){

    }
  }
  unsetPause() {
    var length = this.group.length,
    x=0;
    for(;x<length;x++){

    }
  }
}

class Connection {
    constructor(server, game) {
        var self = this;
        this.player2 = {
            pseudo : '',
            obj : ''
        }
        this.socket = io.connect('', {query: 'token='+this.getCookie('auth')});
        this.socket.on('server', function(message) {
            console.log(message);
        });


        this.socket.on('iWantPlayWith', function(pseudo) {
            console.log(pseudo+' play with me.');
            var acs = game.getActionCtx(),
            yun = acs.generatePreObject2('yun');
            self.player2.obj = acs['objectScene'][yun];
            self.player2.pseudo = pseudo;
            self.player = acs['objectScene']['50ib636f-8779-27d1-9fcb-ff98c8553dec'];
            self.socket.on('sendPositionToMe', function(position) {
                self.player2.obj.setPosition({
                    "x" : position.x,
                    "y" : position.y
                });
            });
            document.addEventListener("frameR", function(e) {
              self.sendPosition(self.player.getPosition());
            });

            self.player2.obj.addToScene(acs['scene']['scene']);
        });
    }
    callFriend(pseudo){
        this.socket.emit('iWantPlayWith', {
            "pseudo": pseudo
        });
    }
    sendPosition(position){
        if(this.player2.pseudo != ''){
            this.socket.emit('sendPositionToHim', position);
        }
    }
    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }
}
