import Logger from '../layer1/Logger.js';

/**
 * Manage keyboard event
 * @class Keyboard
 */
export default class Keyboard {
  /**
   * Manage keyboard event
   * @method constructor
   * @param {domElement} domELement - Dom Element
   * @param {keyboardEvent} onKeydown - Closure execute on keydown
   * @param {keyboardEvent} onKeyup - Closure execute on keyup
   * @return {void}
   */
  constructor(domELement, onKeydown, onKeyup) {
    this.domELement = domELement;
    this.onKeydown = onKeydown;
    this.onKeyup = onKeyup;
    this.active = false;
    this.activeKey = [];

    this.addEvents();
  }
  /**
   * Event implementation
   * @method handleEvent
   * @private
   * @param {keyboardEvent} event - event
   * @return {void}
   */
  handleEvent(event) {
    switch (event.type) {
      case 'keydown':
        this.keydown(event);
        break;
      case 'keyup':
        this.keyup(event);
        break;
      case 'blur':
        this.blur();
        break;
      default:
        Logger.log(`This event don't exist`);
        break;
    }
  }
  /**
   * Called everytime one key is down
   * @method keydown
   * @private
   * @param {keyboardEvent} event - Keydown event
   * @return {void}
   */
  keydown(event) {
    const keyInfo = {
      code: event.code,
      key: event.key
    };

    if (!this.isActive(keyInfo)) {
      this.addKey(keyInfo);
      this.onKeydown(keyInfo);
    }
  }
  /**
   * Called everytime one key is up
   * @method keyup
   * @private
   * @param {keyboardEvent} event - Keyup event
   * @return {void}
   */
  keyup(event) {
    const keyInfo = {
      code: event.code,
      key: event.key
    };

    this.deleteKey(keyInfo);
    this.onKeyup(keyInfo);
  }
  /**
   * Called everytime the domElement is focusout
   * @method blur
   * @private
   * @return {void}
   */
  blur() {
    const activeKeyLength = this.activeKey.length;

    for (let x = 0; x < activeKeyLength; x++) {
      this.onKeyup(this.activeKey[x]);
    }
    this.deleteAllKeys();
  }
  /**
   * Active all events
   * @method addEvents
   * @return {void}
   */
  addEvents() {
    if (!this.active) {
      this.domELement.addEventListener('keydown', this, false);
      this.domELement.addEventListener('keyup', this, false);
      this.domELement.addEventListener('blur', this, false);
      this.active = true;
    }
  }
  /**
   * Delete all events
   * @method deleteEvents
   * @return {void}
   */
  deleteEvents() {
    if (!this.active) {
      this.domELement.removeEventListener('keydown', this, false);
      this.domELement.removeEventListener('keyup', this, false);
      this.domELement.removeEventListener('blur', this, false);
      this.active = false;
    }
  }
  /**
   * Add one key
   * @method addKey
   * @private
   * @param {keyInfo} keyInfo - Key info
   * @return {void}
   */
  addKey(keyInfo) {
    this.activeKey[this.activeKey.length] = keyInfo;
  }
  /**
   * Delete one key
   * @method deleteKey
   * @private
   * @param {keyInfo} keyInfo - Key info
   * @return {void}
   */
  deleteKey(keyInfo) {
    const activeKeyLength = this.activeKey.length;

    for (let x = 0; x < activeKeyLength; x++) {
      if (this.activeKey[x].code == keyInfo.code) {
        this.activeKey.splice(x, 1);

        return;
      }
    }
  }
  /**
   * Delete all keys
   * @method deleteAllKeys
   * @private
   * @return {void}
   */
  deleteAllKeys() {
    this.activeKey = [];
  }
  /**
   * Get the status of key
   * @method isActive
   * @param {keyInfo} keyInfo - Key info
   * @return {boolean} - status of key
   */
  isActive(keyInfo) {
    const activeKeyLength = this.activeKey.length;

    for (let x = 0; x < activeKeyLength; x++) {
      if (this.activeKey[x].code == keyInfo.code) {
        return true;
      }
    }

    return false;
  }
}
