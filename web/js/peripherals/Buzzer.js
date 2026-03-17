import { eventBus } from '../core/EventBus.js';

export class Buzzer {
    constructor() {
        this.pin = 5;
        this.el = document.getElementById('buzzer-main');
        
        // Simple visual representation of sound for now
        eventBus.on(`pin:${this.pin}:write`, (val) => this.toggle(val));
        eventBus.on(`pin:${this.pin}:pwmWrite`, (val) => this.toggle(val > 0 ? 1 : 0));
        
        eventBus.on('board:reset', () => this.toggle(0));
    }

    toggle(state) {
        if (!this.el) return;
        if (state === 1) {
            this.el.classList.add('active');
        } else {
            this.el.classList.remove('active');
        }
    }
}
