import { ArduinoRunner } from '../web/js/core/ArduinoRunner.js';

const code = `
const int segA = 22;
const int segB = 23;
const int segC = 24;
const int segD = 25;
const int segE = 26;
const int segF = 27;
const int segG = 28;
const int segP = 29;

const int digitPos1 = 36;
const int digitPos2 = 35;
const int digitPos3 = 34;
const int digitPos4 = 33;

const int keyAdd1 = 38;
const int keySub1 = 39;
const int keyAdd3 = 40;
const int keySub4 = 41;

const int lamp1 = 43;
const int lamp2 = 44;
const int lamp3 = 45;
const int lamp4 = 46;

int counter = 0;

bool lockAdd3 = false;
bool lockSub2 = false;
bool lockAdd4 = false;
bool lockSub10 = false;

void setup() {
  pinMode(keyAdd1, INPUT);
}
void loop() {
  if (digitalRead(keyAdd1) == HIGH) {
    if (!lockAdd3) {
      delay(30);
      counter += 3;
      if (counter > 9999) counter = 9999;
      lockAdd3 = true;
    }
  } else {
    lockAdd3 = false;
  }
}
`;

class MockBoard {
  constructor() {
    this.states = new Array(70).fill(0);
    this.modes = new Array(70).fill('INPUT');
  }
  reset() { this.states.fill(0); }
  pinMode(pin, mode) { this.modes[pin] = mode; }
  digitalRead(pin) { return this.states[pin]; }
  digitalWrite(pin, state) { this.states[pin] = state; }
  analogWrite(pin, state) { this.states[pin] = state; }
  analogRead(pin) { return this.states[pin]; }
  millis() { return 100; }
}

const board = new MockBoard();
const runner = new ArduinoRunner(board);
runner.eventBus = { emit: () => { } };

(async () => {
  try {
    const jsCode = runner.transpile(code);

    // Execute manually to get access to 'counter'
    const executableCode = `
            try {
                const board = runner.board;
                const floor = Math.floor;
                ${jsCode}

                await setup();

                // Cycle 1: Button is LOW
                await loop();
                console.log("After cycle 1, counter =", counter);

                // Cycle 2: User presses button (HIGH)
                board.states[38] = 1;
                await loop();
                console.log("After press, counter =", counter);

                // Cycle 3: User holds button (HIGH)
                await loop();
                console.log("After hold, counter =", counter);

                // Cycle 4: User releases button (LOW)
                board.states[38] = 0;
                await loop();
                console.log("After release, counter =", counter);

                // Cycle 5: User presses button AGAIN (HIGH)
                board.states[38] = 1;
                await loop();
                console.log("After second press, counter =", counter);

            } catch (e) {
                console.error("ERROR", e);
            }
        `;

    const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
    const mainFn = new AsyncFunction('runner', executableCode);
    await mainFn(runner);

  } catch (e) {
    console.error(e);
  }
})();
