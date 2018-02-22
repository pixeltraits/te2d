/**
 * Load contents configuration
 * @class Loader
 */
export default class Loader {
  /**
   * Load contents configuration
   * @method Loader
   * @param {bitmap} bitmapLoader - bitmap of the loader
   * @param {bitmapConfig} bitmapConfig - elements positions in bitmapLoader
   * @param {canvas} canvasProperties - HTML5 canvas object
   * @param {function} onComplete - function called when the loading is at 100%
   * @return {void}
   */
  constructor(bitmapLoader, bitmapConfig, canvasProperties, onComplete) {
    this.loading = 0;
    this.infoLoad = '';
    this.canvasContext = canvasProperties.context;
    this.displayDx = canvasProperties.dx;
    this.displayDy = canvasProperties.dy;
    this.dx = bitmapConfig.dx;
    this.infoFont = bitmapConfig.infoFont;
    this.pourcentFont = bitmapConfig.pourcentFont;
    this.onComplete = onComplete !== 'undefined' ? onComplete : () => {};

    // Bitmap ressource of loader
    this.bitmapLoader = bitmapLoader;

    // Bitmap Configuration
    this.emptyLoader = bitmapConfig.emptyLoader;
    this.completedLoader = bitmapConfig.completedLoader;
    this.pourcentDesign = bitmapConfig.pourcentDesign;

    this.upCanvasDisplay();
  }
  /**
   * Set onComplete method,
   * called when the loader is complete
   * @method setOnCompleteMethod
   * @param {function} onComplete - onComplete
   * @return {void}
   */
  setOnCompleteMethod(onComplete) {
    this.onComplete = onComplete;
  }
  /**
   * Add int to pourcent value of loading
   * @method getPourcentCompleted
   * @return {number} - value of pourcent loaded
   */
  getPourcentCompleted() {
    return this.loading;
  }
  /**
   * Add int to pourcent value of loading
   * @method addPourcentLoaded
   * @param {number} x - number of pourcent added
   * @return {void}
   */
  addPourcentLoaded(x) {
    this.loading += x;
    this.upCanvasDisplay();
    if (this.loading >= 100) {
      this.onComplete();
    }
  }
  /**
   * Change text information
   * @method upTextInfo
   * @param {textInfo} info - text info
   * @return {void}
   */
  upTextInfo(info) {
    this.infoLoad = info;
    this.upCanvasDisplay();
  }
  /**
   * Update canvas display
   * @method getCenteredPosition
   * @param {size} childDx - size of child element
   * @param {size} parentDx - size of parent element
   * @return {position} - centered position
   */
  static getCenteredPosition(childDx, parentDx) {
    return (parentDx / 2) - (childDx / 2);
  }
  /**
   * Update canvas display
   * @method upCanvasDisplay
   * @return {void}
   */
  upCanvasDisplay() {
    const displayDx = this.displayDx;
    const displayDy = this.displayDy;
    const totalDx = Math.round((this.dx / 100) * displayDx);
    const varientDx = Math.round(
      (totalDx - this.emptyLoader.end.dx - this.emptyLoader.start.dx) / this.emptyLoader.varient.dx
    );
    const completedDx = Math.round(varientDx * (this.getPourcentCompleted() / 100));
    const start = {
      x: parseInt(Loader.getCenteredPosition(totalDx, displayDx), 10),
      y: parseInt(Loader.getCenteredPosition(this.emptyLoader.start.dy, displayDy), 10)
    };
    const varient = {
      x: start.x + this.emptyLoader.start.dx,
      y: start.y
    };
    const end = {
      x: varient.x + varientDx,
      y: start.y
    };
    const pourcentText = {
      x: varient.x + (completedDx - 20),
      y: start.y - 60
    };
    const infoText = {
      x: start.x,
      y: start.y + 120
    };

    this.canvasContext.clearRect(0, 0, displayDx, displayDy);

    // Draw empty part
    // Start part
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.emptyLoader.start.x,
      this.emptyLoader.start.y,
      this.emptyLoader.start.dx,
      this.emptyLoader.start.dy,
      start.x,
      start.y,
      this.emptyLoader.start.dx,
      this.emptyLoader.start.dy
    );
    // Varient part
    for (let x = 0; x < varientDx; x += this.emptyLoader.varient.dx) {
      this.canvasContext.drawImage(
        this.bitmapLoader,
        this.emptyLoader.varient.x,
        this.emptyLoader.varient.y,
        this.emptyLoader.varient.dx,
        this.emptyLoader.varient.dy,
        varient.x + x,
        varient.y,
        this.emptyLoader.varient.dx,
        this.emptyLoader.varient.dy
      );
    }
    // End part
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.emptyLoader.end.x,
      this.emptyLoader.end.y,
      this.emptyLoader.end.dx,
      this.emptyLoader.end.dy,
      end.x,
      end.y,
      this.emptyLoader.end.dx,
      this.emptyLoader.end.dy
    );

    // Draw completed part
    // Start part
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.completedLoader.start.x,
      this.completedLoader.start.y,
      this.completedLoader.start.dx,
      this.completedLoader.start.dy,
      start.x,
      start.y,
      this.completedLoader.start.dx,
      this.completedLoader.start.dy
    );
    // Varient part
    for (let x = 0; x < completedDx; x += this.emptyLoader.varient.dx) {
      this.canvasContext.drawImage(
        this.bitmapLoader,
        this.completedLoader.varient.x,
        this.completedLoader.varient.y,
        this.completedLoader.varient.dx,
        this.completedLoader.varient.dy,
        varient.x + x,
        varient.y,
        this.completedLoader.varient.dx,
        this.completedLoader.varient.dy
      );
    }

    // End part
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.completedLoader.end.x,
      this.completedLoader.end.y,
      this.completedLoader.end.dx,
      this.completedLoader.end.dy,
      varient.x + completedDx,
      end.y,
      this.completedLoader.end.dx,
      this.completedLoader.end.dy
    );

    // Image for pourcent value
    this.canvasContext.drawImage(
      this.bitmapLoader,
      this.pourcentDesign.x,
      this.pourcentDesign.y,
      this.pourcentDesign.dx,
      this.pourcentDesign.dy,
      (varient.x + completedDx) - (this.pourcentDesign.dx / 2),
      end.y - 50,
      this.pourcentDesign.dx,
      this.pourcentDesign.dy
    );

    // Text part
    this.canvasContext.font = `${this.pourcentFont.weight} ${this.pourcentFont.size}px ${this.pourcentFont.font}`;
    this.canvasContext.fillStyle = this.pourcentFont.color;
    this.canvasContext.fillText(`${this.loading}%`, pourcentText.x, pourcentText.y);
    this.canvasContext.font = `${this.infoFont.size}px ${this.infoFont.font}`;
    this.canvasContext.fillStyle = this.infoFont.style;
    this.canvasContext.fillText(
      this.infoLoad,
      Loader.getCenteredPosition(this.canvasContext.measureText(this.infoLoad).width, displayDx),
      infoText.y
    );
  }
}
