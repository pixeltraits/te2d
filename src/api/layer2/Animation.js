/**
 * Class animation
 * @class Animation
 */
class Animation {
  /**
   * Class animation
   * @method constructor
   * @return {void}
   */
  constructor() {
    this.animation = 0;
    this.animations = [];
    this.animationCallbacks = [];
    this.timer = new Timer();
    this.pause = false;
    this.frame = 0;
  }
  /**
   * Set the animation
   * @method setAnimation
   * @param {animation[]} animations - Animations list
   * @param {animationCallback[]} animationCallbacks - Animation callbacks
   * @return {void}
   */
  setAnimation(animations, animationCallbacks) {
    if (!this.pause) {
      this.animationCallbacks = animationCallbacks;
      this.animations = animations;
      this.frame = 0;
      this.animation = 0;
    }
  }
  /**
   * Get the animation in process
   * @method getAnimationInProcess
   * @return {animation} - animation
   */
  getAnimationInProcess() {
    const position = {
      x: 0,
      y: 0
    };

    if (this.animations[this.animation].sens === 'horyzontal') {
      position.x = this.animations[this.animation].x + (this.frame * this.animations[this.animation].dx);
      position.y = this.animations[this.animation].y;
    } else {
      position.x = this.animations[this.animation].x;
      position.y = this.animations[this.animation].y + (this.frame * this.animations[this.animation].dy);
    }

    return {
      bitmap: this.animations[this.animation].bitmap,
      dx: this.animations[this.animation].dx,
      dy: this.animations[this.animation].dy,
      name: this.animations[this.animation].name,
      repeatX: this.animations[this.animation].repeatX,
      repeatY: this.animations[this.animation].repeatY,
      reverse: this.animations[this.animation].reverse,
      x: position.x,
      y: position.y
    };
  }
  /**
   * Get the size of bitmap with texture repetition
   * @method getSize
   * @return {size} - Size with repeat texture
   */
  getSize() {
    return {
      dx: this.animations[this.animation].dx * this.animations[this.animation].repeatX,
      dy: this.animations[this.animation].dy * this.animations[this.animation].repeatY
    };
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause - New pause value
   * @return {void}
   */
  setPause(pause) {
    this.pause = pause;
  }
  /**
   * Update the frame of the animation
   * @method updateAnimationFrame
   * @return {void}
   */
  updateAnimationFrame() {
    if (this.animations[this.animation].frames > 0 || this.animations.length > 1 || this.animation < this.animations.length - 1) {
      /* The animation is not fix or is an animation group where is not the last animation */
      this.timer.setDelta(this.animations[this.animation].fps);

      if (this.timer.whatTimeIsIt()) {
        /* The time rate is past */

        if (!this.pause) {
          /* The pause is inactive */

          if (this.frame >= this.animations[this.animation].frames) {
            /* The animation is in the last frame */
            this.animationCallbacks[this.animation]();
            this.frame = 0;

            if (this.animations.length > 1 && this.animation < this.animations.length - 1) {
              /* The animation is not the last or unique */
              this.animation += 1;
            }
          }

          if (this.animations[this.animation].frames > 0) {
            /* The animation have more one frame */
            this.frame += 1;
          }
        }
      }
    }
  }
}
