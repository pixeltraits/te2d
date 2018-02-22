import GeometricMath from '../layer1/GeometricMath.js';

/**
 * Create animations for bitmap
 * @class Bitmap
 */
export default class Bitmap {
  /**
   * Show bitmap on the canvas context
   * @method show
   * @param {animation} animation - Animation to show
   * @param {position} position - Position of bitmap
   * @param {number} angle - Angle of bitmap
   * @param {size} canvasSize - Size of bitmap
   * @param {canvas2dContext} canvasCtx - Canvas context
   * @return {void}
   */
  static show(animation, position, angle, canvasSize, canvasCtx) {
    const center = position;
    const repeat = Bitmap.getRepetitionBitmapToShow(animation, position, canvasSize, center, angle);

    canvasCtx.translate(center.x, center.y);
    canvasCtx.rotate(angle);

    for (let x = 0; x < repeat.x; x++) {
      for (let y = 0; y < repeat.y; y++) {
        if (animation.reverse) {
          canvasCtx.drawImage(
            Bitmap.flipBitmap(animation.bitmap),
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
   * @param {animation} animation - Animation properties
   * @param {position} positionBitmap - Bitmap position
   * @param {size} sizeView - Size of the view
   * @param {position} center - Center of rotation
   * @param {number} angle - Angle of bitmap
   * @return {repeatBitmap} - Number of repeat in the view in X and Y
   */
  static getRepetitionBitmapToShow(animation, positionBitmap, sizeView, center, angle) {
    const polygon = [
      {
        x: positionBitmap.x,
        y: positionBitmap.y
      },
      {
        x: positionBitmap.x + (animation.dx * animation.repeatX),
        y: positionBitmap.y
      },
      {
        x: positionBitmap.x + (animation.dx * animation.repeatX),
        y: positionBitmap.y + (animation.dy * animation.repeatY)
      },
      {
        x: positionBitmap.x,
        y: positionBitmap.y + (animation.dy * animation.repeatY)
      }
    ];
    const polygonBox = GeometricMath.getPolygonBox(GeometricMath.getRotatedPolygon(polygon, angle, center));
    const visibleSize = {
      dx: GeometricMath.getVisibleLength(polygonBox.x1, polygonBox.x2, sizeView.dx),
      dy: GeometricMath.getVisibleLength(polygonBox.y1, polygonBox.y2, sizeView.dy)
    };
    const maxVisibleSize = Math.max(visibleSize.dx, visibleSize.dy);

    return {
      x: Math.min(animation.repeatX, Math.ceil(maxVisibleSize / animation.dx)),
      y: Math.min(animation.repeatY, Math.ceil(maxVisibleSize / animation.dy))
    };
  }

  /**
   * Reverse pixel of bitmap(Horyzontal)
   * @method flipBitmap
   * @param {animation} animation - Animation properties
   * @return {canvas} canvas - Canvas with the revert image
   */
  static flipBitmap(animation) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

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

    const imageData = context.getImageData(0, 0, animation.dx, animation.dy);

    /* Bitmap flipping */
    for (let i = 0; i < imageData.height; i++) {
      for (let j = 0; j < imageData.width / 2; j++) {
        const index = ((i * 4) * imageData.width) + (j * 4);
        const mirrorIndex = (((i + 1) * 4) * imageData.width) - ((j + 1) * 4);

        for (let p = 0; p < 4; p++) {
          const temp = imageData.data[index + p];
          imageData.data[index + p] = imageData.data[mirrorIndex + p];
          imageData.data[mirrorIndex + p] = temp;
        }
      }
    }
    context.putImageData(imageData, 0, 0);

    return canvas;
  }
}
