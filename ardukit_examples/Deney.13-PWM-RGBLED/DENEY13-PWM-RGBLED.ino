/*
ArduKIT & PWM Uygulaması
PWM sinyali ile RGB led kontrolü ve 
buzzer ses şiddeti ayarlanmaktadır
Potansiyometre üzerinden okunan değer 
karakter LCD ekranda gösterilmekte ve
bu değer 4 e bölünerek 0-255 arasında 
PWM değeri oluşturulmaktadır. 
Basılan butona göre (38-39-40-41) PWM 
değeri farklı bir analog çıkışa yönlendirilir.
 */

// include the library code:
#include <LiquidCrystal.h>

// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(36, 37, 26, 27, 28, 29);
int pot=A8;
int red=3;
int green=4;
int blue=2;
int buzzer=5;
int mot1a=7;
int mot1b=8;
int analogdeger=0;
//const int butonlar[]={38,39,40,41};
void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("   GNDKITS");
  pinMode(38, INPUT);
  pinMode(39, INPUT);
  pinMode(40, INPUT);
  pinMode(41, INPUT);
  pinMode(mot1a, OUTPUT);
  pinMode(mot1b, OUTPUT);
}

void loop() {
  // Turn off the display:
  lcd.begin(16, 2);
  lcd.print("PWM= ");
 analogdeger=analogRead(pot);
 lcd.print(analogdeger);
 if(digitalRead (38)){
  analogWrite(mot1a, analogdeger/4);
      delay(2); 
   analogWrite(mot1b, 0);
      delay(2);    
       analogWrite(red, analogdeger/4);    
  delay(2);  

 }
  if(digitalRead (39)){
  analogWrite(mot1b, analogdeger/4);
      delay(2); 
   analogWrite(mot1a, 0);
      delay(2);    
   
  analogWrite(green, analogdeger/4); 
  delay(2);    
   

 }
  if(digitalRead (40)){
  analogWrite(mot1a, 0);
      delay(2); 
   analogWrite(mot1b, 0);
      delay(2);  
        analogWrite(blue, analogdeger/4); 
   delay(2);  
              analogWrite(buzzer, 0); 
   delay(2); 

 }
 if(digitalRead (41)){
  analogWrite(red, 0);    
  delay(2);  
   analogWrite(green, 0); 
  delay(2); 
  analogWrite(blue, 0); 
   delay(2);    
           analogWrite(buzzer, analogdeger/4); 
   delay(2); 

 }
 
}

