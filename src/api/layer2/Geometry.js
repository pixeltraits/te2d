/**
 * Manage Geometry
 * @class Geometry
 */
class Geometry {
  constructor() {
    this.type = "";
    this.color = "";
    this.borderColor = "";
    this.borderSize = 0;
    this.size = {
      dx : 0,
      dy : 0
    };
  }
  /**
   * Get size
   * @method getSize
   * @return {size}
   */
  getSize() {
    return this.size;
  }
  /**
   * Set geometry
   * @method setGeometry
   * @param {geometry} geometry
   */
  setGeometry(geometry) {
    this.color = geometry.color;
    this.borderColor = geometry.borderColor;
    this.borderSize = geometry.borderSize;
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
  }
}
