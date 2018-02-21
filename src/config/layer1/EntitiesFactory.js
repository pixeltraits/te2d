/**
 * Load Bitmap ressource.
 * @class BitmapLoader
 */
class EntitiesFactory {
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method load
   * @param {string} className - Class name
   * @param {data} data - data
   * @return {object} - object
   */
  static getInstance(className, data) {
    let newObject = null;

    switch (className) {
      case 'GraphicEntity':
        newObject = new GraphicEntity(data.properties, data.id);
        break;
      case 'PhysicEntity':
        newObject = new PhysicEntity(data.properties, data.id);
        break;
      case 'Camera':
        newObject = new Camera(data.properties, data.id);
        break;
      case 'Player2D':
        newObject = new Player2D(data.properties, data.id);
        break;
      default:
        console.log('undefined');
        break;
    }

    return newObject;
  }
}
