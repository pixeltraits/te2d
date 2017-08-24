/**
 * Manage Polygon
 * @class Polygon
 */
class Polygon extends Geometry {
  constructor() {
    super();

    this.type = "Polygon";
    this.geometricMath = new GeometricMath();
    this.vertices = [];
  }
  /**
   * Update the size of geometry
   * @method updateSize
   */
  updateSize() {
    this.size = this.geometricMath.getPolygonSize(this.vertices);
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {polygon} polygon
   */
  setGeometry(polygon) {
    super.setGeometry(polygon);

    this.vertices = polygon.vertices;
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

    var centerX = position.x + (this.size.dx / 2),
        centerY = position.y + (this.size.dy / 2),
        x = 0,
        length = this.vertices.length;

    canvasCtx.translate(centerX, centerY);
    canvasCtx.rotate(angle);

    //Draw Geometry
    canvasCtx.beginPath();

    for (; x < length; x++) {
      canvasCtx.moveTo(
        this.vertices[x].x + position.x,
        this.vertices[x].y + position.y
      );
    }

    canvasCtx.lineTo(this.vertices[0].x + position.x, this.vertices[0].y + position.y);
    canvasCtx.closePath();

    //Style geometry
    canvasCtx.fillStyle = this.color;
    canvasCtx.lineWidth = this.borderSize;
    canvasCtx.strokeStyle = this.borderColor;

    canvasCtx.fill();
    canvasCtx.stroke();

    canvasCtx.rotate(-angle);
    canvasCtx.translate(-centerX, -centerY);
  }
}
