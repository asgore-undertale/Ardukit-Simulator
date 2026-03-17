import { eventBus } from '../core/EventBus.js';

/**
 * CharacterLCD.js
 * 
 * Visualizes a 16x2 character display.
 * Listens for high-level LCD events from the Runner (mocking LiquidCrystal).
 */
export class CharacterLCD {
    constructor() {
        this.rows = [
            document.getElementById('lcd-row-0'),
            document.getElementById('lcd-row-1')
        ];
        
        this.buffer = [
            "                ".split(''), // 16 spaces
            "                ".split('')
        ];

        this.cursorX = 0;
        this.cursorY = 0;

        eventBus.on('lcd:print', (text) => this.print(text));
        eventBus.on('lcd:setCursor', ({col, row}) => {
            this.cursorX = Math.max(0, Math.min(15, col));
            this.cursorY = Math.max(0, Math.min(1, row));
        });
        eventBus.on('lcd:clear', () => this.clear());

        eventBus.on('board:reset', () => this.clear());
    }

    print(text) {
        const str = String(text);
        for (let i = 0; i < str.length; i++) {
            if (this.cursorX < 16) {
                this.buffer[this.cursorY][this.cursorX] = str[i];
                this.cursorX++;
            }
        }
        this.render();
    }

    clear() {
        this.buffer[0].fill(' ');
        this.buffer[1].fill(' ');
        this.cursorX = 0;
        this.cursorY = 0;
        this.render();
    }

    render() {
        if (this.rows[0]) this.rows[0].textContent = this.buffer[0].join('');
        if (this.rows[1]) this.rows[1].textContent = this.buffer[1].join('');
    }
}
