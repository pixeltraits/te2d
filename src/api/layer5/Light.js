import PhysicEntity from '../layer4/PhysicEntity.js';
import Polygon from '../layer2/Polygon.js';

/**
 * Light
 * @class Light
 */
export default class Light extends PhysicEntity {
  /**
   * Light
   * @method constructor
   * @param {Light} properties - Object Properties
   * @param {string} id - Object ID
   * @return {void}
   */
  constructor(properties, id) {
    super(properties, id);

    this.lightCanvas = document.createElement('canvas');
    this.lightCanvas = document.querySelector('#canvasTest');
    this.lightCanvasContext = this.lightCanvas.getContext('2d');
    this.lightPower = properties.power !== undefined ? properties.power : 1;
    this.lightBlur = properties.blur !== undefined ? properties.blur : 1;
    this.lightType = properties.type !== undefined ? properties.type : 'SPOT';

    this.spotProperties = properties.spotProperties !== undefined ? properties.spotProperties : null;
    this.lightGeometry = new Polygon();
  }
  /**
   * Get light canvas render
   * @method getLightRender
   * @return {canvas}
   */
  getLightRender() {
    this.lightGeometry.setGeometry({
      vertices: [
        {
          x: -50,
          y: -75
        },
        {
          x: 50,
          y: 0
        },
        {
          x: -50,
          y: 0
        }
      ],
      color: `rgba(0, 0, 0, ${this.lightPower})`,
      borderColor: `rgba(0, 0, 0, ${this.lightPower})`,
      borderSize: 0
    });
    //this.lightCanvas.width = this.lightGeometry.size.dx;
    //this.lightCanvas.height = this.lightGeometry.size.dy;
    this.lightGeometry.show(
      {
        x: 0,
        y: 0
      },
      0,
      this.lightGeometry.size,
      this.lightCanvasContext
    );

    return this.lightCanvas;
  }
}
