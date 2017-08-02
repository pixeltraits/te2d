/**
 * Clone object
 * @class Clone
 */
class Clone {
  constructor() {
  }
  /**
   * Clone object with Img object
   * @method cloneComplexObject
   * @param  {object} complexObject
   * @return {object} clone
   */
  cloneComplexObject(complexObject) {
    var clone = {},
        i = 0;

    for(i in complexObject) {
      if (complexObject.hasOwnProperty(i)) {
        if(typeof complexObject[i] != 'object' || complexObject[i] instanceof HTMLImageElement) {
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
   * @param  {object} simpleObject
   * @return {object}
   */
  cloneObject(simpleObject) {
    return JSON.parse(JSON.stringify(simpleObject));
  }
}
