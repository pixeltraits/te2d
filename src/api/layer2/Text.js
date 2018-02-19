/**
 * Manage text
 * @class Text
 */
class Text {
  /**
   * Manage text
   * @method Text
   * @return {void}
   */
  constructor() {
    this.dx = 0;
    this.dy = 0;

    /* Text content */
    this.text = 'black';

    /* Text style */
    this.color = '';
    this.font = '';
    this.fontSize = 0;
  }
  /**
   * Update size
   * @method updateSize
   * @private
   * @return {void}
   */
  updateSize() {
    const canvas = document.createElement('canvas');
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.font = `${this.fontSize}px ${this.font}`;

    this.dx = canvasCtx.measureText(this.text).width;
    this.dy = this.fontSize;
  }
  /**
   * Get size
   * @method getSize
   * @return {size} - Text size
   */
  getSize() {
    return {
      dx: this.dx,
      dy: this.dy
    };
  }
  /**
   * Set text
   * @method setText
   * @param {string} text - Text string
   * @param {textProfil} style - Text properties
   * @return {void}
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
   * @param {position} position - Text position
   * @param {number} angle - Text angle
   * @param {size} canvasSize - Canvas size
   * @param {canvas2dContext} canvasCtx - Canvas context
   * @return {void}
   */
  show(position, angle, canvasSize, canvasCtx) {
    const center = {
      x: position.x + (this.dx / 2),
      y: position.y + (this.dy / 2)
    };

    canvasCtx.translate(center.x, center.y);
    canvasCtx.rotate(angle);

    canvasCtx.font = `${this.fontSize}px ${this.font}`;
    canvasCtx.fillStyle = this.color;
    canvasCtx.fillText(this.text, position.x, position.y);

    canvasCtx.translate(-center.x, -center.y);
    canvasCtx.rotate(-angle);
  }
}
