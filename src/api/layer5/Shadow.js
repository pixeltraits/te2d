import GraphicEntity from '../layer4/GraphicEntity.js';
import Box from '../layer2/Box.js';
import Bitmap from '../layer2/Bitmap.js';

/**
 * Shadow
 * @class Shadow
 */
export default class Shadow extends GraphicEntity {
  /**
   * Shadow
   * @method constructor
   * @param {Shadow} properties - Object Properties
   * @param {string} id - Object ID
   * @return {void}
   */
  constructor(properties, id) {
    super(properties, id);

    this.shadowCanvas = document.createElement('canvas');
    this.shadowCanvasContext = this.shadowCanvas.getContext('2d');
    this.lightList = [];
    this.shadowColor = properties.shadowColor !== undefined ? properties.shadowColor : 'rgba(0, 0, 0, 0.5)';
    this.shadowSize = properties.shadowSize;
    this.shadowGeometry = new Box();
    this.refreshShadow();
  }
  /**
   * Add light to the shadow render
   * @method constructor
   * @param {Light} light - Object Light
   * @return {void}
   */
  addLight(light) {
    this.lightList.push(light);
  }
  /**
   * Delete light from shadow render
   * @method deleteLight
   * @param {Light} light - Object light
   * @return {void}
   */
  deleteLight(light) {
    const length = this.lightList.length;

    for (let x = 0; x < length; x++) {
      if (this.lightList === light.id) {
        this.lightList.splice(x, 1);
      }
    }
  }
  /**
   * Refresh shadow render
   * @method refreshShadow
   * @return {void}
   */
  refreshShadow() {
    const lengthLights = this.lightList.length;

    this.shadowCanvasContext.clearRect(0, 0, this.shadowSize.dx, this.shadowSize.dy);
    this.shadowCanvas.width = this.shadowSize.dx;
    this.shadowCanvas.height = this.shadowSize.dy;
    this.shadowGeometry.setGeometry({
      dx: this.shadowSize.dx,
      dy: this.shadowSize.dy,
      color: this.shadowColor,
      borderColor: this.shadowColor,
      borderSize: 0
    });
    this.shadowGeometry.show(
      {
        x: 0,
        y: 0
      },
      0,
      {
        dx: this.shadowSize.dx,
        dy: this.shadowSize.dy
      },
      this.shadowCanvasContext
    );

    for (let x = 0; x < lengthLights; x++) {
      const relativePosition = {
        x: this.lightList[x].position.x - this.position.x,
        y: this.lightList[x].position.y - this.position.y
      }
      Bitmap.removePixelsWithBitmap(
        this.shadowCanvasContext,
        this.lightList[x].getLightRender(),
        relativePosition,
        this.lightList[x].angle
      );
    }

    this.setBitmap({
      animations: [{
        name: 'shadow',
        bitmap: this.shadowCanvas,
        reverse: false,
        x: 0,
        y: 0,
        dx: this.shadowSize.dx,
        dy: this.shadowSize.dy,
        repeatX: 1,
        repeatY: 1,
        frames: 0,
        fps: 33,
        sens: 'horyzontal'
      }],
      animationCallbacks: []
    });
  }
  /**
   * Update graphic object
   * @method updateGraphicObject
   * @param {canvasCtx} canvasCtx - Canvas context
   * @param {size} canvasSize - Canvas size
   * @param {position} cameraPosition - Camera position
   * @return {void}
   */
  updateGraphicObject(canvasCtx, canvasSize, cameraPosition) {
    this.refreshShadow();
    super.updateGraphicObject(canvasCtx, canvasSize, cameraPosition);
  }


}
