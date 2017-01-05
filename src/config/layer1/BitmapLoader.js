/**
 * Load Bitmap ressource.
 * @class BitmapLoader
 */
class BitmapLoader {
  constructor() {
  }
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method load
   * @param {ajaxRequest} ajaxRequest
   */
  load(ajaxRequest) {
    var requestRef = typeof ajaxRequest.ref != "undefined" ? ajaxRequest.ref : "",
        requestOnload = ajaxRequest.onLoad,
        requestUrl = ajaxRequest.url,
        bitmap = new Image();

    try {
      bitmap.src = requestUrl;
      bitmap.onload = requestOnload(bitmap, requestRef);
    }
    catch(e) {
      console.log('An ajax request(Bitmap) have an error : ', e.message);
      console.log("Request parameters : ", ajaxRequest);
    }
  }
}
