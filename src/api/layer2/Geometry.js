/**
 * Manage Geometry
 * @class Geometry
 */
class Geometry {
  constructor() {
    this.type = "";
    this.pause = false;
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
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    this.pause = pause;
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
