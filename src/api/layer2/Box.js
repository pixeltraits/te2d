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
