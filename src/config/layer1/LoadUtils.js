import Logger from '../../api/layer1/Logger.js';

/**
 * LoadUtils
 * @class LoadUtils
 */
export default class LoadUtils {
  /**
   * Load contents configuration
   * @method loadContent
   * @param {string} url - url
   * @param {array} list - list
   * @param {contentLoader} contentLoader - content loader
   * @param {function} allContentLoad - all content load
   * @param {function} oneContentLoad - one content load
   * @return {void}
   */
  static loadContent(url, list, contentLoader, allContentLoad, oneContentLoad) {
    try {
      const contents = [];
      const length = list.length;
      let y = 0;

      if (length > 0) {
        for (let x = 0; x < length; x++) {
          this[contentLoader.type]({
            ref: list[x].name,
            url: url + list[x].content,
            onLoad: (content, reference) => {
              contents[reference] = content;
              oneContentLoad(contents[reference]);
              y++;
              if (y >= length) {
                allContentLoad(contents);
              }
            },
            context: contentLoader.context
          });
        }
      } else {
        allContentLoad([]);
      }
    } catch (e) {
      Logger.log(e.message);
    }
  }
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method audioLoader
   * @param {ajaxRequest} ajaxRequest - ajaxrequest
   * @return {void}
   */
  static audioLoader(ajaxRequest) {
    const requestType = typeof ajaxRequest.type !== 'undefined' ? ajaxRequest.type : 'GET';
    const requestRef = typeof ajaxRequest.ref !== 'undefined' ? ajaxRequest.ref : '';
    const requestOnload = ajaxRequest.onLoad;
    const requestUrl = ajaxRequest.url;
    const xhr = new XMLHttpRequest();

    try {
      xhr.open(requestType, requestUrl, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        ajaxRequest.context.decodeAudioData(xhr.response, (buffer) => {
          requestOnload(buffer, requestRef);
        });
      };
      xhr.send();
    } catch (e) {
      Logger.log('An ajax request(Audio) have an error : ', e.message);
      Logger.log('Request parameters : ', ajaxRequest);
    }
  }
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method load
   * @param {ajaxRequest} ajaxRequest - ajaxrequest
   * @return {void}
   */
  static bitmapLoader(ajaxRequest) {
    const requestRef = typeof ajaxRequest.ref !== 'undefined' ? ajaxRequest.ref : '';
    const requestOnload = ajaxRequest.onLoad;
    const requestUrl = ajaxRequest.url;
    const bitmap = new Image();

    try {
      bitmap.src = requestUrl;
      bitmap.onload = requestOnload(bitmap, requestRef);
    } catch (e) {
      Logger.log('An ajax request(Bitmap) have an error : ', e.message);
      Logger.log('Request parameters : ', ajaxRequest);
    }
  }
  /**
   * Create xhr object and load json ressource with ajax.
   * @method jsonLoader
   * @param {ajaxRequest} ajaxRequest - ajaxrequest
   * @return {jsonObject} - Json object
   */
  static async jsonLoader(ajaxRequest) {
    try {
      const requestUrl = ajaxRequest.url;
      const headers = new Headers({
        'Content-type': 'application/json'
      });
      const requestProperties = {
        method: typeof ajaxRequest.type !== 'undefined' ? ajaxRequest.type : 'GET',
        headers: headers,
        mode: 'cors',
        body: typeof ajaxRequest.data !== 'undefined' ? ajaxRequest.data : null,
        cache: 'default'
      };

      let jsonData = await fetch(requestUrl, requestProperties);
      return JSON.parse(jsonData);
    } catch (e) {
      Logger.log('An ajax request have an error : ', e.message);
      Logger.log('Request parameters : ', ajaxRequest);
    }
  }
}
