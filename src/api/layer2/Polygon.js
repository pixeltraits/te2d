/**
 * Manage Polygon
 * @class Polygon
 */
class Polygon extends Geometry {
  /**
   * Manage Polygon
   * @method constructor
   * @return {void}
   */
  constructor() {
    super();

    this.type = "Polygon";
    this.vertices = [];
  }
  /**
   * Update the size of geometry
   * @method updateSize
   * @return {void}
   */
  updateSize() {
    this.size = GeometricMath.getPolygonSize(this.vertices);
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {polygon} polygon - Polygon properties
   * @return {void}
   */
  setGeometry(polygon) {
    super.setGeometry(polygon);

    this.vertices = polygon.vertices;
    this.updateSize();
  }
  /**
   * Show Geometry on the canvas context
   * @method show
   * @param {position} position - Polygon properties
   * @param {number} angle - Polygon properties
   * @param {size} canvasSize - Canvas size
   * @param {canvas2dContext} canvasCtx - Canvas context
   * @return {void}
   */
  show(position, angle, canvasSize, canvasCtx) {
    super.show(position, angle, canvasSize, canvasCtx);

    const center = {
      x: position.x + (this.size.dx / 2),
      y: position.y + (this.size.dy / 2)
    };
    const verticesLength = this.vertices.length;

    canvasCtx.translate(center.x, center.y);
    canvasCtx.rotate(angle);

    canvasCtx.beginPath();

    for (let x = 0; x < verticesLength; x++) {
      canvasCtx.moveTo(
        this.vertices[x].x + position.x,
        this.vertices[x].y + position.y
      );
    }

    canvasCtx.lineTo(this.vertices[0].x + position.x, this.vertices[0].y + position.y);
    canvasCtx.closePath();

    canvasCtx.fillStyle = this.color;
    canvasCtx.lineWidth = this.borderSize;
    canvasCtx.strokeStyle = this.borderColor;

    canvasCtx.fill();
    canvasCtx.stroke();

    canvasCtx.rotate(-angle);
    canvasCtx.translate(-center.x, -center.y);
  }
}
