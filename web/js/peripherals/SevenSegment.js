import { eventBus } from '../core/EventBus.js';

/**
 * SevenSegment.js
 * 
 * Multiplexed 4-digit 7-segment display.
 * Segments A-DP: Pins 22-29
 * Digits 1-4 Ground Control: Pins 33-36
 */
export class SevenSegment {
    constructor() {
        this.segmentPins = [22, 23, 24, 25, 26, 27, 28, 29];
        this.digitPins = [33, 34, 35, 36];
        this.digitElements = [
            document.getElementById('digit-1'),
            document.getElementById('digit-2'),
            document.getElementById('digit-3'),
            document.getElementById('digit-4')
        ];

        // Independent segment buffer for each digit to prevent ghosting
        this.digitBuffers = Array.from({ length: 4 }, () => new Array(8).fill(0));
        this.globalSegments = new Array(8).fill(0); // Track latest segment write values
        this.digitStates = new Array(4).fill(0);    // Current physical pin state
        this.clearTimeouts = new Array(4).fill(null); // Persistence of Vision timers

        // Map segment index to CSS class
        this.segClasses = ['seg-a', 'seg-b', 'seg-c', 'seg-d', 'seg-e', 'seg-f', 'seg-g', 'seg-dp'];

        // Listen for all segment pin changes
        this.segmentPins.forEach((pin, index) => {
            eventBus.on(`pin:${pin}:write`, (val) => {
                this.globalSegments[index] = val; // Store globally
                // Update buffers ONLY for digits that are currently physically HIGH
                this.digitStates.forEach((state, dIdx) => {
                    if (state === 1) {
                        this.digitBuffers[dIdx][index] = val;
                        this.updateDigitDisplay(dIdx);
                    }
                });
            });
        });

        // Listen for digit select pins
        this.digitPins.forEach((pin, index) => {
            eventBus.on(`pin:${pin}:write`, (val) => {
                this.digitStates[index] = val;
                
                if (val === 1) {
                    // Refresh this digit's buffer from global state immediately!
                    // This handles cases where segment pins don't change between digits.
                    for (let i = 0; i < 8; i++) {
                        this.digitBuffers[index][i] = this.globalSegments[i];
                    }

                    // Turn on immediately and cancel any pending clear
                    if (this.clearTimeouts[index]) {
                        clearTimeout(this.clearTimeouts[index]);
                        this.clearTimeouts[index] = null;
                    }
                    this.updateDigitDisplay(index);
                } else {
                    // Persistence of Vision: Keep the current buffer visible for a short time
                    if (this.clearTimeouts[index]) clearTimeout(this.clearTimeouts[index]);
                    
                    this.clearTimeouts[index] = setTimeout(() => {
                        this.clearDigitUI(index);
                        this.clearTimeouts[index] = null;
                    }, 30); // 30ms POV buffer
                }
            });
        });

        eventBus.on('board:reset', () => {
            this.globalSegments.fill(0);
            this.digitBuffers.forEach(buf => buf.fill(0));
            this.digitStates.fill(0);
            this.clearTimeouts.forEach(t => t && clearTimeout(t));
            this.clearTimeouts.fill(null);
            for (let i = 0; i < 4; i++) this.clearDigitUI(i);
        });
    }

    updateDigitDisplay(digitIndex) {
        const digitEl = this.digitElements[digitIndex];
        if (!digitEl) return;

        const buffer = this.digitBuffers[digitIndex];
        this.segClasses.forEach((cls, segIdx) => {
            const segEl = digitEl.querySelector(`.${cls}`);
            if (segEl) {
                if (buffer[segIdx] === 1) {
                    segEl.classList.add('on');
                } else {
                    segEl.classList.remove('on');
                }
            }
        });
    }

    clearDigitUI(digitIndex) {
        const digitEl = this.digitElements[digitIndex];
        if (!digitEl) return;
        digitEl.querySelectorAll('.seg').forEach(seg => seg.classList.remove('on'));
    }
}
