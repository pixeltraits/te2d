/**
 * Load Audio ressource.
 * @class AudioLoader
 */
class AudioLoader {
  /**
   * Load Audio ressource.
   * @method constructor
   * @return {void}
   */
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }
  /**
   * Load Audio ressource.
   * @method getContext
   * @return {audioContext} this.context
   */
  getContext() {
    return this.context;
  }
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method load
   * @param {ajaxRequest} ajaxRequest - ajaxrequest
   * @return {void}
   */
  load(ajaxRequest) {
    const requestType = typeof ajaxRequest.type !== 'undefined' ? ajaxRequest.type : 'GET';
    const requestRef = typeof ajaxRequest.ref !== 'undefined' ? ajaxRequest.ref : '';
    const requestOnload = ajaxRequest.onLoad;
    const requestUrl = ajaxRequest.url;
    const xhr = new XMLHttpRequest();
    const self = this;

    try {
      xhr.open(requestType, requestUrl, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        self.context.decodeAudioData(xhr.response, (buffer) => {
          requestOnload(buffer, requestRef);
        });
      };
      xhr.send();
    } catch (e) {
      console.log('An ajax request(Audio) have an error : ', e.message);
      console.log('Request parameters : ', ajaxRequest);
    }
  }
}
