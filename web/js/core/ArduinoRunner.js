import { eventBus } from './EventBus.js';

/**
 * ArduinoRunner.js
 * 
 * Takes C++ style Arduino code, transpiles it into an asynchronous JavaScript 
 * function context, and manages the execution loop securely.
 */

export class ArduinoRunner {
    constructor(board) {
        console.log("🛠️ ArduKit Transpiler V2.1 Loaded! (String & Type fix)");
        this.board = board;
        this.eventBus = eventBus;
        this.isRunning = false;
        this.shouldStop = false;
    }

    /**
     * Stop the running sketch
     */
    stop() {
        this.shouldStop = true;
        this.isRunning = false;
        eventBus.emit('runner:stopped');
    }

    /**
     * Very basic regex transpiler.
     * Replaces Arduino specific functions with JS equivalents bound to this.board.
     * Crucially, converts delay() to await this._delay(), making the loop non-blocking.
     */
    /**
     * Balanced parenthesis finder (string aware)
     */
    _findClosingParen(str, openPos) {
        let depth = 0;
        let inString = false;
        for (let i = openPos; i < str.length; i++) {
            if (str[i] === '"' && (i === 0 || str[i-1] !== '\\')) {
                inString = !inString;
                continue;
            }
            if (inString) continue;
            
            if (str[i] === '(') depth++;
            else if (str[i] === ')') {
                depth--;
                if (depth === 0) return i;
            }
        }
        return -1;
    }

    /**
     * Robust transpiler using balanced parenthesis matching.
     */
    transpile(code) {
        let jsCode = code;

        // 0. Preprocessor Directives
        // Convert #define KEY VALUE to const KEY = VALUE; (trimming comments and \r)
        jsCode = jsCode.replace(/^\s*#define\s+(\w+)(?:\s+([^\/\n\r]+))?\s*(?:\/\/.*)?\r?$/gm, (match, key, val) => {
            if (val === undefined || val.trim() === '') return `const ${key} = true;`;
            return `const ${key} = ${val.trim()};`;
        });
        // Strip remaining directives like #include
        jsCode = jsCode.replace(/^\s*#.*$/gm, '');

        // Initialize specialized types
        jsCode = jsCode.replace(/\bDeviceAddress\s+(\w+)\s*;/g, 'let $1 = new DeviceAddress(8);');
        
        const knownClasses = ['LiquidCrystal', 'RTC_DS1307', 'OneWire', 'DallasTemperature', 'RTC_DS3231', 'DateTime', 'TimeSpan'];

        // 1. Handle Class Declarations and In-place constructors safely
        let lines = jsCode.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Check for ClassName instance(args);
            knownClasses.forEach(cls => {
                const declRegex = new RegExp(`^\\s*${cls}\\s+(\\w+)\\s*\\(`, '');
                const match = line.match(declRegex);
                if (match) {
                    const openParenPos = line.indexOf('(', match.index);
                    const closeParenPos = this._findClosingParen(line, openParenPos);
                    if (closeParenPos !== -1) {
                        const name = match[1];
                        const args = line.substring(openParenPos + 1, closeParenPos);
                        lines[i] = line.substring(0, match.index) + `const ${name} = new ${cls}(${args});` + line.substring(closeParenPos + 1);
                        line = lines[i];
                    }
                }
            });

            // Check for ClassName instance;
            knownClasses.forEach(cls => {
                const noArgsRegex = new RegExp(`^\\s*${cls}\\s+(\\w+)\\s*;`, '');
                const match = line.match(noArgsRegex);
                if (match) {
                    lines[i] = line.replace(noArgsRegex, `const $1 = new ${cls}();`);
                    line = lines[i];
                }
            });

            // Check for ClassName instance = ...;
            knownClasses.forEach(cls => {
                const assignedRegex = new RegExp(`^\\s*${cls}\\s+(\\w+)\\s*=`, '');
                if (assignedRegex.test(line)) {
                    lines[i] = line.replace(assignedRegex, 'let $1 =');
                    line = lines[i];
                }
            });
        }
        jsCode = lines.join('\n');

        // 2. In-place constructors: ClassName(args) -> new ClassName(args)
        knownClasses.forEach(cls => {
            const regex = new RegExp(`(?<!new\\s+|let\\s+|const\\s+|\\.)\\b${cls}\\s*\\(`, 'g');
            jsCode = jsCode.replace(regex, `new ${cls}(`);
        });

        // 3. Array Initializers & Multi-dimensional Arrays
        const typeListCore = '(?:void|int|long|float|double|byte|uint8_t|uint16_t|uint32_t|boolean|bool|String|char|int16_t|int32_t|uint64_t|DeviceAddress)';
        const fullTypeStr = `\\b(?:(?:const|static|volatile|unsigned|signed|inline)\\s+)*${typeListCore}\\b`;
        
        // Handle: Type name[] = { ... };
        jsCode = jsCode.replace(new RegExp(`${fullTypeStr}\\s+(\\w+)\\s*(\\[\\d*\\])+\\s*=`, 'g'), (match, p1) => {
            if (match.includes('const')) return `const ${p1} =`;
            return `let ${p1} =`;
        });
        // Handle: Type name[] ;
        jsCode = jsCode.replace(new RegExp(`${fullTypeStr}\\s+(\\w+)\\s*(\\[\\d*\\])+\\s*;`, 'g'), (match, p1) => {
            if (match.includes('const')) return `const ${p1} = [];`;
            return `let ${p1} = [];`;
        });
        
        // Convert { ... } to [ ... ] for initializers
        jsCode = jsCode.replace(/=\s*\{([\s\S]*?)\}/g, (match, content) => {
            return '= [' + content.replace(/\{/g, '[').replace(/\}/g, ']') + ']';
        });

        // 4. Constants, Pointers and Scope
        jsCode = jsCode.replace(/\b(\d+)[UL]+\b/gi, '$1');
        jsCode = jsCode.replace(/(?<=\(|,|=|\s)&(\w+)\b/g, '$1');
        jsCode = jsCode.replace(/(?<=\(|,|=|\s)\*(\w+)\b/g, '$1');
        jsCode = jsCode.replace(/::/g, '.');
        jsCode = jsCode.replace(/->/g, '.');

        // Analog Pins mapping
        for (let i = 0; i <= 15; i++) {
            jsCode = jsCode.replace(new RegExp(`\\bA${i}\\b`, 'g'), (54 + i).toString());
        }

        // 5. Function Declarations
        jsCode = jsCode.replace(new RegExp(`^\\s*${fullTypeStr}\\s+(\\w+)\\s*\\(`, 'gm'), 'async function $1(');

        // Strip formal parameters ONLY from async functions
        jsCode = jsCode.replace(/(async\s+function\s+\w+\s*\()([^)]*)(\))/g, (match, prefix, params, suffix) => {
            if (params.trim().toLowerCase() === 'void') return prefix + suffix;
            const cleaned = params.replace(new RegExp(`${fullTypeStr}\\s+(?:&\\s*)?`, 'g'), '');
            return prefix + cleaned + suffix;
        });

        // 5b. Await user-defined async function calls
        // In Arduino, ALL functions are synchronous. delay() blocks everything.
        // In our transpiled JS, functions are async but calls are NOT awaited,
        // causing concurrent execution (e.g., loop() spawns many readButtons() at once).
        // Fix: collect all user-defined function names and prepend 'await' to calls.
        const userFuncNames = [];
        const funcNameRegex = /async\s+function\s+(\w+)\s*\(/g;
        let funcMatch;
        while ((funcMatch = funcNameRegex.exec(jsCode)) !== null) {
            const name = funcMatch[1];
            // Don't add await to setup/loop (they're called by the runner wrapper)
            if (name !== 'setup' && name !== 'loop') {
                userFuncNames.push(name);
            }
        }
        // Prepend 'await' to calls of user-defined functions (only bare calls, not declarations)
        userFuncNames.forEach(fname => {
            jsCode = jsCode.replace(
                new RegExp(`(?<!function\\s)(?<!await\\s)\\b${fname}\\s*\\(`, 'g'),
                `await ${fname}(`
            );
        });

        // Handle types (variables)
        jsCode = jsCode.replace(new RegExp(`(?<!new\\s+|const\\s+|let\\s+|\\.)${fullTypeStr}`, 'g'), (match) => {
            if (match.includes('const')) return 'const';
            return 'let';
        });
        
        // Clean up any remaining brackets in declarations (e.g. let ledler[])
        jsCode = jsCode.replace(/\b(let|const)\s+(\w+)\s*(\[\d*\])+/g, '$1 $2');

        // 6. Arduino Constants and API
        jsCode = jsCode.replace(/\bF\s*\((.*?)\)/g, '$1'); 
        jsCode = jsCode.replace(/\bHIGH\b/g, '1');
        jsCode = jsCode.replace(/\bLOW\b/g, '0');
        jsCode = jsCode.replace(/\bOUTPUT\b/g, '"OUTPUT"');
        jsCode = jsCode.replace(/\bINPUT\b/g, '"INPUT"');
        jsCode = jsCode.replace(/\bINPUT_PULLUP\b/g, '"INPUT_PULLUP"');

        // BCD / Integer Division Heuristics (Fixes 7-Segment ghosting without user changes)
        // Wraps variable divided by powers of 10 (e.g. sayac / 100) in Math.floor
        jsCode = jsCode.replace(/\b(\w+)\s*\/\s*(10+)\b/g, 'Math.floor($1 / $2)');
        jsCode = jsCode.replace(/(\w+)\s*\/\=\s*(10+)\s*;/g, '$1 = Math.floor($1 / $2);');

        jsCode = jsCode.replace(/\bpinMode\s*\(/g, 'board.pinMode(');
        jsCode = jsCode.replace(/\bdigitalWrite\s*\(/g, 'board.digitalWrite(');
        jsCode = jsCode.replace(/\banalogWrite\s*\(/g, 'board.analogWrite(');
        jsCode = jsCode.replace(/\bdigitalRead\s*\(/g, 'board.digitalRead(');
        jsCode = jsCode.replace(/\banalogRead\s*\(/g, 'board.analogRead(');
        jsCode = jsCode.replace(/\bmillis\s*\(\w*\)/g, 'board.millis()');
        jsCode = jsCode.replace(/\bdelay\s*\((.*?)\)/g, 'await runner._delay($1)');
        jsCode = jsCode.replace(/while\s*\((.*?)\)\s*;/g, 'while($1) { await new Promise(r => setTimeout(r, 0)); }');

        // 7. Serial Mocking with balanced parens
        let sLines = jsCode.split('\n');
        for (let j = 0; j < sLines.length; j++) {
            let sLine = sLines[j];
            const serialRegex = /\bSerial(\d?)\.(print|println|begin)\s*\(/g;
            let sMatch;
            while ((sMatch = serialRegex.exec(sLine)) !== null) {
                const port = sMatch[1];
                const method = sMatch[2];
                const openPos = sMatch.index + sMatch[0].length - 1;
                const closePos = this._findClosingParen(sLine, openPos);
                
                if (closePos !== -1) {
                    const args = sLine.substring(openPos + 1, closePos);
                    let replacement;
                    if (method === 'begin') {
                        replacement = `runner._serialBegin(${args}, "${port}")`;
                    } else {
                        let parts = [];
                        let commaPos = -1;
                        let depth = 0;
                        let inS = false;
                        for (let k = 0; k < args.length; k++) {
                            if (args[k] === '"' && (k === 0 || args[k-1] !== '\\')) {
                                inS = !inS;
                                continue;
                            }
                            if (inS) continue;

                            if (args[k] === '(') depth++;
                            else if (args[k] === ')') depth--;
                            else if (args[k] === ',' && depth === 0) {
                                commaPos = k;
                                break;
                            }
                        }
                        const val = commaPos === -1 ? args : args.substring(0, commaPos);
                        const format = commaPos === -1 ? 'undefined' : args.substring(commaPos + 1);
                        const internalMethod = method === 'print' ? '_serialPrint' : '_serialPrintln';
                        replacement = `runner.${internalMethod}(${val || '""'}, ${format.trim() || 'undefined'}, "${port}")`;
                    }
                    sLine = sLine.substring(0, sMatch.index) + replacement + sLine.substring(closePos + 1);
                    serialRegex.lastIndex = sMatch.index + replacement.length;
                }
            }
            sLines[j] = sLine;
        }
        jsCode = sLines.join('\n');

        return jsCode;
    }

    /**
     * Helper to yield execution
     */
    _delay(ms) {
        if (ms <= 0) return Promise.resolve();
        return new Promise(resolve => {
            const start = performance.now();
            const check = () => {
                if (this.shouldStop || (performance.now() - start) >= ms) {
                    resolve();
                } else {
                    // Use requestAnimationFrame for high-precision yielding if possible,
                    // or just a small setTimeout
                    setTimeout(check, 0);
                }
            };
            check();
        });
    }

    // --- Serial Wrappers ---
    _serialBegin(baud, port = "") {
        const name = port ? `Serial${port}` : "Serial";
        eventBus.emit('serial:output', `<span style="color: grey">${name} opened at ${baud} baud</span>`);
    }

    _serialPrintln(msg = "", format, port = "") {
        const name = port ? `Serial${port}: ` : "";
        if (typeof msg === 'number' && format) msg = msg.toString(format);
        eventBus.emit('serial:output', `<div>${name}${msg}</div>`);
    }

    _serialPrint(msg = "", format, port = "") {
        const name = port ? `Serial${port}: ` : "";
        if (typeof msg === 'number' && format) msg = msg.toString(format);
        eventBus.emit('serial:output', `<span>${name}${msg}</span>`);
    }

    /**
     * Executes the transpiled code
     */
    async run(sourceCode) {
        if (this.isRunning) return;
        
        this.board.reset();
        this.shouldStop = false;
        this.isRunning = true;
        
        eventBus.emit('runner:started');
        eventBus.emit('serial:clear');

        try {
            const jsCode = this.transpile(sourceCode);
            
            // Extract setup and loop definitions
            // This is a naive regex approach suitable for simple demonstrations
            // A real simulator would use an AST parser like Acorn or Babel
            
            const setupMatch = jsCode.match(/void\s+setup\s*\(\)\s*\{([\s\S]*?)\n[}\n]*(?=\s*(void\s+loop|function\s+loop|\w+\s+\w+\s*\())/);
            const loopMatch = jsCode.match(/void\s+loop\s*\(\)\s*\{([\s\S]*?)\n[}\n]*$/);
            
            // If regex failed to clearly segment, fallback to evaluating the whole thing with custom wrappers
            // But for safety, we construct an AsyncFunction
            
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            
            // Construct the runner wrapper
            const executableCode = `
                try {
                    // Make board and API accessible in local scope
                    const board = runner.board;
                    
                    // Mocks for I2C and constants
                    const Wire = { begin() {}, beginTransmission() {}, endTransmission() {}, write() {}, read() {} };
                    const DEC = 10; const HEX = 16; const OCT = 8; const BIN = 2;
                    const __DATE__ = new Date().toDateString();
                    const __TIME__ = new Date().toLocaleTimeString();
                    
                    // Standard Math / Utility functions mapping
                    const floor = Math.floor;
                    const ceil = Math.ceil;
                    const round = Math.round;
                    const abs = Math.abs;
                    const min = Math.min;
                    const max = Math.max;


                    // Define Serial1, Serial2, Serial3 to reuse basic Serial mocks
                    const Serial = {
                        begin: (b) => runner._serialBegin(b, ""),
                        print: (m, f) => runner._serialPrint(m, f, ""),
                        println: (m, f) => runner._serialPrintln(m, f, "")
                    };
                    const Serial1 = {
                        begin: (b) => runner._serialBegin(b, "1"),
                        print: (m, f) => runner._serialPrint(m, f, "1"),
                        println: (m, f) => runner._serialPrintln(m, f, "1")
                    };
                    const Serial2 = {
                        begin: (b) => runner._serialBegin(b, "2"),
                        print: (m, f) => runner._serialPrint(m, f, "2"),
                        println: (m, f) => runner._serialPrintln(m, f, "2")
                    };
                    const Serial3 = {
                        begin: (b) => runner._serialBegin(b, "3"),
                        print: (m, f) => runner._serialPrint(m, f, "3"),
                        println: (m, f) => runner._serialPrintln(m, f, "3")
                    };
                    class LiquidCrystal {
                        constructor(rs, e, d4, d5, d6, d7) {
                            this.rs = rs; this.e = e; this.d4 = d4; this.d5 = d5; this.d6 = d6; this.d7 = d7;
                        }
                        begin(cols, rows) { runner.eventBus.emit('lcd:clear'); }
                        clear() { runner.eventBus.emit('lcd:clear'); }
                        setCursor(col, row) { runner.eventBus.emit('lcd:setCursor', {col, row}); }
                        print(text) { runner.eventBus.emit('lcd:print', text); }
                        write(char) { runner.eventBus.emit('lcd:print', String.fromCharCode(char)); }
                    }

                    // Mock RTClib
                    class DateTime {
                        constructor(y, m, d, h, min, s) {
                            if (typeof y === 'string' || y === undefined) { 
                                this.date = y ? new Date(y) : new Date();
                                if (isNaN(this.date)) this.date = new Date(); // Fallback
                            } else if (typeof y === 'number') {
                                this.date = new Date(y);
                            } else if (y instanceof Date) {
                                this.date = y;
                            } else if (y instanceof DateTime) {
                                this.date = new Date(y.date.getTime());
                            } else {
                                this.date = new Date(y, m - 1, d, h, min, s);
                            }
                        }
                        year() { return this.date.getFullYear(); }
                        month() { return this.date.getMonth() + 1; }
                        day() { return this.date.getDate(); }
                        hour() { return this.date.getHours(); }
                        minute() { return this.date.getMinutes(); }
                        second() { return this.date.getSeconds(); }
                        dayOfTheWeek() { return this.date.getDay(); }
                        unixtime() { return Math.floor(this.date.getTime() / 1000); }
                        valueOf() { return this.date.getTime(); }
                        operatorPlus(timespan) { 
                            return new DateTime(new Date(this.date.getTime() + timespan.totalSeconds * 1000));
                        }
                    }

                    class TimeSpan {
                        constructor(d, h, m, s) {
                            this.totalSeconds = d * 86400 + h * 3600 + m * 60 + s;
                        }
                        valueOf() { return this.totalSeconds * 1000; }
                    }

                    class RTC_DS1307 {
                        begin() { return true; }
                        isrunning() { return true; }
                        adjust(dt) { console.log("RTC Adjusted", dt); }
                        now() { return new DateTime(new Date()); }
                    }

                    // Mock OneWire & DallasTemperature
                    class OneWire { constructor(pin) { this.pin = pin; } }
                    class DallasTemperature {
                        constructor(ow) { this.ow = ow; }
                        begin() {}
                        getDeviceCount() { return 1; }
                        isParasitePowerMode() { return false; }
                        getAddress(addr, idx) { 
                            if (addr && addr.set) {
                                addr.set([0x28, 0x1D, 0x39, 0x31, 0x02, 0x00, 0x00, 0xF0]);
                                return true;
                            }
                            return false; 
                        }
                        setResolution(addr, res) {}
                        getResolution(addr) { return 9; }
                        requestTemperatures() {}
                        getTempC(addr) { 
                            // Try to read from the pin, default to 25.5 if not found
                            return board.states[this.ow.pin] !== undefined ? board.states[this.ow.pin] : 25.5; 
                        }
                        static toFahrenheit(c) { return (c * 9/5) + 32; }
                    }
                    const DeviceAddress = Uint8Array;

                    // Mock openGLCD
                    const GLCD = {
                        Init() { runner.eventBus.emit('lcd:clear'); },
                        SelectFont(f) {},
                        print(text) { runner.eventBus.emit('lcd:print', text); },
                        Puts(text) { runner.eventBus.emit('lcd:print', text); },
                        CursorTo(c, r) { runner.eventBus.emit('lcd:setCursor', {col: c, row: r}); },
                        ClearScreen() { runner.eventBus.emit('lcd:clear'); }
                    };
                    const System5x7 = "font";

                    ${jsCode}

                    // Call setup if it exists
                    if (typeof setup === 'function') {
                        await setup();
                    }

                    // Run loop continuously
                    if (typeof loop === 'function') {
                        let lastYield = performance.now();
                        while (!runner.shouldStop) {
                            await loop();
                            // Yield to browser event loop to prevent lockup
                            // If we yield every time, it's too slow.
                            // But for multiplexing codes, we must yield sometimes.
                            const now = performance.now();
                            if (now - lastYield > 1) { // Yield every 1ms of execution (finer grain)
                                await new Promise(r => setTimeout(r, 0));
                                lastYield = performance.now();
                            }
                        }
                    }
                } catch (e) {
                    runner._serialPrintln('<span style="color: red">Runtime Error: ' + e.message + '</span>');
                    throw e; // rethrow to be caught by outer try/catch
                }
            `;

            // We pass the 'runner' instance directly as an argument to the constructed async function
            const runnerFunc = new AsyncFunction('runner', executableCode);
            
            // Execute passing `this` as the runner argument
            await runnerFunc(this);

        } catch (error) {
            console.error("Transpilation/Execution Error:", error);
            this.eventBus.emit('serial:output', `<div style="color: var(--danger-color)">Error: ${error.message}</div>`);
            this.stop();
        }
    }
}
