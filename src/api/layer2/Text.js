/**
 * Manage text
 * @class Text
 */
class Text {
  constructor() {
    this.pause = false;
    this.dx = 0;
    this.dy = 0;

    /* Text content */
    this.text = "";

    /* Text style */
    this.color = "";
    this.font = "";
    this.fontSize = 0;
  }
  /**
   * Update size
   * @method updateSize
   * @private
   */
  updateSize() {
    var canvas = document.createElement('canvas'),
        canvasCtx = canvas.getContext('2d');

    canvasCtx.font = this.fontSize + "px " + this.font;

    this.dx = canvasCtx.measureText(this.text).width;
    this.dy = this.fontSize;
  }
  /**
   * Get size
   * @method getSize
   * @return {size}
   */
  getSize() {
    return {
      dx : this.dx,
      dy : this.dy
    };
  }
  /**
   * Set text
   * @method setText
   * @param {string} text
   * @param {textProfil} style
   */
  setText(text, style) {
    this.text = text;
    this.color = style.color;
    this.font = style.font;
    this.fontSize = style.size;

    this.updateSize();
  }
  /**
   * Show text on the canvas context
   * @method show
   * @param {position} position
   * @param {number} angle
   * @param {size} canvasSize
   * @param {canvas2dContext} canvasCtx
   */
  show(position, angle, canvasSize, canvasCtx) {
    var absX = position.x + (this.dx / 2),
        absY = position.y + (this.dy / 2);

    canvasCtx.translate(absX, absY);
    canvasCtx.rotate(angle);

    canvasCtx.font = this.fontSize + "px " + this.font;
    canvasCtx.fillStyle = this.color;
    canvasCtx.fillText(this.text, position.x, position.y);

    canvasCtx.translate(-absX, -absY);
    canvasCtx.rotate(-angle);
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    this.pause = pause;
  }
}
