import Logger from '../layer1/Logger.js';

/**
 * Manage keyboard event
 * @class Keyboard
 */
export default class Gamepad {
  /**
   * Get the state of gamepad button
   * @method isPressedAndEqual
   * @param {Gamepad[]} gamepads - Navigator gamepads object
   * @param {number} player - Gamepad index
   * @param {Button} button - Gamepad button
   * @return {boolean}
   */
  static isPressedAndEqual(gamepad, buttonConfig) {
    if (!gamepad) {
      return false;
    }

    const gamepadButtonValue = gamepad.buttons[buttonConfig.id].value;

    if (gamepadButtonValue === buttonConfig.valueA) {
      return true;
    }

    return false;
  }
  /**
   * Get the state of gamepad button
   * @method isPressedAndBetween
   * @param {Gamepad[]} gamepads - Navigator gamepads object
   * @param {number} player - Gamepad index
   * @param {Button} button - Gamepad button
   * @return {boolean}
   */
  static isPressedAndBetween(gamepad, buttonConfig) {
    if (!gamepad) {
      return false;
    }

    const gamepadButtonValue = gamepad.buttons[buttonConfig.id].value;

    if (gamepadButtonValue > buttonConfig.valueA && gamepadButtonValue < buttonConfig.valueB) {
      return true;
    }

    return false;
  }
  /**
   * Get the state of gamepad button
   * @method isPressedAndEqual
   * @param {Gamepad[]} gamepads - Navigator gamepads object
   * @param {number} player - Gamepad index
   * @param {Button} button - Gamepad button
   * @return {boolean}
   */
  static isDirectionAndEqual(gamepad, buttonConfig) {
    if (!gamepad) {
      return false;
    }

    const gamepadButtonValue = gamepad.axes[buttonConfig.id];

    if (gamepadButtonValue === buttonConfig.valueA) {
      return true;
    }

    return false;
  }
  /**
   * Get the state of gamepad button
   * @method isPressedAndBetween
   * @param {Gamepad[]} gamepads - Navigator gamepads object
   * @param {number} player - Gamepad index
   * @param {Button} button - Gamepad button
   * @return {boolean}
   */
  static isDirectionAndBetween(gamepad, buttonConfig) {
    if (!gamepad) {
      return false;
    }

    const gamepadButtonValue = gamepad.axes[buttonConfig.id];

    if (gamepadButtonValue > buttonConfig.valueA && gamepadButtonValue < buttonConfig.valueB) {
      return true;
    }

    return false;
  }
}
