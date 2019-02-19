import Logger from '../layer1/Logger.js';

/**
 * Manage keyboard event
 * @class Keyboard
 */
export default class Gamepad {
  /**
   * Get the state of gamepad button
   * @method isPressed
   * @param {Gamepad[]} gamepads - Navigator gamepads object
   * @param {number} player - Gamepad index
   * @param {button} button - Gamepad button
   * @return {boolean}
   */
  static isPressed(gamepads, player, button) {
    let pressed = false;

    if (!gamepads) {
      return pressed;
    }

    const gamepad = gamepads[player];
    const buttons = gamepads[player].buttons;

    if (buttons[button.id].pressed)

    return pressed;
  }
}
