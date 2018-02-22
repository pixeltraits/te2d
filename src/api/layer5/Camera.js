import PhysicEntity from '../layer4/PhysicEntity.js';

/**
 * Display manager
 * @class Camera
 */
export default class Camera extends PhysicEntity {
  /**
   * Display manager
   * @method constructor
   * @param {camera} properties - Object Properties
   * @param {string} id - Object ID
   */
  constructor(properties, id) {
    super(properties, id);

    /* Camera Properties */
    this.canvas = document.getElementById(properties.canvasId);
    this.ctx = this.canvas.getContext('2d', {
      antialias: true
    });
    this.size.dx = properties.dx !== undefined ? properties.dx : 0;
    this.size.dy = properties.dy !== undefined ? properties.dy : 0;
    this.scale = properties.scale !== undefined ? properties.scale : 1;
    this.displayMode = properties.displayMode !== undefined ? properties.displayMode : 'default';
    this.stopDisplayLoop = false;
    this.onDisplayUpdate = () => {};

    /* Fps system */
    this.fpsDisplay = false;
    this.lastFrameDate = Date.now();
    this.fps = 0;
    this.fpsFont = {
      size: 25,
      font: 'Courier New',
      style: 'white bold'
    };
    this.fpsPosition = {
      x: 20,
      y: 20
    };

    /* Event called when display is updated */
    this.displayUpdated = new CustomEvent('displayUpdated', {
      bubbles: false,
      cancelable: true,
      detail: {}
    });

    this.updateDisplaySize();
  }
  /**
   * Update the calculated size
   * @method updateDisplaySize
   * @param {size} size - new size of the display
   * @return {void}
   */
  setDisplaySize(size) {
    this.size.dx = size.dx;
    this.size.dy = size.dy;
    this.updateDisplaySize();
  }
  /**
   * Update the calculated size
   * @method updateDisplaySize
   * @return {void}
   */
  updateDisplaySize() {
    switch (this.displayMode) {
      case 'default':
        this.activeDefaultDisplay();
        break;
      case 'fullwindow':
        this.activeFullwindow();
        break;
      case 'fullscreen':
        this.activeFullscreen();
        break;
      default:
        this.activeDefaultDisplay();
    }
  }
  /**
   * The camera take the full display of the screen
   * @method activeFullscreen
   * @return {void}
   */
  activeFullscreen() {
    /* For 1.0, by default fullwindow mode is actived */
    this.activeFullwindow();
  }
  /**
   * The camera take the full display of the window browser
   * @method activeFullwindow
   * @return {void}
   */
  activeFullwindow() {
    const winDx = window.innerWidth;
    const winDy = window.innerHeight;
    const scale = Camera.displayScale(this.size.dx, this.size.dy, winDx, winDy);

    this.canvas.width = winDx;
    this.canvas.height = winDy;
    this.ctx.scale(scale, scale);
    this.ctx.imageSmoothingEnabled = false;
  }
  /**
   * The camera display without adaptative parameters
   * @method activeDefaultDisplay
   * @return {void}
   */
  activeDefaultDisplay() {
    this.canvas.width = this.size.dx * this.scale;
    this.canvas.height = this.size.dy * this.scale;
    this.ctx.scale(this.scale, this.scale);
    this.ctx.imageSmoothingEnabled = false;
  }
  /**
   * The camera display without adaptative parameters
   * @method scale
   * @param {number} x - width of original resolution
   * @return {void}
   */
  scale(x) {
    this.ctx.scale(x, x);
  }
  /**
   * Calculate the scale of canvas to new resolution
   * Without deform the render or get empty space on display
   * @method displayScale
   * @param {number} dx1 - width of original resolution
   * @param {number} dy1 - height of original resolution
   * @param {number} dx2 - width of new resolution
   * @param {number} dy2 - height of new resolution
   * @return {number} scale - the higher scale between width and height of canvas
   */
  static displayScale(dx1, dy1, dx2, dy2) {
    const scaleX = dx2 / dx1;
    const scaleY = dy2 / dy1;

    if (Math.abs(scaleX) < Math.abs(scaleY)) {
      return scaleY;
    }

    return scaleX;
  }
  /**
   * Start the display loop
   * @method start
   * @return {void}
   */
  start() {
    this.displayUpdate(0);
  }
  /**
   * Stop the display loop
   * @method stop
   * @return {void}
   */
  stop() {
    this.stopDisplayLoop = true;
  }
  /**
   * Update fps and his display
   * @method fpsUpdate
   * @return {void}
   */
  fpsUpdate() {
    /* Fps calcul */
    const frameDate = Date.now();
    const delta = frameDate - this.lastFrameDate;

    /* Fps update */
    this.fps = 1000 / delta;
    this.lastFrameDate = frameDate;

    /* Fps Display update */
    this.ctx.font = `${this.fpsFont.size}px ${this.fpsFont.font}`;
    this.ctx.fillStyle = this.fpsFont.style;
    this.ctx.fillText(this.fps, this.fpsPosition.x, this.fpsPosition.y);
  }
  /**
   * Show the framerate performance on display
   * @method showFps
   * @return {void}
   */
  showFps() {
    if (!this.fpsDisplay) {
      this.fpsDisplay = true;
      this.canvas.addEventListener('displayUpdated', this.fpsUpdate, false);
    }
  }
  /**
   * Hide the framerate performance on display
   * @method hideFps
   * @return {void}
   */
  hideFps() {
    if (this.fpsDisplay) {
      this.fpsDisplay = false;
      this.canvas.removeEventListener('displayUpdated', this.fpsUpdate, false);
    }
  }
  /**
   * Set method called in displayUpdate
   * @method setDisplayUpdateMethod
   * @param {function} onDisplayUpdate - function
   * @return {void}
   */
  setDisplayUpdateMethod(onDisplayUpdate) {
    this.onDisplayUpdate = onDisplayUpdate;
  }
  /**
   * Update the display on browser framerate(~60fps)
   * @method displayUpdate
   * @param {number} timePast - time past
   * @return {void}
   */
  displayUpdate(timePast) {
    const startDate = Date.now();
    const self = this;

    this.onDisplayUpdate(timePast);
    this.canvas.dispatchEvent(this.displayUpdated);

    /* Stop command */
    if (this.stopDisplayLoop) {
      this.stopDisplayLoop = false;
      return;
    }

    /* Framerate Loop */
    window.requestAnimationFrame(() => {
      self.displayUpdate((Date.now() - startDate) / 1000);
    });
  }
}
