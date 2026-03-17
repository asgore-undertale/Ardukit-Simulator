import { eventBus } from '../core/EventBus.js';

/**
 * RGBLED.js (Pins 2:Blue, 3:Red, 4:Green)
 * Listens for PWM output and digitally mixed output
 */

export class RGBLED {
    constructor() {
        this.el = document.getElementById('rgb-main');
        this.colors = { r: 0, g: 0, b: 0 }; // 0-255
        
        // Pin layout from knowledge base
        const pR = 3;
        const pG = 4;
        const pB = 2;

        eventBus.on(`pin:${pR}:pwmWrite`, (val) => { this.colors.r = val; this.updateColor(); });
        eventBus.on(`pin:${pG}:pwmWrite`, (val) => { this.colors.g = val; this.updateColor(); });
        eventBus.on(`pin:${pB}:pwmWrite`, (val) => { this.colors.b = val; this.updateColor(); });

        // Fallbacks for digitalWrite
        eventBus.on(`pin:${pR}:write`, (val) => { this.colors.r = val ? 255 : 0; this.updateColor(); });
        eventBus.on(`pin:${pG}:write`, (val) => { this.colors.g = val ? 255 : 0; this.updateColor(); });
        eventBus.on(`pin:${pB}:write`, (val) => { this.colors.b = val ? 255 : 0; this.updateColor(); });
        
        eventBus.on('board:reset', () => {
            this.colors = { r: 0, g: 0, b: 0 };
            this.updateColor();
        });
    }

    updateColor() {
        if (!this.el) return;
        const { r, g, b } = this.colors;
        const isOff = (r === 0 && g === 0 && b === 0);
        
        if (isOff) {
            this.el.style.background = '#222';
            this.el.style.boxShadow = 'inset -2px -2px 6px rgba(0,0,0,0.5), inset 2px 2px 6px rgba(255,255,255,0.2)';
        } else {
            this.el.style.background = `rgb(${r}, ${g}, ${b})`;
            this.el.style.boxShadow = `0 0 25px rgba(${r}, ${g}, ${b}, 0.8), inset 2px 2px 6px rgba(255,255,255,0.5)`;
        }
    }
}
