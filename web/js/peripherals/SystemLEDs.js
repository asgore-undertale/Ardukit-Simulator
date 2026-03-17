import { eventBus } from '../core/EventBus.js';

/**
 * SystemLEDs.js
 * 
 * Observer pattern module that visualizes pins 43-46.
 */

export class SystemLEDs {
    constructor() {
        this.pins = [43, 44, 45, 46];
        this.ledElements = {};

        // Cache DOM elements
        this.pins.forEach(pin => {
            this.ledElements[pin] = document.getElementById(`led-${pin}`);
        });

        // Subscribe to digital write events directly
        this.pins.forEach(pin => {
            eventBus.on(`pin:${pin}:write`, (value) => this.updateLED(pin, value));
        });

        // Clear state on reset
        eventBus.on('board:reset', () => {
            this.pins.forEach(pin => this.updateLED(pin, 0));
        });
    }

    updateLED(pin, state) {
        const el = this.ledElements[pin];
        if (!el) return;

        if (state === 1 || state === 'HIGH' || state === true) {
            el.classList.add('on');
        } else {
            el.classList.remove('on');
        }
    }
}
