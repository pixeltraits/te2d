/**
 * Clone object
 * @class Clone
 */
class Clone {
  /**
   * Clone object with Img object
   * @method cloneComplexObject
   * @param  {object} complexObject, an object like Image
   * @return {object} clone
   */
  cloneComplexObject(complexObject) {
    const clone = {};

    for (let i in complexObject) {
      if (complexObject.hasOwnProperty(i)) {
        if (typeof complexObject[i] != 'object' || complexObject[i] instanceof HTMLImageElement) {
          clone[i] = complexObject[i];
        } else {
          clone[i] = this.cloneObject(complexObject[i]);
        }
      }
    }

    return clone;
  }
  /**
   * Clone simple object
   * @method cloneObject
   * @param  {object} simpleObject, js basic object
   * @return {object} clone of the simpleObject
   */
  static cloneObject(simpleObject) {
    return JSON.parse(JSON.stringify(simpleObject));
  }
}
