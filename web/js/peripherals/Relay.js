import { eventBus } from '../core/EventBus.js';

/**
 * Relay.js
 * Visualizes the Relay on Pin 6.
 */
export class Relay {
    constructor() {
        this.element = document.getElementById('relay-indicator');
        
        eventBus.on('pin:6:write', (val) => {
            if (val === 1) {
                this.element.classList.add('on');
            } else {
                this.element.classList.remove('on');
            }
        });

        eventBus.on('board:reset', () => {
            this.element.classList.remove('on');
        });
    }
}
