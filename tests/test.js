import { ArduinoRunner } from '../web/js/core/ArduinoRunner.js';

const code = `
// LED pins
const int ledPins[4] = {43, 44, 45, 46};

// Button pins
const int buttonPins[4] = {38, 39, 40, 41};

// Current active pattern
int currentPattern = -1;

// Timing
unsigned long previousMillis = 0;
int ledState = LOW;

void setup() {
  // Initialize LEDs
  for (int i = 0; i < 4; i++) {
    pinMode(ledPins[i], OUTPUT);
  }

  // Initialize buttons
  for (int i = 0; i < 4; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP); // safer input mode
  }

  Serial.begin(9600);
}

void loop() {
  readButtons();
  runPattern();
}

// Detect which button is pressed
void readButtons() {
  for (int i = 0; i < 4; i++) {
    if (digitalRead(buttonPins[i]) == LOW) { // pressed
      currentPattern = i;
      Serial.print("Button ");
      Serial.print(i + 1);
      Serial.println(" pressed");
    }
  }
}

// Execute blinking pattern
void runPattern() {
  unsigned long currentMillis = millis();

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

        static bool state = false;
        state = !state;

        digitalWrite(ledPins[0], state);
        digitalWrite(ledPins[1], !state);
        digitalWrite(ledPins[2], state);
        digitalWrite(ledPins[3], !state);
      }
      break;

    // Pattern 4: Running light
    case 3:
      if (currentMillis - previousMillis >= 150) {
        previousMillis = currentMillis;

        static int index = 0;

        // Turn all off
        for (int i = 0; i < 4; i++) {
          digitalWrite(ledPins[i], LOW);
        }

        // Turn one on
        digitalWrite(ledPins[index], HIGH);

        index++;
        if (index >= 4) index = 0;
      }
      break;
  }
}

// Toggle all LEDs
void toggleAll() {
  ledState = !ledState;
  for (int i = 0; i < 4; i++) {
    digitalWrite(ledPins[i], ledState);
  }
}
`;

const runner = new ArduinoRunner({});
try {
  const result = runner.transpile(code);
  console.log("SUCCESS:");
  console.log(result);

  // Try parsing to catch unexpected let
  new Function(result);
} catch (e) {
  console.error("ERROR:", e);
  console.log("DUMP:");
  console.log(runner.transpile(code));
}
