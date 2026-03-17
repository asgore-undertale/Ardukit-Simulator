/*
  LiquidCrystal Library - Hello World

 Demonstrates the use a 16x2 LCD display.  The LiquidCrystal
 library works with all LCD displays that are compatible with the
 Hitachi HD44780 driver. There are many of them out there, and you
 can usually tell them by the 16-pin interface.

 This sketch prints "Hello World!" to the LCD
 and shows the time.

  The circuit:
 * LCD RS pin to digital pin 36
 * LCD Enable pin to digital pin 37
 * LCD D4 pin to digital pin 26
 * LCD D5 pin to digital pin 27
 * LCD D6 pin to digital pin 28
 * LCD D7 pin to digital pin 29
 * LCD R/W pin to ground
 * LCD VSS pin to ground
 * LCD VCC pin to 5V
 * 10K resistor:
 * ends to +5V and ground
 * wiper to LCD VO pin (pin 3)

 Library originally added 18 Apr 2008
 by David A. Mellis
 library modified 5 Jul 2009
 by Limor Fried (http://www.ladyada.net)
 example added 9 Jul 2009
 by Tom Igoe
 modified 22 Nov 2010
 by Tom Igoe

 This example code is in the public domain.

 http://www.arduino.cc/en/Tutorial/LiquidCrystal
 */

// include the library code:
#include <LiquidCrystal.h>

// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(36, 37, 26, 27, 28, 29);
int pot=A8;
int lm35=A4;
int ptc=A9;
int ntc=A10;
int ldr=A11;
int analogdeger=0;
void setup() {
  // set up the LCD's number of columns and rows:
  Serial.begin(19200);
  Serial3.begin(9600);
  Serial.println("DENEY18-ANALOG SENSOR");
  Serial3.println("DENEY18-ANALOG SENSOR");
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("   GNDKITS");
}

void loop() {
  // Turn off the display:
  lcd.begin(16, 2);
  lcd.print("DEGER= ");
 analogdeger=analogRead(pot);
 delay(20);
 Serial.print("POTANSIYOMETRE=");Serial.println(analogdeger);
 Serial3.print("POTANSIYOMETRE=");Serial3.println(analogdeger);
 analogdeger=analogRead(lm35);
 delay(20);
 Serial.print("LM35          =");Serial.println(analogdeger);
 Serial3.print("LM35          =");Serial3.println(analogdeger);
  analogdeger=analogRead(ptc);
  delay(20);
 Serial.print("PTC           =");Serial.println(analogdeger);
  analogdeger=analogRead(ntc);
  delay(20);
 Serial.print("NTC           =");Serial.println(analogdeger);
  analogdeger=analogRead(ldr);
  delay(20);
 Serial.print("LDR           =");Serial.println(analogdeger);
 lcd.print(analogdeger);
  delay(500);
}

