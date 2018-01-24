/**
 * Manage keyboard event
 * @class Keyboard
 * @param {domElement} domELement
 * @param {keyboardEvent} onKeydown
 * @param {keyboardEvent} onKeyup
 */
class Keyboard {
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
   * @param {keyboardEvent} event
   */
  handleEvent(event) {
    switch(event.type) {
      case 'keydown':
        this.keydown(event);
        break;
      case 'keyup':
        this.keyup(event);
        break;
      case 'blur':
        this.blur();
        break;
    }
  }
  /**
   * Called everytime one key is down
   * @method keydown
   * @private
   * @param {keyboardEvent} event
   */
  keydown(event) {
    var keyInfo = {
      code : event.code,
      key : event.key
    };

    if(!this.isActive(keyInfo)) {
      this.addKey(keyInfo);
      this.onKeydown(keyInfo);
    }
  }
  /**
   * Called everytime one key is up
   * @method keyup
   * @private
   * @param {keyboardEvent} event
   */
  keyup(event) {
    var keyInfo = {
      code : event.code,
      key : event.key
    };

    this.deleteKey(keyInfo);
    this.onKeyup(keyInfo);
  }
  /**
   * Called everytime the domElement is focusout
   * @method blur
   * @private
   */
  blur() {
    var x = 0,
        length = this.activeKey.length;

    for(; x < length; x++) {
      this.onKeyup(this.activeKey[x]);
    }
    this.deleteAllKeys();
  }
  /**
   * Active all events
   * @method addEvents
   */
  addEvents() {
    if(!this.active) {
      this.domELement.addEventListener('keydown', this, false);
      this.domELement.addEventListener('keyup', this, false);
      this.domELement.addEventListener('blur', this, false);
      this.active = true;
    }
  }
  /**
   * Delete all events
   * @method deleteEvents
   */
  deleteEvents() {
    if(!this.active) {
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
   * @param {keyInfo} keyInfo
   */
  addKey(keyInfo) {
    this.activeKey[this.activeKey.length] = keyInfo;
  }
  /**
   * Delete one key
   * @method deleteKey
   * @private
   * @param {keyInfo} keyInfo
   */
  deleteKey(keyInfo) {
    var x = 0,
        length = this.activeKey.length;

    for(; x < length; x++) {
      if(this.activeKey[x].code == keyInfo.code) {
        this.activeKey.splice(x, 1);

        return;
      }
    }
  }
  /**
   * Delete all keys
   * @method deleteAllKeys
   * @private
   */
  deleteAllKeys() {
    this.activeKey = [];
  }
  /**
   * Get the status of key
   * @method isActive
   * @param {keyInfo} keyInfo
   * @return {boolean}
   */
  isActive(keyInfo) {
    var x = 0,
        length = this.activeKey.length;

    for(; x < length; x++) {
      if(this.activeKey[x].code == keyInfo.code) {
        return true;
      }
    }

    return false;
  }
}
