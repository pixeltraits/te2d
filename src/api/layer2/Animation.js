class Animation {
  constructor() {
    this.animation = 0;//Animation in progress
    this.animations = [];//Animation group in progress
    this.animationCallbacks = [];
    this.timer = new Timer();
    this.pause = false;
    this.frame = 0;//Animation frame in progress
  }
  /**
   * Set the animation
   * @method setAnimation
   * @param {animation[]} animations
   * @param {animationCallback[]} animationCallbacks
   */
  setAnimation(animations, animationCallbacks) {
    if(!this.pause) {
      this.animationCallbacks = animationCallbacks;
      this.animations = animations;
      this.frame = 0;
      this.animation = 0;
    }
  }
  /**
   * Get the animation in process
   * @method getAnimationInProcess
   * @return {animation}
   */
  getAnimationInProcess() {
    return this.animations[this.animation];
  }
  /**
   * Get the size of bitmap with texture repetition
   * @method getSize
   * @return {size}
   */
  getSize() {
    return {
      dx : this.animations[this.animation].dx * this.animations[this.animation].repeatX,
      dy : this.animations[this.animation].dy * this.animations[this.animation].repeatY
    };
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    this.pause = pause;
  }
  /**
   * Update the frame of the animation
   * @method updateAnimationFrame
   */
  updateAnimationFrame() {
    if(this.animations[this.animation].frames > 0 || this.animations.length > 1 || this.animation < this.animations.length - 1) {
      /* The animation is not fix or is an animation group where is not the last animation */
      this.timer.setDelta(this.animations[this.animation].fps);

      if(this.timer.whatTimeIsIt()) {
        /* The time rate is past */

        if(!this.pause) {
          /* The pause is inactive */

          if(this.frame >= this.animations[this.animation].frames) {
            /* The animation is in the last frame */
            this.animationCallbacks[this.animation]();
            this.frame = 0;

            if(this.animations.length > 1 && this.animation < this.animations.length - 1) {
              /* The animation is not the last or unique */
              this.animation++;
            }
          }

          if(this.animations[this.animation].frames > 0) {
            /* The animation have more one frame */
            this.frame++;
          }
        }
      }
    }
  }
}
