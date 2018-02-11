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
