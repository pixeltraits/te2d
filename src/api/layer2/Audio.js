/**
 * Manage audio
 * @class Audio
 */
export default class Audio {
  /**
   * Manage audio
   * @method constructor
   * @return {void}
   */
  constructor() {
    this.active = false;
    this.pannerNode = null;
    this.pause = false;
    this.source = null;
  }
  /**
   * Play audio
   * @method setAudio
   * @param {audioProfil} audioProfil - audioProfil
   * @param {audioContext} audioContext - audioContext
   * @return {void}
   */
  setAudio(audioProfil, audioContext) {
    const self = this;

    if (!this.active && !this.pause) {
      this.active = true;

      /* Audio content implementation */
      this.source = audioContext.createBufferSource();
      this.pannerNode = audioContext.createPanner();
      this.source.connect(this.pannerNode);
      this.pannerNode.connect(audioContext.destination);

      this.source.buffer = audioProfil.audio;

      /* Audio spacialisation for 1.0
       * this.pannerNode.setPosition(0, 1, 1);
      */

      /* Repetition number and end play event */
      this.source.loop = audioProfil.loop;
      this.source.onended = () => {
        self.active = false;
      };

      this.source.start();
    }
  }
  /**
   * Stop audio
   * @method unsetAudio
   * @return {void}
   */
  unsetAudio() {
    if (!this.pause) {
      this.active = false;
      this.source.loop = false;
      this.source.disconnect(this.pannerNode);
    }
  }
  /**
   * Active/Desactive the pause
   * @method setPause
   * @param {boolean} pause - New pause value
   * @return {void}
   */
  setPause(pause) {
  }
}
