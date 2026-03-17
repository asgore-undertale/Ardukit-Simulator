import { eventBus } from '../core/EventBus.js';

/**
 * RotaryEncoder.js
 * An interactive knob that simulates a rotary encoder on pins 48 and 49.
 * Uses quadrature encoding logic.
 */
export class RotaryEncoder {
    constructor() {
        this.knob = document.getElementById('encoder-knob');
        this.pinA = 48;
        this.pinB = 49;
        this.angle = 0;
        this.lastAngle = 0;

        this.isDragging = false;
        
        this.initEvents();
    }

    initEvents() {
        this.knob.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastAngle = this.getAngle(e.clientX, e.clientY);
            document.addEventListener('mousemove', this.handleMove);
            document.addEventListener('mouseup', this.handleUp);
        });
    }

    handleMove = (e) => {
        if (!this.isDragging) return;
        
        const currentAngle = this.getAngle(e.clientX, e.clientY);
        let diff = currentAngle - this.lastAngle;
        
        // Handle wrap around
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        if (Math.abs(diff) > 10) { // Threshold for "click"
            const direction = diff > 0 ? 1 : -1;
            this.angle += direction * 15;
            this.knob.style.transform = `rotate(${this.angle}deg)`;
            this.simulateStep(direction);
            this.lastAngle = currentAngle;
        }
    }

    handleUp = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleMove);
        document.removeEventListener('mouseup', this.handleUp);
    }

    getAngle(x, y) {
        const rect = this.knob.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
    }

    /**
     * Simulates Quadrature Encoding:
     * Clockwise: (0,0) -> (1,0) -> (1,1) -> (0,1) -> (0,0)
     * Counter:   (0,0) -> (0,1) -> (1,1) -> (1,0) -> (0,0)
     */
    simulateStep(direction) {
        if (direction > 0) {
            // Forward
            eventBus.emit('external:pinUpdate', { pin: this.pinA, state: 1 });
            setTimeout(() => eventBus.emit('external:pinUpdate', { pin: this.pinB, state: 1 }), 5);
            setTimeout(() => eventBus.emit('external:pinUpdate', { pin: this.pinA, state: 0 }), 10);
            setTimeout(() => eventBus.emit('external:pinUpdate', { pin: this.pinB, state: 0 }), 15);
        } else {
            // Backward
            eventBus.emit('external:pinUpdate', { pin: this.pinB, state: 1 });
            setTimeout(() => eventBus.emit('external:pinUpdate', { pin: this.pinA, state: 1 }), 5);
            setTimeout(() => eventBus.emit('external:pinUpdate', { pin: this.pinB, state: 0 }), 10);
            setTimeout(() => eventBus.emit('external:pinUpdate', { pin: this.pinA, state: 0 }), 15);
        }
    }
}
