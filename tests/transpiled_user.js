🛠️ ArduKit Transpiler V2.1 Loaded! (String & Type fix)

const segA = 22;
const segB = 23;
const segC = 24;
const segD = 25;
const segE = 26;
const segF = 27;
const segG = 28;
const segP = 29;

const digitPos1 = 36;
const digitPos2 = 35;
const digitPos3 = 34;
const digitPos4 = 33;

const keyAdd1 = 38;
const keySub1 = 39;
const keyAdd3 = 40;
const keySub4 = 41;

const lamp1 = 43;
const lamp2 = 44;
const lamp3 = 45;
const lamp4 = 46;

let counter = 0;

let lockAdd3 = false;
let lockSub2 = false;
let lockAdd4 = false;
let lockSub10 = false;
async function setup()
{
  ...
}
async function loop()
{
  readButtons();
  check_leds();
  refreshDisplay(counter);
}
async function readButtons()
{
  if (board.digitalRead(keyAdd1) == 1)
  {
    if (!lockAdd3)
    {
      await runner._delay(30);
      counter += 3;
      if (counter > 9999) counter = 9999;
      lockAdd3 = true;
    }
  }
  else
  {
    lockAdd3 = false;
  }
  
  if (board.digitalRead(keySub1) == 1)
  {
    if (!lockSub2)
    {
      await runner._delay(30);
      counter -= 2;
      if (counter < 1) counter = 0;
      lockSub2 = true;
    }
  }
  else
  {
    lockSub2 = false;
  }
  
  if (board.digitalRead(keyAdd3) == 1)
  {
    if (!lockAdd4)
    {
      await runner._delay(30);
      counter += 4;
      if (counter > 9999) counter = 9999;
      lockAdd4 = true;
    }
  }
  else
  {
    lockAdd4 = false;
  }
  
  if (board.digitalRead(keySub4) == 1)
  {
    if (!lockSub10)
    {
      await runner._delay(30);
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
async function check_leds()
{
  if (counter <= 10 || counter >= 30) {
    board.digitalWrite(lamp1, 1);
  }
  else {
    board.digitalWrite(lamp1, 0);
  }
}
async function refreshDisplay(n)
{
  let b = n;
  let digit4 = b % 10;
  b = Math.floor(b / 10);
  let digit3 = b % 10;
  b = Math.floor(b / 10);
  let digit2 = b % 10;
  b = Math.floor(b / 10);
  let digit1 = b % 10;
  
  displayDigit(digitPos1, digit1);
}

