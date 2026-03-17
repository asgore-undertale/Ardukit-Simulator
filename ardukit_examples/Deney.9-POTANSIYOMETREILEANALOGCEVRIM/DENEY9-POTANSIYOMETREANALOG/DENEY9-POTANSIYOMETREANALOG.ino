/*
  ArduKIT & Potansiyometre Uygulaması

  Analog girişten okunan değer Karakter LCD de gösterilir

  05/05/2016
 
 This example code is in the public domain.

 http://www.arduino.cc/en/Tutorial/LiquidCrystal
 */


#include <LiquidCrystal.h>


LiquidCrystal lcd(36, 37, 26, 27, 28, 29);
int pot=A8;
int analogdeger=0;
void setup() {
  
  pinMode(31, OUTPUT);//BACKLIGHT
  pinMode(35, OUTPUT);//RW
  digitalWrite(31, HIGH);
  digitalWrite(35, LOW);
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("   GNDKITS");
}

void loop() {
  
  lcd.begin(16, 2);
  lcd.print("DEGER= ");
 analogdeger=analogRead(pot);
 lcd.print(analogdeger);
  delay(1000);
}

