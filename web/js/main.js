import { eventBus } from './core/EventBus.js';
import { VirtualBoard } from './core/VirtualBoard.js';
import { ArduinoRunner } from './core/ArduinoRunner.js';

import { SystemLEDs } from './peripherals/SystemLEDs.js';
import { UserButtons } from './peripherals/UserButtons.js';
import { RGBLED } from './peripherals/RGBLED.js';
import { Buzzer } from './peripherals/Buzzer.js';
import { SevenSegment } from './peripherals/SevenSegment.js';
import { AnalogSensors } from './peripherals/AnalogSensors.js';
import { CharacterLCD } from './peripherals/CharacterLCD.js';
import { Relay } from './peripherals/Relay.js';
import { DCMotor } from './peripherals/DCMotor.js';
import { RotaryEncoder } from './peripherals/RotaryEncoder.js';

/**
 * main.js
 * Composition root that initializes the VirtualBoard, Peripherals, and UI wiring.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Domain Layer
    const board = new VirtualBoard();
    
    // Ensure hardware updates correctly modify the VirtualBoard state
    eventBus.on('external:pinUpdate', ({pin, state}) => {
        board.setHardwareInput(pin, state);
    });

    eventBus.on('external:analogUpdate', ({pin, value}) => {
        board.setAnalogInput(pin, value);
    });

    // 2. Initialize Runner (Application)
    const runner = new ArduinoRunner(board);

    // 3. Initialize Visual Peripherals (Infrastructure)
    new SystemLEDs();
    new UserButtons();
    new RGBLED();
    new Buzzer();
    new SevenSegment();
    new AnalogSensors();
    new CharacterLCD();
    new Relay();
    new DCMotor();
    new RotaryEncoder();

    // 4. UI Wiring Connections
    const btnRun = document.getElementById('btn-run');
    const btnStop = document.getElementById('btn-stop');
    const codeEditor = document.getElementById('code-editor');
    const highlighting = document.getElementById('highlighting-content');
    const highlightingBox = document.getElementById('highlighting');
    const statusDot = document.getElementById('connection-status');
    const statusText = document.getElementById('status-text');
    const serialOut = document.getElementById('serial-output');

    // Syntax Highlighting Sync
    const updateHighlighting = () => {
        let code = codeEditor.value;
        // Basic escaping
        code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;");
        if (code[code.length-1] === "\n") code += " "; // Handle trailing newline
        highlighting.innerHTML = code;
        if (window.Prism) {
            Prism.highlightElement(highlighting);
        }
    };

    // Sync scroll between textarea and highlighting block
    codeEditor.addEventListener('scroll', () => {
        highlightingBox.scrollTop = codeEditor.scrollTop;
        highlightingBox.scrollLeft = codeEditor.scrollLeft;
    });

    codeEditor.addEventListener('input', updateHighlighting);

    // Support Tab key in editor
    codeEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = codeEditor.selectionStart;
            const end = codeEditor.selectionEnd;
            codeEditor.value = codeEditor.value.substring(0, start) + "  " + codeEditor.value.substring(end);
            codeEditor.selectionStart = codeEditor.selectionEnd = start + 2;
            updateHighlighting();
        }
    });

    // Initial highlight
    updateHighlighting();

    // Button Logic
    btnRun.addEventListener('click', () => {
        const sourceCode = codeEditor.value;
        runner.run(sourceCode);
    });

    btnStop.addEventListener('click', () => {
        runner.stop();
        board.reset(); // immediately cut power essentially
        serialAppend('<div style="color:var(--danger-color)">Execution stopped.</div>');
    });

    // Handle Runner state changes for UI
    eventBus.on('runner:started', () => {
        btnRun.disabled = true;
        btnStop.disabled = false;
        statusDot.className = 'dot online';
        statusText.textContent = 'Running Simulator';
    });

    eventBus.on('runner:stopped', () => {
        btnRun.disabled = false;
        btnStop.disabled = true;
        statusDot.className = 'dot offline';
        statusText.textContent = 'Disconnected';
    });

    // Serial Monitor Output
    const serialAppend = (html) => {
        serialOut.innerHTML += html;
        serialOut.scrollTop = serialOut.scrollHeight;
    };

    eventBus.on('serial:output', (htmlStr) => {
        serialAppend(htmlStr);
    });
    
    eventBus.on('serial:clear', () => {
        serialOut.innerHTML = '';
    });
});
