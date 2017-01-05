/**
 * Display manager
 * @class Camera
 * @param {camera} properties
 * @param {string} id
 */
class Camera extends PhysicEntity {
  constructor(properties, id) {
    super(properties, id);

    /* Camera Properties */
    this.canvas = document.getElementById(properties.canvasId);
    this.ctx = this.canvas.getContext("2d", {
      antialias : true
    });
    this.dx = properties.dx != undefined ? properties.dx : 0;
    this.dy = properties.dy != undefined ? properties.dy : 0;
    this.scale = properties.scale != undefined ? properties.scale : 1;
    this.displayMode = properties.displayMode != undefined ? properties.displayMode : "default";
    this.stopDisplayLoop = false;
    this.onDisplayUpdate = function(){};

    /* Fps system */
    this.fpsDisplay = false;
    this.lastFrameDate = Date.now();
    this.fps = 0;
    this.fpsFont = {
        size : 25,
        font : "Courier New",
        style : "white bold"
    };
    this.fpsPosition = {
        x : 20,
        y : 20
    };

    /* Event called when display is updated */
    this.displayUpdated = new CustomEvent("displayUpdated", {
      bubbles : false,
      cancelable : true,
      detail : {}
    });

    this.updateDisplaySize();
  }
  /**
   * Update the calculated size
   * @method updateDisplaySize
   * @param {size} size - new size of the display
   */
  setDisplaySize(size) {
    this.dx = size.dx;
    this.dy = size.dy;
    this.updateDisplaySize();
  }
  /**
   * Update the calculated size
   * @method updateDisplaySize
   */
  updateDisplaySize() {
    switch(this.displayMode) {
      case "default":
        this.activeDefaultDisplay();
        break;
      case "fullwindow":
        this.activeFullwindow();
        break;
      case "fullscreen":
        this.activeFullscreen();
        break;
      default:
        this.activeDefaultDisplay();
    }
  }
  /**
   * The camera take the full display of the screen
   * @method activeFullscreen
   */
  activeFullscreen() {
    /* For 1.0, by default fullwindow mode is actived */
    this.activeFullwindow();
  }
  /**
   * The camera take the full display of the window browser
   * @method activeFullwindow
   */
  activeFullwindow() {
    var winDx = window.innerWidth,
        winDy = window.innerHeight,
        scale = this.displayScale(this.dx, this.dy, winDx, winDy);

    this.canvas.width = winDx;
    this.canvas.height = winDy;
    this.ctx.scale(scale, scale);
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  }
  /**
   * The camera display without adaptative parameters
   * @method activeDefaultDisplay
   */
  activeDefaultDisplay() {
    this.canvas.width = this.dx * this.scale;
    this.canvas.height = this.dy * this.scale;
    this.ctx.scale(this.scale, this.scale);
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  }
  /**
     * The camera display without adaptative parameters
     * @method activeDefaultDisplay
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
  displayScale(dx1, dy1, dx2, dy2) {
    var scaleX = dx2 / dx1,
        scaleY = dy2 / dy1;

    if(Math.abs(scaleX) < Math.abs(scaleY)) {
      return scaleY;
    } else {
      return scaleX;
    }
  }
  /**
   * Start the display loop
   * @method start
   */
  start() {
    this.displayUpdate(0);
  }
  /**
   * Stop the display loop
   * @method stop
   */
  stop() {
    this.stopDisplayLoop = true;
  }
  /**
   * Update fps and his display
   * @method fpsUpdate
   */
  fpsUpdate() {
    /* Fps calcul */
    var frameDate = Date.now(),
    delta = frameDate - self.lastFrameDate;

    /* Fps update */
    this.fps = 1000 / delta;
    this.lastFrameDate = frameDate;

    /* Fps Display update */
    this.ctx.font = this.fpsFont.size+'px '+this.fpsFont.font;
    this.ctx.fillStyle = this.fpsFont.style;
    this.ctx.fillText(this.fps, this.fpsPosition.x, this.fpsPosition.y);
  }
  /**
   * Show the framerate performance on display
   * @method showFps
   */
  showFps() {
    if(!this.fpsDisplay) {
      this.fpsDisplay = true;
      this.canvas.addEventListener("displayUpdated", this.fpsUpdate, false);
    }
  }
  /**
   * Hide the framerate performance on display
   * @method hideFps
   */
  hideFps() {
    if(this.fpsDisplay) {
      this.fpsDisplay = false;
      this.canvas.removeEventListener("displayUpdated", this.fpsUpdate, false);
    }
  }
  /**
   * Set method called in displayUpdate
   * @method setDisplayUpdateMethod
   */
  setDisplayUpdateMethod(onDisplayUpdate) {
    this.onDisplayUpdate = onDisplayUpdate;
  }
  /**
   * Update the display on browser framerate(~60fps)
   * @method displayUpdate
   */
  displayUpdate(timePast) {
    var startDate = Date.now(),
        self = this;

    this.onDisplayUpdate(timePast);
    this.canvas.dispatchEvent(this.displayUpdated);

    /* Stop command */
    if(this.stopDisplayLoop) {
      this.stopDisplayLoop = false;
      return;
    }

    /* Framerate Loop */
    window.requestAnimationFrame(function() {
      self.displayUpdate((Date.now() - startDate) / 1000);
    });
  }
}
