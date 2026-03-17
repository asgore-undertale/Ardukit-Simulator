import { eventBus } from '../core/EventBus.js';

/**
 * DCMotor.js
 * Visualizes the DC Motor on Pins 7 and 8.
 */
export class DCMotor {
    constructor() {
        this.element = document.getElementById('motor-spinner');
        this.stateA = 0;
        this.stateB = 0;

        eventBus.on('pin:7:write', (val) => {
            this.stateA = val;
            this.updateAnimation();
        });

        eventBus.on('pin:8:write', (val) => {
            this.stateB = val;
            this.updateAnimation();
        });

        eventBus.on('board:reset', () => {
            this.stateA = 0;
            this.stateB = 0;
            this.updateAnimation();
        });
    }

    updateAnimation() {
        this.element.classList.remove('spinning', 'spinning-fast');
        
        // Simple logic: if pins are different, it spins.
        if (this.stateA !== this.stateB) {
            this.element.classList.add('spinning');
        }
        // Could add direction or speed based on PWM later
    }
}
