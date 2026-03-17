import { eventBus } from '../core/EventBus.js';

/**
 * UserButtons.js
 * 
 * Publisher pattern module that handles clicks on DOM buttons 38-41
 * and sends state updates to VirtualBoard via EventBus.
 */

export class UserButtons {
    constructor() {
        this.pins = [38, 39, 40, 41];
        this.btnElements = {};

        this.pins.forEach(pin => {
            const el = document.getElementById(`btn-${pin}`);
            if (el) {
                this.btnElements[pin] = el;
                
                // Mousedown -> HIGH
                el.addEventListener('mousedown', () => this.press(pin, el));
                el.addEventListener('touchstart', (e) => { e.preventDefault(); this.press(pin, el); });
                
                // Mouseup/Mouseleave -> LOW
                el.addEventListener('mouseup', () => this.release(pin, el));
                el.addEventListener('mouseleave', () => this.release(pin, el));
                el.addEventListener('touchend', (e) => { e.preventDefault(); this.release(pin, el); });
            }
        });
    }

    press(pin, el) {
        el.classList.add('pressed');
        // Notify board of external hardware state change
        eventBus.emit('external:pinUpdate', { pin: pin, state: 1 });
    }

    release(pin, el) {
        el.classList.remove('pressed');
        eventBus.emit('external:pinUpdate', { pin: pin, state: 0 });
    }
}
