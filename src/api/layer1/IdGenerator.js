import { uuid } from '../../lib/js-uuid.js';

/**
 * Generate unique ID
 * @class IdGenerator
 */
export default class IdGenerator {
  /**
   * JsFiddle source code
   * http://jsfiddle.net/briguy37/2mvfd/
   * Created and maintained by Piotr and Oskar.
   * This method generate a unique Id
   * @method generate
   * @return {string} uuid, Unique Id
   */
  static generate() {
    return uuid.v4();
  }
}
