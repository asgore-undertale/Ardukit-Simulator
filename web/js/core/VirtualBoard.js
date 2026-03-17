import { eventBus } from './EventBus.js';

/**
 * VirtualBoard.js
 * 
 * Represents the internal state of the Arduino Mega 2560.
 * Handles pin states, modes, and time. Emits events when state changes.
 * Does NOT know about the DOM or visual peripherals.
 */

export class VirtualBoard {
    constructor() {
        // Mega 2560 has 54 digital pins (0-53) and 16 analog pins (A0-A15, mapped to 54-69)
        this.TOTAL_PINS = 70;
        
        // Pin configurations: INPUT (0), OUTPUT (1), INPUT_PULLUP (2)
        this.modes = new Array(this.TOTAL_PINS).fill('INPUT');
        
        // Pin states: LOW (0), HIGH (1), or PWM values (0-255)
        this.states = new Array(this.TOTAL_PINS).fill(0);
        
        this.startTime = Date.now();
    }

    reset() {
        this.modes.fill('INPUT');
        this.states.fill(0);
        this.startTime = Date.now();
        // Notify UI to clear state
        eventBus.emit('board:reset');
    }

    // --- Arduino API Equivalents --- //

    pinMode(pin, mode) {
        if (pin < 0 || pin >= this.TOTAL_PINS) return;
        this.modes[pin] = mode;
        // Optionally emit mode change if peripherals care
        eventBus.emit(`pin:${pin}:mode`, mode);
    }

    digitalWrite(pin, state) {
        if (pin < 0 || pin >= this.TOTAL_PINS) return;
        
        // Ensure state is 1 or 0
        const value = (state === 'HIGH' || state === 1 || state === true) ? 1 : 0;
        
        if (this.states[pin] !== value) {
            this.states[pin] = value;
            // Notify interested peripherals
            eventBus.emit(`pin:${pin}:write`, value);
        }
    }

    digitalRead(pin) {
        if (pin < 0 || pin >= this.TOTAL_PINS) return 0;
        return this.states[pin];
    }
    
    // For analog input (Sensors, Potentiometers)
    analogRead(pin) {
        if (pin < 0 || pin >= this.TOTAL_PINS) return 0;
        return this.states[pin];
    }

    // For PWM output (LEDs, Motors)
    analogWrite(pin, value) {
        if (pin < 0 || pin >= this.TOTAL_PINS) return;
        
        // Clamp 0-255
        value = Math.max(0, Math.min(255, value));
        
        if (this.states[pin] !== value) {
            this.states[pin] = value;
            eventBus.emit(`pin:${pin}:pwmWrite`, value);
            // Also trigger standard write event as HIGH if > 127 for simple digital listeners
            eventBus.emit(`pin:${pin}:write`, value > 127 ? 1 : 0);
        }
    }

    millis() {
        return Date.now() - this.startTime;
    }

    // Called by peripherals (like buttons) to update hardware state externally
    setHardwareInput(pin, value) {
        if (pin < 0 || pin >= this.TOTAL_PINS) return;
        this.states[pin] = value;
    }

    // Called by UI sliders to set analog values (0-1023)
    setAnalogInput(pin, value) {
        // Analog pins A0-A15 are mapped to 54-69
        if (pin < 0 || pin >= this.TOTAL_PINS) return;
        this.states[pin] = value;
        eventBus.emit(`pin:${pin}:analogChanged`, value);
    }
}
