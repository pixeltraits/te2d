/**
   * Generate unique ID
   * @class IdGenerator
   */
class IdGenerator {
  constructor() {
  }
  /**
     * JsFiddle source code
     * http://jsfiddle.net/briguy37/2mvfd/
     * Created and maintained by Piotr and Oskar.
     * This method generate a unique Id
     * @method generate
     * @return {string} uuid, Unique Id
    */
  generate() {
    var d = new Date().getTime(),
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });

    return uuid;
  }
}