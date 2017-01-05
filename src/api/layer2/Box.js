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

    var centerX = position.x + (this.size.dx / 2),
        centerY = position.y + (this.size.dy / 2);

    canvasCtx.translate(centerX, centerY);
    canvasCtx.rotate(angle);

    canvasCtx.fillStyle = this.borderColor;
    canvasCtx.fillRect(
      position.x,
      position.y,
      this.dx + (this.borderSize * 2),
      this.dy + (this.borderSize * 2)
    );
    canvasCtx.fillStyle = this.color;
    canvasCtx.fillRect(
      position.x + this.borderSize,
      position.y + this.borderSize,
      this.dx,
      this.dy
    );

    canvasCtx.rotate(-angle);
    canvasCtx.translate(-centerX, -centerY);
  }
}
