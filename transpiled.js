SUCCESS:

// LED pins
const ledPins = [43, 44, 45, 46];

// Button pins
const buttonPins = [38, 39, 40, 41];

// Current active pattern
let currentPattern = -1;

// Timing
let previousMillis = 0;
let ledState = 0;
async function setup() {
  // Initialize LEDs
  for (let i = 0; i < 4; i++) {
    board.pinMode(ledPins[i], "OUTPUT");
  }

  // Initialize buttons
  for (let i = 0; i < 4; i++) {
    board.pinMode(buttonPins[i], "INPUT_PULLUP"); // safer input mode
  }

  runner._serialBegin(9600, "");
}
async function loop() {
  readButtons();
  runPattern();
}

// Detect which button is pressed
async function readButtons() {
  for (let i = 0; i < 4; i++) {
    if (board.digitalRead(buttonPins[i]) == 0) { // pressed
      currentPattern = i;
      runner._serialPrint("Button ", undefined, "");
      runner._serialPrint(i + 1, undefined, "");
      runner._serialPrintln(" pressed", undefined, "");
    }
  }
}

// Execute blinking pattern
async function runPattern() {
  let currentMillis = board.millis();

  switch (currentPattern) {

    // Pattern 1: Slow blink (500ms)
    case 0:
      if (currentMillis - previousMillis >= 500) {
        previousMillis = currentMillis;
        toggleAll();
      }
      break;

    // Pattern 2: Fast blink (100ms)
    case 1:
      if (currentMillis - previousMillis >= 100) {
        previousMillis = currentMillis;
        toggleAll();
      }
      break;

    // Pattern 3: Alternate LEDs
    case 2:
      if (currentMillis - previousMillis >= 200) {
        previousMillis = currentMillis;

        let state = false;
        state = !state;

        board.digitalWrite(ledPins[0], state);
        board.digitalWrite(ledPins[1], !state);
        board.digitalWrite(ledPins[2], state);
        board.digitalWrite(ledPins[3], !state);
      }
      break;

    // Pattern 4: Running light
    case 3:
      if (currentMillis - previousMillis >= 150) {
        previousMillis = currentMillis;

        let index = 0;

        // Turn all off
        for (let i = 0; i < 4; i++) {
          board.digitalWrite(ledPins[i], 0);
        }

        // Turn one on
        board.digitalWrite(ledPins[index], 1);

        index++;
        if (index >= 4) index = 0;
      }
      break;
  }
}

// Toggle all LEDs
async function toggleAll() {
  ledState = !ledState;
  for (let i = 0; i < 4; i++) {
    board.digitalWrite(ledPins[i], ledState);
  }
}

