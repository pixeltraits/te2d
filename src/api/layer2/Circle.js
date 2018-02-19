/**
 * Manage Circle
 * @class Circle
 */
class Circle extends Geometry {
  /**
   * Manage Circle
   * @method constructor
   * @return {void}
   */
  constructor() {
    super();

    this.type = 'circle';
    this.radius = 0;
  }
  /**
   * Update the size of geometry
   * @method updateSize
   * @return {void}
   */
  updateSize() {
    this.size = GeometricMath.getCircleSize(this.radius);
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {circle} circle - Circle Properties
   * @return {void}
   */
  setGeometry(circle) {
    super.setGeometry(circle);

    this.radius = circle.radius;
    this.updateSize();
  }
  /**
   * Show Geometry on the canvas context
   * @method show
   * @param {position} position - Circle position
   * @param {number} angle - Circle angle
   * @param {size} canvasSize - Canvas size
   * @param {canvas2dContext} canvasCtx - Canvas context
   * @return {void}
   */
  show(position, angle, canvasSize, canvasCtx) {
    super.show(position, angle, canvasSize, canvasCtx);

    const center = {
      x: position.x + this.radius,
      y: position.y + this.radius
    };

    canvasCtx.translate(center.x, center.y);
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
    canvasCtx.translate(-center.x, -center.y);
  }
}
