/*
   ArduKIT & RTC & Grafik LCD Uygulaması
   Sistem zamanına bağlı olarak RTC zamanını günceller, 
   
 *  openGLCD Library - Hello World uygulamasından ve RTC kütüphanesinden esinlenilmiştir
 05/05/2016
 * 
 *  2013-06-15 bperrybap   - updates for openGLCD
 *  2011-09-14 Bill Perry  - original creation
 *  	bperrybap@opensource.billsworld.billandterrie.com
 */

// include the library header
// no font headers have to be included
#include <openGLCD.h>
#include <Wire.h>
#include "RTClib.h"

RTC_DS1307 rtc;

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};


void setup()
{  pinMode(31, OUTPUT);//BACKLIGHT
   digitalWrite(31, HIGH);
   pinMode(32, OUTPUT);//RST
   digitalWrite(32, LOW);
  Serial.begin(9600);
  // Initialize the GLCD 
  GLCD.Init();

 // Select the font for the default text area
  GLCD.SelectFont(System5x7);

//  GLCD.print(F("hello, world!")); // keep string in flash on AVR boards with IDE 1.x
//  GLCD.Puts(F("hello, world!")); // Puts() supports F() with any version of IDE

  // print() below uses RAM on AVR boards but works
  // on any version of IDE with any processor
  // note: Same is true for Puts()
  GLCD.print("GNDKITS DENEY SETLERI"); 
   if (! rtc.begin()) {
     Serial.println("Couldn't find RTC");
    while (1);
   }
    if (! rtc.isrunning()) {
     Serial.println("RTC is NOT running!");
    // following line sets the RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    // This line sets the RTC with an explicit date & time, for example to set
    // January 21, 2014 at 3am you would call:
    // rtc.adjust(DateTime(2014, 1, 21, 3, 0, 0));
  }
   
}

void loop()
{
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):

  GLCD.CursorTo(0, 1);

  // print the number of seconds since reset:

  DateTime now = rtc.now();
  GLCD.print(now.hour());
  GLCD.print(":");
  GLCD.print(now.minute());
  GLCD.print(":");
  GLCD.print(now.second());
  GLCD.print("  ");
 //GLCD.print(millis()/1000);  
    Serial.print(now.year(), DEC);
    Serial.print('/');
    Serial.print(now.month(), DEC);
    Serial.print('/');
    Serial.print(now.day(), DEC);
    Serial.print(" (");
    Serial.print(daysOfTheWeek[now.dayOfTheWeek()]);
    Serial.print(") ");
    Serial.print(now.hour(), DEC);
    Serial.print(':');
    Serial.print(now.minute(), DEC);
    Serial.print(':');
    Serial.print(now.second(), DEC);
    Serial.println();
    
    Serial.print(" since midnight 1/1/1970 = ");
    Serial.print(now.unixtime());
    Serial.print("s = ");
    Serial.print(now.unixtime() / 86400L);
    Serial.println("d");
    
    // calculate a date which is 7 days and 30 seconds into the future
    DateTime future (now + TimeSpan(7,12,30,6));
    
    Serial.print(" now + 7d + 30s: ");
    Serial.print(future.year(), DEC);
    Serial.print('/');
    Serial.print(future.month(), DEC);
    Serial.print('/');
    Serial.print(future.day(), DEC);
    Serial.print(' ');
    Serial.print(future.hour(), DEC);
    Serial.print(':');
    Serial.print(future.minute(), DEC);
    Serial.print(':');
    Serial.print(future.second(), DEC);
    Serial.println();
    
    Serial.println();
    delay(1000);
}
