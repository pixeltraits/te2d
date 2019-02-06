import Logger from '../../api/layer1/Logger.js';

/**
 * LoadUtils
 * @class LoadUtils
 */
export default class LoadUtils {
  static async loadContent(url, list, contentLoader, oneContentLoad) {
    const contents = {};
    const length = list.length;

    for (let x = 0; x < length; x++) {
      contents[list[x].name] = await this[contentLoader.type]({
        url: url + list[x].content,
        context: contentLoader.context
      });
      oneContentLoad(contents[list[x].name]);
    }

    return contents;
  }
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method audioLoader
   * @param {ajaxRequest} ajaxRequest - ajaxrequest
   * @return {void}
   */
  static async audioLoader(ajaxRequest) {
    const requestContext = ajaxRequest.context;
    const requestUrl = ajaxRequest.url;
    const headers = new Headers({
      'Content-type': 'application/octet-stream'
    });
    const requestProperties = {
      method: typeof ajaxRequest.type !== 'undefined' ? ajaxRequest.type : 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'default'
    };
    let response = null;

    try {
      response = await fetch(requestUrl, requestProperties);
    } catch (e) {
      Logger.log('An ajax request(Audio) have an error : ', e.message);
      Logger.log('Request parameters : ', ajaxRequest);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioData = await requestContext.decodeAudioData(arrayBuffer);

    return audioData;
  }
  /**
   * Create Image object and load Bitmap ressource with ajax.
   * @method load
   * @param {ajaxRequest} ajaxRequest - ajaxrequest
   * @return {void}
   */
  static async bitmapLoader(ajaxRequest) {
    const bitmap = new Image();
    const requestUrl = ajaxRequest.url;
    const headers = new Headers({
      'Content-type': 'image/png'
    });
    const requestProperties = {
      method: typeof ajaxRequest.type !== 'undefined' ? ajaxRequest.type : 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'default'
    };
    let response = null;

    try {
      response = await fetch(requestUrl, requestProperties);
    } catch (e) {
      Logger.log('An ajax request(Bitmap) have an error : ', e.message);
      Logger.log('Request parameters : ', ajaxRequest);
      return null;
    }

    const imageBlob = await response.blob();
    bitmap.src = URL.createObjectURL(imageBlob);

    return bitmap;
  }
  /**
   * Create xhr object and load json ressource with ajax.
   * @method jsonLoader
   * @param {ajaxRequest} ajaxRequest - ajaxrequest
   * @return {jsonObject} - Json object
   */
  static async jsonLoader(ajaxRequest) {
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
    let response = null;

    try {
      response = await fetch(requestUrl, requestProperties);
    } catch (e) {
      Logger.log('An ajax request have an error : ', e.message);
      Logger.log('Request parameters : ', ajaxRequest);
    }

    return await response.json();
  }
}
