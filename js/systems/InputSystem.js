// systems/InputSystem.js — keyboard + mouse state container.
// Decoupled from scene. Owns current state and edge-triggered "wasPressed" history.

const TRACKED_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Space', 'ShiftLeft', 'ShiftRight',
  'KeyR', 'KeyQ', 'KeyE', 'KeyF',
  'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6',
  'Escape', 'Tab',
]);

export class InputSystem {
  constructor(target = window) {
    this.target = target;
    this._down = new Set();        // currently held keys
    this._pressed = new Set();      // edge-triggered this frame
    this._released = new Set();     // edge-triggered release this frame
    this._mouseDown = false;
    this._mousePressed = false;     // edge: just pressed
    this._mouseReleased = false;    // edge: just released
    this._mouseNdc = { x: 0, y: 0 };
    this._mouseScreen = { x: 0, y: 0 };

    this._onKeyDown = (e) => {
      if (TRACKED_KEYS.has(e.code)) {
        if (!this._down.has(e.code)) {
          this._pressed.add(e.code);
        }
        this._down.add(e.code);
        // Prevent scroll on Space / arrows when game is focused
        if (e.code === 'Space' || e.code.startsWith('Arrow')) {
          e.preventDefault();
        }
      }
    };

    this._onKeyUp = (e) => {
      if (TRACKED_KEYS.has(e.code)) {
        if (this._down.has(e.code)) {
          this._released.add(e.code);
        }
        this._down.delete(e.code);
      }
    };

    this._onMouseMove = (e) => {
      this._mouseScreen.x = e.clientX;
      this._mouseScreen.y = e.clientY;
      // Convert to NDC [-1, 1]
      this._mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
      this._mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    this._onMouseDown = (e) => {
      if (e.button === 0) {
        if (!this._mouseDown) this._mousePressed = true;
        this._mouseDown = true;
      }
    };

    this._onMouseUp = (e) => {
      if (e.button === 0) {
        if (this._mouseDown) this._mouseReleased = true;
        this._mouseDown = false;
      }
    };

    this._onBlur = () => {
      // Drop all held keys on focus loss (avoid stuck input)
      this._down.clear();
    };

    this.target.addEventListener('keydown', this._onKeyDown);
    this.target.addEventListener('keyup', this._onKeyUp);
    this.target.addEventListener('mousemove', this._onMouseMove);
    this.target.addEventListener('mousedown', this._onMouseDown);
    this.target.addEventListener('mouseup', this._onMouseUp);
    this.target.addEventListener('blur', this._onBlur);
  }

  // === Queries ===

  isDown(code) {
    return this._down.has(code);
  }

  // Edge-triggered: true once when key first pressed, false on subsequent frames
  // until released and pressed again.
  wasPressed(code) {
    return this._pressed.has(code);
  }

  wasReleased(code) {
    return this._released.has(code);
  }

  get mouseDown()    { return this._mouseDown; }
  get mousePressed() { return this._mousePressed; }
  get mouseReleased(){ return this._mouseReleased; }
  get mouseNdc()     { return this._mouseNdc; }
  get mouseScreen()  { return this._mouseScreen; }

  // Aliases for human-friendly input check
  isAnyMovement() {
    return this.isDown('KeyW') || this.isDown('KeyA') ||
           this.isDown('KeyS') || this.isDown('KeyD') ||
           this.isDown('ArrowUp') || this.isDown('ArrowLeft') ||
           this.isDown('ArrowDown') || this.isDown('ArrowRight');
  }

  // Call at END of each frame to clear edge states
  endFrame() {
    this._pressed.clear();
    this._released.clear();
    this._mousePressed = false;
    this._mouseReleased = false;
  }

  destroy() {
    this.target.removeEventListener('keydown', this._onKeyDown);
    this.target.removeEventListener('keyup', this._onKeyUp);
    this.target.removeEventListener('mousemove', this._onMouseMove);
    this.target.removeEventListener('mousedown', this._onMouseDown);
    this.target.removeEventListener('mouseup', this._onMouseUp);
    this.target.removeEventListener('blur', this._onBlur);
  }
}
