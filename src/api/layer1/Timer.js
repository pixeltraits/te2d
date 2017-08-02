/**
 * Timer system
 * @class Timer
 * @param {number} delta
 */
class Timer {
  constructor(delta) {
    this.t1 = 0;//Date of last execution
    this.t2 = 0;//Time waste for one iteration
    this.delta = delta;//Time before new execution
  }
  /**
   * Set timer delta
   * @method setDelta
   * @param {number} delta
   */
  setDelta(delta) {
    this.delta = delta;
  }
  /**
   * If delta time is past, true
   * @method whatTimeIsIt
   * @param {boolean}
   */
  whatTimeIsIt() {
    var timePast;

    if(this.t1 == 0) {
      this.t1 = Date.now();

      return true;
    } else {
      timePast = Date.now() - this.t1;

      if(timePast >= this.delta) {
        this.t1 = Date.now();

        return true;
      } else {
        return false;
      }
    }
  }
  /**
   * If delta time is past, true
   * With late !!! @refactor !!!
   * @method whatTimeIsItWithLate
   * @param {boolean}
   */
  whatTimeIsItWithLate() {
    var timePast;

    if(this.t1 == 0) {
      this.t1 = Date.now();

      return true;
    } else {
      timePast = Date.now() - this.t1;

      if(timePast + this.t2 >= this.delta) {
        this.t1 += this.delta;
        this.t2 = timePast - this.delta;

        return true;
      } else {
        return false;
      }
    }
  }
}
