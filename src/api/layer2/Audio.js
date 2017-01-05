/**
 * Manage audio
 * @class Audio
 */
class Audio {
  constructor() {
    this.active = false;
    this.pannerNode;
    this.pause = false;
  }
  /**
   * Play audio
   * @method setAudio
   * @param {audioProfil} audioProfil
   * @param {audioContext} audioContext
   */
  setAudio(audioProfil, audioContext) {
    var self = this;

    if(!this.active && !this.pause) {
      this.active = true;

      /* Audio content implementation */
      this.source = audioContext.createBufferSource();
      this.source.buffer = audioProfil.audio;
      this.pannerNode = audioContext.createPanner();
      this.source.connect(this.pannerNode);
      this.pannerNode.connect(audioContext.destination);

      /* Audio spacialisation for 1.0
       * this.pannerNode.setPosition(0, 1, 1);
      */

      /* Repetition number and end play event */
      this.source.loop = audioProfil.loop;
      this.source.onended = function() {
        self.active = false;
      };

      this.source.start();
    }
  }
  /**
   * Stop audio
   * @method unsetAudio
   */
  unsetAudio() {
    if(!this.pause) {
      this.active = false;
      this.source.loop = false;
      this.source.disconnect(this.pannerNode);
    }
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause
   */
  setPause(pause) {
    /** Pause sound for 1.0
      *  this.pause = pause;
      *  if(this.active) {
      *    if(this.pause) {
      *      this.source.stop();
      *    } else {
      *      this.source.start();
      *    }
      *  }
    */
  }
}
