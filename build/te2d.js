"use strict";/**
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
      timePast = Date.now()-this.t1;

      if(timePast>=this.delta) {
        this.t1 = Date.now();

        return true;
      } else {
        return false;
      }
    }
  }
  /**
   * If delta time is past, true
   * With late compensation
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
        this.t2 = timePast-this.delta;

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
    this.pannerNode;
    this.pause = false;
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
      this.source.buffer = audioProfil.audio;
      this.pannerNode = audioContext.createPanner();
      this.source.connect(this.pannerNode);
      this.pannerNode.connect(audioContext.destination);

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

/**
 * Create animations for bitmap
 * @class Bitmap
 */
class Bitmap {
  constructor() {
    this.animation = 0;//Animation in progress
    this.animations = [];//Animation group in progress
    this.animationCallbacks = [];
    this.timer = new Timer();
    this.pause = false;
    this.frame = 0;//Animation frame in progress
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
   * Show bitmap on the canvas context
   * @method show
   * @param {position} position
   * @param {number} angle
   * @param {size} canvasSize
   * @param {canvas2dContext} canvasCtx
   */
  show(position, angle, canvasSize, canvasCtx) {
    var repeat = {
          x : 1,
          y : 1
        },
        x = 0;

    this.updateAnimationFrame();

    if(this.animations[this.animation].repeatX > 1 || this.animations[this.animation].repeatY > 1) {
      repeat = this.getRepBitmap(position, canvasSize);
    }

    for(; x < repeat.x; x++) {
      for(var y = 0; y < repeat.y; y++) {
        var img = this.cutBitmap(
              {
                x : position.x + (this.animations[this.animation].dx * x),
                y : position.y + (this.animations[this.animation].dy * y)
              },
              canvasSize
            ),
            absX = img.x + (img.dx / 2),
            absY = img.y + (img.dy / 2);

        canvasCtx.translate(absX, absY);
        canvasCtx.rotate(angle);

        if(this.animations[this.animation].reverse) {
          img.bitmap = this.animations[this.animation].bitmap;
          canvasCtx.drawImage(
            this.flipBitmap(img),
            0,
            0,
            img.dx,
            img.dy,
            -img.dx / 2,
            -img.dy / 2,
            img.dx,
            img.dy
          );
        } else {
          canvasCtx.drawImage(
            this.animations[this.animation].bitmap,
            img.ix,
            img.iy,
            img.dx,
            img.dy,
            -img.dx / 2,
            -img.dy / 2,
            img.dx,
            img.dy
          );
        }

        canvasCtx.rotate(-angle);
        canvasCtx.translate(-absX, -absY);
      }
    }
  }
  /**
   * Cut the bitmap
   * @method cutBitmap
   * @private
   * @param {position} positionBitmap
   * @param {size} sizeView
   * @return {bitmap} cutedBitmap
   */
  cutBitmap(positionBitmap, sizeView) {
    var x2 = positionBitmap.x + this.animations[this.animation].dx,
        y2 = positionBitmap.y + this.animations[this.animation].dy,
        cutedBitmap = {
          x : positionBitmap.x,
          y : positionBitmap.y,
          dx : this.animations[this.animation].dx,
          dy : this.animations[this.animation].dy,
          ix : this.animations[this.animation].x + (this.frame * this.animations[this.animation].dx),
          iy : this.animations[this.animation].y
        };

    if(positionBitmap.x < 0) {
      cutedBitmap.x = 0;
      cutedBitmap.ix -= positionBitmap.x;
      cutedBitmap.dx += positionBitmap.x;
    }
    if(x2 > sizeView.dx) {
      cutedBitmap.dx += sizeView.dx - x2;
    }
    if(positionBitmap.y < 0) {
      cutedBitmap.y = 0;
      cutedBitmap.iy -= positionBitmap.y;
      cutedBitmap.dy += positionBitmap.y;
    }
    if(y2 > sizeView.dy) {
      cutedBitmap.dy += sizeView.dy - y2;
    }

    return cutedBitmap;
  }
  /**
   * Determinate the number of repeat texture to show
   * @method getRepBitmap
   * @private
   * @param {position} positionBitmap
   * @param {size} sizeView
   * @return {repeatBitmap}
   */
  getRepBitmap(positionBitmap, sizeView) {
    var sizeBitmap = this.getSize(),
        x2 = positionBitmap.x + sizeBitmap.dx,
        y2 = positionBitmap.y + sizeBitmap.dy,
        visibleSize = {
          dx : 0,
          dy : 0
        };

    if(positionBitmap.x > 0) {
      if(x2 < sizeView.dx) {
        visibleSize.dx = sizeBitmap.dx;
      } else {
        visibleSize.dx = sizeView.dx - positionBitmap.x;
      }
    } else {
      if(x2 < sizeView.dx) {
        visibleSize.dx = x2;
      } else {
        visibleSize.dx = sizeView.dx;
      }
    }

    if(positionBitmap.y > 0) {
      if(y2 < sizeView.dy) {
        visibleSize.dy = sizeBitmap.dy;
      } else {
        visibleSize.dy = sizeView.dy - positionBitmap.y;
      }
    } else {
      if(y2 < sizeView.dy) {
        visibleSize.dy = y2;
      } else {
        visibleSize.dy = sizeView.dy;
      }
    }

    return {
      x : Math.ceil(visibleSize.dx / this.animations[this.animation].dx),
      y : Math.ceil(visibleSize.dy / this.animations[this.animation].dy)
    };
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
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    this.pause = pause;
  }
  /**
   * Reverse pixel of bitmap(Horyzontal)
   * @method flipBitmap
   * @param {animation} animation
   * @return {canvas} canvas
   */
  flipBitmap(animation) {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = animation.dx;
    canvas.height = animation.dy;

    context.drawImage(
      animation.bitmap,
      animation.ix,
      animation.iy,
      animation.dx,
      animation.dy,
      0,
      0,
      animation.dx,
      animation.dy
    );

    var imageData = context.getImageData(0, 0, animation.dx, animation.dy),
    i=0;

    /* Bitmap flipping */
    for (; i < imageData.height; i++) {
        for (var j = 0; j < imageData.width / 2; j++) {
            var index = (i * 4) * imageData.width + (j * 4),
                mirrorIndex = ((i + 1) * 4) * imageData.width - ((j + 1) * 4),
                p = 0;
            for (; p < 4; p++) {
                var temp = imageData.data[index + p];
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
 * Manage Geometry
 * @class Geometry
 */
class Geometry {
  constructor() {
    this.type = "";
    this.pause = false;
  }
  setPause() {
    this.pause = true;
  }
  setContext(ctx) {
    this.ctx.contexte = ctx;
  }
  setCtxPosition(ctx) {
    this.ctx.x = ctx.x;
    this.ctx.y = ctx.y;
  }
  getSize() {
    return {dx:this.dx,dy:this.dy};
  }
  rectangle(geometry) {
    this.type = "rectangle";
    this.dx = geometry.width;
    this.dy = geometry.height;
    this.color = geometry.color;
    this.borderColor = geometry.borderColor;
    this.borderSize = geometry.borderSize;
  }
  showRectangle() {
    //var canvas = document.createElement('canvas'),
    //context = canvas.getContext('2d'),
      //imgWidth = this.dx+(this.borderSize*2),
      //imgHeight = this.dy+(this.borderSize*2);

      //canvas.width = imgWidth;
      //canvas.height = imgHeight;
    //context.rotate(this.angle);
    //context.fillStyle = this.borderColor;
        //context.fillRect(0, 0, this.dx+(this.borderSize*2), this.dy+(this.borderSize*2));
        //context.fillStyle = this.color;
        //context.fillRect(0+this.borderSize, 0+this.borderSize, this.dx, this.dy);
        this.test(this.ctx.contexte, this.objectAnimate.physic);
    //this.ctx.contexte.drawImage(canvas, this.objectAnimate.x+this.borderSize-this.ctx.x, this.objectAnimate.y+this.borderSize-this.ctx.y);
  }
  test(c, body) {
    var showInternalEdges = true;

      // part polygon
      var k;
      for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {

            var part = body.parts[k];
          if (part.circleRadius) {
              c.beginPath();
              c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
          } else {
              c.beginPath();
              c.moveTo(part.vertices[0].x-this.ctx.x, part.vertices[0].y-this.ctx.y);

              for (var j = 1; j < part.vertices.length; j++) {

                  if (!part.vertices[j - 1].isInternal || showInternalEdges) {

                      c.lineTo(part.vertices[j].x-this.ctx.x, part.vertices[j].y-this.ctx.y);
                  } else {
                    //console.log('test')
                      c.moveTo(part.vertices[j].x-this.ctx.x, part.vertices[j].y-this.ctx.y);
                  }

                  if (part.vertices[j].isInternal && !showInternalEdges) {
                      c.moveTo(part.vertices[(j + 1) % part.vertices.length].x-this.ctx.x, part.vertices[(j + 1) % part.vertices.length].y-this.ctx.y);
                  }
              }

              c.lineTo(part.vertices[0].x-this.ctx.x, part.vertices[0].y-this.ctx.y);
              c.closePath();
          }

          c.fillStyle = this.color;
          c.lineWidth = this.borderSize;
          c.strokeStyle = this.borderColor;
          c.fill();

          c.stroke();
    }
  }
  circle(geometry) {
    this.type = "circle";
    this.rx = geometry.rayon;
    this.color = geometry.color;
    this.borderColor = geometry.borderColor;
    this.borderSize = geometry.borderSize;
  }
  setGeometry(geometry) {
    var self = this;
    if(geometry.type == "rectangle"){
      this.rectangle(geometry);
    }
    if(geometry.type == "circle"){
      this.circle(geometry);
    }
  }
  show(position, angle, canvasSize, canvasCtx) {
    this.showRectangle();
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
      key : event.key,
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
      key : event.key,
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
 * Physique engine implementation for PhysicPhysicsJS
 * @class PhysicPhysicsJS
 */
class PhysicBox2D {
  constructor(collisionStart, collisionEnd) {
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

    this.pixelMetterFactor = 0.2;

    //Create world
    this.physicContext = new this.b2World(
       new this.b2Vec2(0, 100),
       true
    );

    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.BeginContact = collisionStart;
    //listener.BeginContact = collisionEnd;
    this.physicContext.SetContactListener(listener);
  }
  /**
   * Get an object rectangle
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
      bodyDef.type = this.b2Body.b2_staticBod;
    } else {
      bodyDef.type = this.b2Body.b2_dynamicBody;
    }

    //Position
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
   * Get an object box
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
   * @return fixture
   */
  getBox(id, x, y, dx, dy, angle, sensor, restitution, friction, density, bodyRef) {
    var fixDef = new this.b2FixtureDef;

    fixDef.density = friction;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.isSensor = sensor;
    fixDef.userData = id;

    fixDef.shape = new this.b2PolygonShape;
    fixDef.shape.SetAsBox(this.pixelToMetter(dx+x), this.pixelToMetter(dy+y));


    return bodyRef.CreateFixture(fixDef);
  }
  /**
   * Get an object circle
   * @method getCircle
   * @param x
   * @param y
   * @param { radius of the circle } dr
   * @param angle
   * @param { id, for collision system } id
   * @param { boolean, true if the object can move } movement
   * @return circle object
   */
  getCircle(x, y, dr, angle, id, movement, ghost) {
    return Physics.body('circle', {
        x: x, // x-coordinate
        y: y, // y-coordinate
        radius: dr
    });
  }
  /**
   * Translate pixel to metter
   * @method pixelToMetter
   * @param { pixel value } x
   * @return { metter value }
   */
  pixelToMetter(x) {
    return x * this.pixelMetterFactor;
  }
  /**
   * Translate metter to pixel
   * @method metterToPixel
   * @param { metter value } x
   * @return { pixel value }
   */
  metterToPixel(x) {
    return x / this.pixelMetterFactor;
  }
  /**
   * Add the physic object to physic context
   * @method addToPhysicContext
   * @param { array of physic object } physicObjects
   */
  addToPhysicContext(physicObjects) {
    return this.physicContext.CreateBody(physicObjects);
  }
  /**
     * Delete the physic object to physic context
     * @method removeToPhysicContext
     * @param { array of physic object } physicObjects
     */
  deleteToPhysicContext(physicObjects) {
    this.physicContext.DestroyBody(physicObjects);
  }
  /**
     * Set position of an physic object
     * @method setPosition
     * @param physicObject
     * @param x
     * @param y
     */
  setPosition(physicObject, x, y) {
    //var position = new this.b2Vec2(0.02 * x, 0.02 * y);
    //this.removeToPhysicContext(physicObject.reference);

    //this.getRectangle(physicObject.reference);
    //physicObject.reference.SetTransform(position, 1);
  }
  /**
   * Get position of an physic object
   * @method getPosition
   * @param {body} body
   * @return {position} position
   */
  getPosition(body) {
    var position = body.GetPosition();

    return {
      x : this.metterToPixel(position.x),
      y : this.metterToPixel(position.y)
    };
  }
  /**
     * Set angle of an physic object
     * @method setAngle
     * @param physicObject
     * @param angle
     */
  setAngle(physicObject, angle) {
    //physicObject.state.angular.pos.set(angle);
  }
  /**
     * Get angle of an physic object
     * @method getAngle
     * @param physicObject
     * @return angle
     */
  getAngle(physicObject) {
    return physicObject.state.angular.pos;
  }
  /**
     * Set velocity of an physic object
     * @method stopForces
     * @param physicObject
     */
  stopForces(physicObject) {
    var velocity = physicObject.GetLinearVelocity(),
        force = {
          x : -(physicObject.GetMass() * velocity.x) * 4,
          y : 0
        };

    //if(Math.abs(velocity.x) > 0.2) {
      physicObject.ApplyForce(new this.b2Vec2(force.x, force.y), physicObject.GetWorldCenter());
    //} else {
    //  velocity.x = 0;
    //  physicObject.SetLinearVelocity(velocity);
    //}
  }
  /**
     * Set velocity of an physic object
     * @method setVelocity
     * @param physicObject
     * @param vector
     */
  setImpulse(physicObject, vector) {
    var velocity = physicObject.GetLinearVelocity();
    velocity.y = vector.y;
    physicObject.SetLinearVelocity(velocity);
  }
  /**
     * Set velocity of an physic object
     * @method setVelocity
     * @param physicObject
     * @param vector
     */
  setVelocity(physicObject, vector) {
    var velocity = physicObject.GetLinearVelocity(),
        force = {
          x : vector.x,
          y : vector.y
        };

    physicObject.ApplyForce(new this.b2Vec2(force.x, force.y), physicObject.GetWorldCenter());
  }
  /**
     * Get velocity of an physic object
     * @method getVelocity
     * @param physicObject
     * @return vector
     */
  getVelocity(physicObject) {
    return physicObject.GetLinearVelocity();
  }
  /**
     * Get speed of an physic object
     * @method getSpeed
     * @param physicObject
     * @return speed
     */
  getSpeed(physicObject) {
    return 0;
  }
  /**
     * Recalculate the physic context
     * @method updateEngine
     * @param {number} framerate - Time past since the last update
     * @param {number} velocityPrecision - velocity iterations
     * @param {number} positionPrecision - position iterations
     */
  updateEngine(framerate, velocityPrecision, positionPrecision) {
      console.log(framerate)
      this.physicContext.Step(
        framerate,
        velocityPrecision,
        positionPrecision
      );
      this.physicContext.ClearForces();
  }
}

/**
   * Interface of physic API
   * @class PhysicInterface
   */
class PhysicInterface {
  constructor(collisionStart, collisionEnd) {
    this.physic = new PhysicBox2D(collisionStart, collisionEnd);
  }
  /**
   * Get an object body
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
   * Get an object box
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
   * @return fixture
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
     * Get an circle object
     * @method getCircle
     * @param x
     * @param y
     * @param { radius of the circle } dr
     * @param angle
     * @param { id, for collision system } id
     * @param { boolean, true if the object can move } movement
     * @return circle object
     */
  getCircle(x, y, dr, angle, id, movement, ghost) {
    return this.physic.getCircle(
      x,
      y,
      dr,
      angle,
       id,
      movement,
      ghost
    );
  }
  /**
     * Add the physic object to physic context
     * @method addToPhysicContext
     * @param { array of physic object } physicObjects
     */
  addToPhysicContext(physicObjects) {
    this.physic.addToPhysicContext(physicObjects);
  }
  /**
     * Remove the physic object to physic context
     * @method removeToPhysicContext
     * @param { array of physic object } physicObjects
     */
  removeToPhysicContext(physicObjects) {
    this.physic.removeToPhysicContext(physicObjects);
  }
  /**
     * Set position of an physic object
     * @method setPosition
     * @param physicObject
     * @param x
     * @param y
     */
  setPosition(physicObject, x, y) {
    this.physic.setPosition(physicObject, x, y);
  }
  /**
   * Get position of an physic body
   * @method getPosition
   * @param physicBody
   * @return {position} position
   */
  getPosition(physicBody) {
    return this.physic.getPosition(physicBody);
  }
  /**
     * Set angle of an physic object
     * @method setAngle
     * @param physicObject
     * @param angle
     */
  setAngle(physicObject, angle) {
    this.physic.setAngle(physicObject, angle);
  }
  /**
     * Get angle of an physic object
     * @method getAngle
     * @param physicObject
     * @return angle
     */
  getAngle(physicObject) {
    return this.physic.getAngle(physicObject);
  }
  /**
     * Set velocity of an physic object
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
  /**
     * Get collisions of the physic context
     * @method getCollision
     * @return collision object
     */
  getCollision() {
    var pairs = this.physic.getCollision();
    return {
        start : pairs.start,
        active : pairs.active,
        end : pairs.end
    };
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
    this.x;
    this.y;

    /* Calculated Size */
    this.dx = 0;
    this.dy = 0;

    this.angle = 0;

    /* Graphic position(top, left) */
    this.graphicPosition = {
      x : 0,
      y : 0
    };

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

    /* Physic fixture */
    this.collisionGeometries = [];

    /* Object of scene reference */
    this.graphicEntity = null;
  }
  /**
   * Set scene entity reference
   * @method setGraphicEntity
   * @param {graphicEntity} graphicEntity
   */
  setGraphicEntity(graphicEntity) {
    var self = this;

    this.graphicEntity = graphicEntity;
    this.graphicEntity.setUpdateCallback(function() {
      self.update();
    });
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
   * Set the position of the physic object.
   * @method setGraphicPosition
   * @param {position} graphicPosition
   */
  setGraphicPosition(graphicPosition) {
    var physicPostion = this.graphicToPhysicPosition(graphicPosition);

    this.x = physicPostion.x;
    this.y = physicPostion.y;

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
   * Get the physic position of the object.
   * @method getGraphicPosition
   * @private
   * @return {physicPosition} position
   */
  getGraphicPosition() {
    return this.graphicPosition;
  }
  /**
   * Get the physic position of the object.
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
    return {
      x : graphicPosition.x + (this.dx / 2),
      y : graphicPosition.y + (this.dy / 2)
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
      x : physicPosition.x - (this.dx / 2),
      y : physicPosition.y - (this.dy / 2)
    };
  }
  /**
   * Add collision geometry to the gravity point
   * @method addCollisionGeometry
   * @param {collisionGeometry} collisionGeometry
   */
  addCollisionGeometry(collisionGeometry) {
    if(!this.verifyCollisionGeometry(collisionGeometry.id)) {
      this.collisionGeometries[this.collisionGeometries.length] = collisionGeometry;

      if(this.physicBody != null) {
        this.addFixtureToBody(this.collisionGeometries[x]);
        this.updateSize();
      }
    }
  }
  /**
   * Verify if collision geometry already exist
   * @method verifyCollisionGeometry
   * @param {string} id
   * @return {boolean}
   */
  verifyCollisionGeometry(id) {
    var length = this.collisionGeometries.length,
    x=0;

    for(; x < length; x++) {
      if(this.collisionGeometries[x].id == id) {
        return true;
      }
    }
    return false;
  }
  /**
   * Delete collision geometry to the gravity point
   * @method deleteCollisionGeometry
   * @param {string} id
   */
  deleteCollisionGeometry(id) {
    var length = this.collisionGeometries.length,
        x=0;

    for(; x < length; x++) {
      if(this.collisionGeometries[x].id == id) {
        this.collisionGeometries.splice(x, 1);
        return;
      }
    }
  }
  /**
   * Update size
   * @method updateSize
   */
  updateSize() {
    var length = collisionGeometries.length,
        x = 0,
        minX = 0,
        maxX = 0,
        minY = 0,
        maxY = 0,
        x1 = 0,
        x2 = 0,
        y1 = 0,
        y2 = 0;

    for(; x < length; x++) {
      switch(collisionGeometries[x].shape) {
        case "circle" :

          break;
        case "box" :
          x1 = collisionGeometries[x].x;
          x2 = collisionGeometries[x].x + collisionGeometries[x].dx;
          y1 = collisionGeometries[x].y;
          y2 = collisionGeometries[x].y + collisionGeometries[x].dy;

          break;
        case "polygon" :

          break;
      }
      if(x1 < minX) {
        minX = x1;
      }
      if(y1 < minY) {
        minY = y1;
      }
      if(x2 > maxY) {
        maxX = x2;
      }
      if(y2 > maxY) {
        maxY = y2;
      }
    }

    this.dx = maxX - minX;
    this.dy = maxY - minY;
  }
  /**
   * Add collision geometry to the gravity point
   * @method addFixtureToBody
   * @param {collisionGeometry} collisionGeometry
   */
  addFixtureToBody(collisionGeometry) {
    switch(collisionGeometry.shape) {
      case "circle" :

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

        break;
    }
  }
  /**
     * Add the physic object to the physic context
     * @method addToPhysicContext
     */
  addToPhysicContext() {
    if(this.physicBody == null) {
      this.physicBody = this.physicInterface.getBody(
        this.id,
        this.x,
        this.y,
        this.angle,
        this.mass,
        this.angularConstraint,
        this.angularInertia,
        this.dynamic
      );
      var length = this.collisionGeometries.length,
          x = 0;

      for(; x < length; x++) {
        this.addFixtureToBody(this.collisionGeometries[x]);
      }
    }
  }
  /**
     * Delete the physic object to the physic context
     * @method deleteToPhysicContext
     */
  deleteToPhysicContext() {
    if(this.physicBody != null) {

    }
  }
  setAngle(angle) {
    this.angle = angle;
  }
  getAngle() {
    return this.angle;
  }
  setVelocity(vector) {
    this.physicInterface.setVelocity(this.physicBody, {
      x : vector.x,
      y : vector.y
    });
  }
  getVelocity() {
    return this.physicInterface.getVelocity(this.physicBody);
  }
  show() {
  }
  hide() {
  }
  update() {
    if(this.physicBody != null) {
      this.physicPosition = this.physicInterface.getPosition(this.physicBody);
      if(this.name == "playerPhysic"){
        //console.log(this.getVelocity())
      }
      var graphicPosition = this.physicToGraphicPosition(this.physicPosition);

      if(this.graphicEntity != null) {
        var delta = this.getPositionDelta();

        this.graphicEntity.setPosition({
          x : graphicPosition.x + delta.x,
          y : graphicPosition.y + delta.y
        });
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
   * Get objects in the zone defined
   * @method getObjects
   * @param {zone} zone
   * @return {tableObject} objectsInZone
   */
  getObjects(zone) {
    var firstCaseX = Math.floor(zone.x / this.ratio),
        firstCaseY = Math.floor(zone.y / this.ratio),
        lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio),
        lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio),
        objectsInZone = [],
        list = [],
        x = firstCaseX;

    for(; x < lastCaseX; x++) {
      /* Read every cases in x between zone.x and zone.dx */
      for(var y = firstCaseY; y < lastCaseY; y++) {
        /* Read every cases in y between zone.y and zone.dy */
        var length = this.map[x][y].length,
            z=0;

        for(;z < length; z++) {
          /* Read every object in this case */
          if(typeof list[this.map[x][y][z]] == "undefined") {
            /* The object is not set yet */
            objectsInZone[objectsInZone.length] = this.map[x][y][z];
            list[this.map[x][y][z]] = true;
          }
        }
      }
    }

    return objectsInZone;
  }
  /**
   * Update object position
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
   * Add object in map
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
   * Delete object in map
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
 * Scene Entity
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

    /* Sub object properties */
    this.parent = null;
    this.subObjectOfScene = [];

    this.updateCallback = function() {};

    /* Other */
    this.pause = false;
    this.scene = null;
  }
  /**
   * Set the graphic position of the object, subOject
   * @method setPosition
   * @param {position} position
   */
  setPosition(position) {
    /* Update position of subObject */
    if(typeof this.subObjects != "undefined"){
      var x=0,
          length = this.subObjects.length;

      for(; x < length; x++) {
        this.subObjects[x].addPosition({
          x : position.x - this.x,
          y : position.y - this.y
        });
        this.subObjects[x].addZ(position.y - this.y);
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
   * Set the graphic size of the object
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
   * Get the graphic position of the object.
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
   * Get the graphic size of the object.
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
      bitmap[x] = this.cloneComplexObject(animation[x]);
    }

    if(this.graphicType != "bitmap") {
      this.graphicObject = new Bitmap();
      this.graphicType = "bitmap";
    }

    this.graphicObject.setAnimation(bitmap);

    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Set new text
   * @method setText
   * @param {text} text
   */
  setText(text) {
    if(this.graphicType != "text") {
      this.graphicObject = new Text();
      this.graphicType = "text";
    }

    this.graphicObject.setText(text.words, text.style);

    this.setSize(this.graphicObject.getSize());
  }
  /**
   * Set new geometry
   * @method setGeometry
   */
  setGeometry() {
    //if(this.type != "geometry"){
    //  this.skinMachine = new Geometry();
    //}
    //this.type = "geometry";
    //this.skinMachine.setGeometry(skinName);
  }
  /**
   * Set update callback
   * @method setUpdateCallback
   * @param {function} callback
   */
  setUpdateCallback(callback) {
    this.updateCallback = callback;
  }
  /**
   * Update graphic object
   * @method update
   * @param {canvasCtx} canvasCtx
   * @param {size} canvasSize
   * @param {position} cameraPosition
   */
  update(canvasCtx, canvasSize, cameraPosition) {
    this.updateCallback();

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
   * Add the object to the graphic map, Scene
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
      var length = this.subObjectOfScene.length,
          x=0;

      for(; x < length; x++) {
        this.subObjectOfScene[x].addToScene(this.scene);
      }
    }
  }
  /**
   * Delete the object to the graphic map, Scene
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
      var length = this.subObjectOfScene.length,
          x = 0;

      for(; x < length; x++) {
        this.subObjectOfScene[x].deleteToScene();
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
   * Add sub object
   * @method addSubObject
   * @param {graphicEntity} subObject
   */
  addSubObject(subObject) {
    if(subObject.parent == null) {
      subObject.setPosition({
        x: this.x + subObject.x,
        y: this.y + subObject.y
      });

      subObject.parent = this;
      subObject.dz = 0;

      this.subObjectOfScene[this.subObjectOfScene.length] = subObject;
    }
  }
  /**
   * Delete sub object
   * @method deleteSubObject
   * @param {graphicEntity} subObject
   */
  deleteSubObject(subObject) {
    var length = this.subObjectOfScene.length,
        x = 0;

    for(; x < length; x++) {
      if(this.subObjectOfScene[x].id == subObject.id) {
        subObject.parent = null;
        this.subObjectOfScene.splice(x, 1);
        return;
      }
    }
  }
  /**
   * Clone object with Img object
   * @method cloneComplexObject
   * @param  {object} complexObject
   * @return {object} clone
   */
  cloneComplexObject(complexObject) {
    var clone = {},
        i = 0;

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
   * @param  {object} simpleObject
   * @return {object}
   */
  cloneObject(simpleObject) {
    return JSON.parse(JSON.stringify(simpleObject));
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
    this.ctx.mozImageSmoothingEnabled = false;
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
    this.ctx.mozImageSmoothingEnabled = false;
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
  update() {
    super.update();

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
          url : self.configUrl+gameConfig.loaderConfig,
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
      url : this.configUrl+"/levels/"+name+".json",
      onLoad : function(levelConfig, reference) {
        self.level = levelConfig.levelInfo;
        self.startProperties = {
          startActions : levelConfig.startActions,
          startObjects : levelConfig.entities
        };

        //Load Texts
        self.loadContent(
          "resources/texts/"+self.lang+"/",
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
          "resources/physicProfils/",
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
          "resources/textProfils/",
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
          "resources/bitmaps/",
          levelConfig.bitmaps,
          self.bitmapLoader,
          function(bitmaps){//When all contents are loaded
            self.bitmaps = bitmaps;
            //load Configurations
            self.loadContent(
              "resources/animations/",
              levelConfig.animations,
              self.jsonLoader,
              function(animations){//When all contents are loaded
                //Load animations group
                self.loadContent(
                  "resources/animations/",
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
          "resources/audios/",
          levelConfig.audios,
          self.audioLoader,
          function(audios){//When all contents are loaded
            self.audios = audios;
            //load profils
            self.loadContent(
              "resources/audioProfils/",
              levelConfig.audioProfils,
              self.jsonLoader,
              function(audioProfils){//When all contents are loaded
                self.audioProfils = audioProfils;
                self.loader.addPourcentLoaded(10);
              },
              function(audioProfil){//When One content is loaded
                audioProfil.audio = self.audios[audioProfil.audio];
                self.loader.upTextInfo("La configuration du fichier audio "+audioProfil.name+" a été chargé.");
              }
            );
            self.loader.addPourcentLoaded(10);
          },
          function(audio){//When One content is loaded
            self.loader.upTextInfo("Le fichier audio "+audio.name+" a été chargé.");
          }
        );

        //Load objects of scene
        self.loadContent(
            "resources/entityProfils/",
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
            "resources/controlerProfils/keyboards/",
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

        //Creation of the scene
        self.scene = new Scene(
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

    this.entities[this.level.cameraId].setDisplayUpdateMethod(function(framerate) {
      var inView = self.scene.getObjects({
            x : self.entities[self.level.cameraId].graphicPosition.x,
            y : self.entities[self.level.cameraId].graphicPosition.y,
            dx : self.entities[self.level.cameraId].dx,
            dy : self.entities[self.level.cameraId].dy
          }),
          x=0,
          length = inView.length;

      //Increase sort of the objects by z propertie
      inView.sort(function(a, b) {
        return (self.entities[a].z > self.entities[b].z) ? 1 : -1;
      });

      //Update of display------------------------------------
      //Clear display
      self.entities[self.level.cameraId].ctx.clearRect(
        0,
        0,
        self.entities[self.level.cameraId].dx + self.entities[self.level.cameraId].dx,
        self.entities[self.level.cameraId].dy + self.entities[self.level.cameraId].dy
      );

      //Call of objects scene graphic system
      for(; x < length; x++) {
        self.entities[inView[x]].update(
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

      self.physicInterface.updateEngine(framerate, 10, 10);
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
     * @param {action} action
     * @return the result function called by the action
     */
  setAction(action, self, him) {
    //try {
      switch(action.type) {
        case "action":
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
          }  else {
            var objectReference = this[action.context];
          }
          return objectReference[action.method](this.setAction(action.argument, self, him));
          break;
        case "simple":
          return action.argument;
          break;
        case "resource":
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
        case "object":
          var resource = {},
          x = 0,
          length = action.properties.length;

          for(; x < length; x++) {
            resource[action.properties[x].name] = this.setAction(action.properties[x].content, self, him);
          }

          return resource;
          break;
        case "newObject":
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
          }  else {
            var objectReference = this[action.context];
          }
          var id = this.createSceneObject(objectReference, "auto");
          this.setObjectOfSceneConfig(objectReference.config, id);
          if(typeof action.config != 'undefined') {
            this.setObjectOfSceneConfig(action.config, id);
          }
          return this.entities[id];
          break;
      }
    //} catch(e) {
    //  console.log("Une action est buguée : ", e.message);
    //  console.log("Son context : ", action.context);
    //  console.log("Son objet : ", action.id);
    //  console.log("Sa methode : ", action.method);
    //  console.log("Son Argument : ", action.argument);
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
  createSceneObject(objectConf, id) {
    var objectId = id != "auto" ? id : this.idGenerator.generate(),
    objectConf = this.clone(objectConf);

    this.entities[objectId] = this.entitiesFactory.getInstance(
      objectConf.type,
      {
        properties : objectConf,
        id: objectId
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
