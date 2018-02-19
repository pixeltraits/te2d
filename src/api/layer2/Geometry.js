/**
 * Manage Geometry
 * @class Geometry
 */
class Geometry {
  /**
   * Manage Geometry
   * @method constructor
   * @return {void}
   */
  constructor() {
    this.type = '';
    this.color = '';
    this.borderColor = '';
    this.borderSize = 0;
    this.size = {
      dx: 0,
      dy: 0
    };
  }
  /**
   * Get size
   * @method getSize
   * @return {size} - Geometry size
   */
  getSize() {
    return this.size;
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {geometry} geometry - Geometry properties
   * @return {void}
   */
  setGeometry(geometry) {
    this.color = geometry.color;
    this.borderColor = geometry.borderColor;
    this.borderSize = geometry.borderSize;
  }
  /**
   * Show Geometry on the canvas context
   * @method show
   * @param {position} position - Geometry position
   * @param {number} angle - Geometry angle
   * @param {size} canvasSize - Canvas size
   * @param {canvas2dContext} canvasCtx - Canvas context
   * @return {void}
   */
  show(position, angle, canvasSize, canvasCtx) {
  }
}
