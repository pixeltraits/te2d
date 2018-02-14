/**
 * Timer system
 * @class Timer
 */
class Timer {
  /**
   * Timer system
   * @method constructor
   * @param {number} delta - Delta time to detect
   * @return {void}
   */
  constructor(delta) {
    this.t1 = 0; // Date of last execution
    this.t2 = 0; // Time waste for one iteration
    this.delta = delta; // Time before new execution
  }
  /**
   * Set timer delta
   * @method setDelta
   * @param {number} delta - Delta time to detect
   * @return {void}
   */
  setDelta(delta) {
    this.delta = delta;
  }
  /**
   * If delta time is past, true
   * @method whatTimeIsIt
   * @return {boolean} - True if my delta is past
   */
  whatTimeIsIt() {
    if (this.t1 === 0) {
      this.t1 = Date.now();
      return true;
    } else if (Date.now() - this.t1 >= this.delta) {
      this.t1 = Date.now();
      return true;
    }
    return false;
  }
  /**
   * If delta time is past, true
   * With late !!! @refactor !!!
   * @method whatTimeIsItWithLate
   * @return {boolean} -
   */
  whatTimeIsItWithLate() {
    const timePast = Date.now() - this.t1;

    if (this.t1 === 0) {
      this.t1 = Date.now();
      return true;
    } else if (timePast + this.t2 >= this.delta) {
      this.t1 += this.delta;
      this.t2 = timePast - this.delta;
      return true;
    }
    return false;
  }
}
