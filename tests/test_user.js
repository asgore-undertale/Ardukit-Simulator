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

void setup()
{
  ...
}

void loop()
{
  readButtons();
  check_leds();
  refreshDisplay(counter);
}

void readButtons()
{
  if (digitalRead(keyAdd1) == HIGH)
  {
    if (!lockAdd3)
    {
      delay(30);
      counter += 3;
      if (counter > 9999) counter = 9999;
      lockAdd3 = true;
    }
  }
  else
  {
    lockAdd3 = false;
  }
  
  if (digitalRead(keySub1) == HIGH)
  {
    if (!lockSub2)
    {
      delay(30);
      counter -= 2;
      if (counter < 1) counter = 0;
      lockSub2 = true;
    }
  }
  else
  {
    lockSub2 = false;
  }
  
  if (digitalRead(keyAdd3) == HIGH)
  {
    if (!lockAdd4)
    {
      delay(30);
      counter += 4;
      if (counter > 9999) counter = 9999;
      lockAdd4 = true;
    }
  }
  else
  {
    lockAdd4 = false;
  }
  
  if (digitalRead(keySub4) == HIGH)
  {
    if (!lockSub10)
    {
      delay(30);
      counter -= 10;
      if (counter < 1) counter = 0;
      lockSub10 = true;
    }
  }
  else
  {
    lockSub10 = false;
  }
}

void check_leds()
{
  if (counter <= 10 || counter >= 30) {
    digitalWrite(lamp1, HIGH);
  }
  else {
    digitalWrite(lamp1, LOW);
  }
}

void refreshDisplay(int n)
{
  int b = n;
  int digit4 = b % 10;
  b = b / 10;
  int digit3 = b % 10;
  b = b / 10;
  int digit2 = b % 10;
  b = b / 10;
  int digit1 = b % 10;
  
  displayDigit(digitPos1, digit1);
}
`;

const runner = new ArduinoRunner({});
console.log(runner.transpile(code));
