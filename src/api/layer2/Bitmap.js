/**
 * Create animations for bitmap
 * @class Bitmap
 */
class Bitmap {
  constructor() {
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
    let repeat = {
      x : 1,
      y : 1
    };
    let centerX = parseInt(position.x);
    let centerY = parseInt(position.y);

    if(animation.repeatX > 1 || animation.repeatY > 1) {
      repeat = this.getRepBitmap(animation, position, canvasSize);
    }

    canvasCtx.translate(centerX, centerY);
    canvasCtx.rotate(angle);

    for(let x = 0; x < repeat.x; x++) {
      for(let y = 0; y < repeat.y; y++) {
        let img = this.cutBitmap(
          animation,
          {
            x : position.x + (animation.dx * x),
            y : position.y + (animation.dy * y)
          },
          canvasSize
        );

        if(animation.reverse) {
          img.bitmap = animation.bitmap;
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
            animation.bitmap,
            img.ix,
            img.iy,
            img.dx,
            img.dy,
            img.x,
            img.y,
            img.dx,
            img.dy
          );
        }
      }
    }
    canvasCtx.rotate(-angle);
    canvasCtx.translate(-centerX, -centerY);
  }
  /**
   * Cut the bitmap
   * @method cutBitmap
   * @private
   * @param {position} positionBitmap
   * @param {size} sizeView
   * @return {bitmap} cutedBitmap
   */
  cutBitmap(animation, positionBitmap, sizeView) {
    let x2 = positionBitmap.x + animation.dx;
    let y2 = positionBitmap.y + animation.dy;
    let cutedBitmap = {
      x : positionBitmap.x,
      y : positionBitmap.y,
      dx : animation.dx,
      dy : animation.dy,
      ix : animation.x + (this.frame * animation.dx),
      iy : animation.y
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
  getRepBitmap(animation, positionBitmap, sizeView) {
    let sizeBitmap = {
      dx : animation.dx * animation.repeatX,
      dy : animation.dy * animation.repeatY
    };
    let x2 = positionBitmap.x + sizeBitmap.dx;
    let y2 = positionBitmap.y + sizeBitmap.dy;
    let visibleSize = {
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
      x : Math.ceil(visibleSize.dx / animation.dx),
      y : Math.ceil(visibleSize.dy / animation.dy)
    };
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
      animation.ix,
      animation.iy,
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
