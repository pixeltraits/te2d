import Uuid from '../../lib/Uuid.js';

/**
 * Generate unique ID
 * @class IdGenerator
 */
export default class IdGenerator {
  /**
   *
   * @method generate
   * @return {string} uuid, Unique Id
   */
  static generate() {
    return Uuid.generate();
  }
}
