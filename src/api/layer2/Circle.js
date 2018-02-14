/**
 * Manage Circle
 * @class Circle
 */
class Circle extends Geometry {
  constructor() {
    super();

    this.type = "circle";
    this.radius = 0;
  }
  /**
   * Update the size of geometry
   * @method updateSize
   */
  updateSize() {
    this.size = GeometricMath.getCircleSize(this.radius);
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
