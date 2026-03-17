/*
  ArduKIT & Karakter LCD Uygulaması
  
  LiquidCrystal Library - Hello World uygulamasından esinlenilmiştir
  Pin bağlantıları genel örnekler ile aynıdır
  Arka plan aydınlatması (BackLight) 31 numaralı pine
  RW kontrol ucu 35 numaralı pine bağlanmıştır 
  01/05/2016

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

// Kütüphane dosyası bu bölümde programa eklenir
#include <LiquidCrystal.h>

#define ArkaAydinlatma  31
#define LcdRWPin        35

// Karakter LCD ekranın bağlı olduğu pinler 
LiquidCrystal lcd(36, 37, 26, 27, 28, 29);

void setup() 
{
  pinMode(ArkaAydinlatma, OUTPUT);
  pinMode(LcdRWPin, OUTPUT);
  //Gpio Init
  digitalWrite(LcdRWPin,LOW);         //RW pini gnd'ye çekiliyor.
  digitalWrite(ArkaAydinlatma,HIGH);  //ArkaAydinlatma aciliyor.
  //2x16 Lcd Init
  lcd.begin(16, 2);
  // LCD ekranda mesaj yazılıyor
  lcd.setCursor(4, 0);//Sütün,Satır
  lcd.print("GND KITS");
}

void loop() 
{
  lcd.setCursor(0, 1);
  lcd.print("ARDUINO DEV. KIT");
}

