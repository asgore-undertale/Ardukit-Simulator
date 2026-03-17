/*
  ArduKIT & Grafik LCD Uygulaması
 *  openGLCD Library - Hello World uygulamasından esinlenilmiştir
 05/05/2016
 * 
 * 

 *  2013-06-15 bperrybap   - updates for openGLCD
 *  2011-09-14 Bill Perry  - original creation
 *  	bperrybap@opensource.billsworld.billandterrie.com
 */


#include <openGLCD.h>

void setup()
{
   pinMode(31, OUTPUT);//BACKLIGHT
   digitalWrite(31, HIGH);
   pinMode(32, OUTPUT);//RST
   digitalWrite(32, LOW);
  // GLCD Hazırlanıyor
  GLCD.Init();

 // Yazı için kullanılacak font seçiliyor
  GLCD.SelectFont(System5x7);

  GLCD.print("GNDKITS DENEY SETLERI"); 
}

void loop()
{
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  GLCD.CursorTo(0, 1);

  // print the number of seconds since reset:
  GLCD.print(millis()/1000);
}
