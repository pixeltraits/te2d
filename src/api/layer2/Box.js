/**
 * Manage Box
 * @class Box
 */
class Box extends Geometry {
  /**
   * Manage Box
   * @method constructor
   * @return {void}
   */
  constructor() {
    super();

    this.type = 'box';
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {box} box - box properties
   * @return {void}
   */
  setGeometry(box) {
    super.setGeometry(box);

    this.size.dx = box.dx;
    this.size.dy = box.dy;
  }
  /**
   * Show Geometry on the canvas context
   * @method show
   * @param {position} position - Box position
   * @param {number} angle - Box angle
   * @param {size} canvasSize - Canvas size
   * @param {canvas2dContext} canvasCtx - Canvas context
   * @return {void}
   */
  show(position, angle, canvasSize, canvasCtx) {
    super.show(position, angle, canvasSize, canvasCtx);

    const center = {
      x: position.x,
      y: position.y
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
