/**
 * Clone object
 * @class Clone
 */
class Clone {
  /**
   * Clone complex object
   * @method cloneComplexObject
   * @param {object} complexObject - Complex object to clone
   * @return {object} Clone of the complex object
   */
  static cloneComplexObject(complexObject) {
    return Object.assign({}, complexObject);
  }
  /**
   * Clone data object
   * @method cloneDataObject
   * @param {object} dataObject - data object
   * @return {object} clone of the data object
   */
  static cloneDataObject(dataObject) {
    return JSON.parse(JSON.stringify(dataObject));
  }
}
