/**
 * Load Audio ressource.
 * @class AudioLoader
 */
class AudioLoader {
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
   * @param {ajaxRequest} ajaxRequest
   */
	load(ajaxRequest) {
    var requestType = typeof ajaxRequest.type != "undefined" ? ajaxRequest.type : 'GET',
        requestRef = typeof ajaxRequest.ref != "undefined" ? ajaxRequest.ref : "",
        requestOnload = ajaxRequest.onLoad,
        requestUrl = ajaxRequest.url,
        xhr = new XMLHttpRequest(),
        self = this;

    try {
      xhr.open(requestType, requestUrl, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        self.context.decodeAudioData(xhr.response, function(buffer) {
          requestOnload(buffer, requestRef);
        });
      }
      xhr.send();
    }
    catch(e) {
      console.log('An ajax request(Audio) have an error : ', e.message);
      console.log("Request parameters : ", ajaxRequest);
    }
  }
}
