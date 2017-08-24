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
            centerX = img.x + (img.dx / 2),
            centerY = img.y + (img.dy / 2);

        canvasCtx.translate(centerX, centerY);
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
        canvasCtx.translate(-centerX, -centerY);
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
        i = 0;

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
