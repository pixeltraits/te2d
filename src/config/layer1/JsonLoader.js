/**
 * Load Json ressource.
 * @class JsonLoader
 */
class JsonLoader {
  constructor() {
  }
  /**
   * Create xhr object and load json ressource with ajax.
   * @method load
   * @param {ajaxRequest} ajaxRequest
   */
  load(ajaxRequest) {
    var requestType = typeof ajaxRequest.type != "undefined" ? ajaxRequest.type : 'GET',
        requestData = typeof ajaxRequest.data != "undefined" ? ajaxRequest.data : null,
        requestRef = typeof ajaxRequest.ref != "undefined" ? ajaxRequest.ref : "",
        requestOnload = ajaxRequest.onLoad,
        requestUrl = ajaxRequest.url,
        xhr = new XMLHttpRequest();

    try {
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
          var content = JSON.parse(xhr.responseText);
          requestOnload(content, requestRef);
        }
      };

      xhr.open(requestType, requestUrl, true);
      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xhr.send(requestData);
    }
    catch(e) {
      console.log('An ajax request have an error : ', e.message);
      console.log("Request parameters : ", ajaxRequest);
    }
  }
}
