int aPin = 22;  //         A
int bPin = 23;  //      ________
int cPin = 24;  //     |        |
int dPin = 25;  //   F |        |  B
int ePin = 26;  //     |    G   |
int fPin = 27;  //     |________|
int gPin = 28;  //     |        |
int hpin = 29;  //     |        |
int GND1 = 33;  //     |        |
int GND2 = 34;  //   E |        | C
int GND3 = 35;  //     |________|   DP(H)
int GND4 = 36;  //        D
        
int dig1 = 0;
int arti = 38;
int eksi = 39;





void setup()
{
  pinMode(aPin, OUTPUT);
  pinMode(bPin, OUTPUT);
  pinMode(cPin, OUTPUT);
  pinMode(dPin, OUTPUT);
  pinMode(ePin, OUTPUT);  
  pinMode(fPin, OUTPUT);
  pinMode(gPin, OUTPUT);
  pinMode(GND1, OUTPUT);
  pinMode(GND2, OUTPUT);
  pinMode(GND3, OUTPUT);
  pinMode(GND4, OUTPUT);
  pinMode(arti, INPUT);
  pinMode(eksi, INPUT);
}
 void loop()
{
  digitalWrite( GND1, HIGH);
  digitalWrite( GND2, LOW);
  digitalWrite( GND3, LOW);
  digitalWrite( GND4, LOW);
 
  if(digitalRead(arti)==HIGH)
  {
    delay(20);
    dig1=dig1+1;
    if(dig1>=10)dig1=0;
    pickNumber(dig1);
    while(digitalRead(arti)==HIGH);
  }
 if(digitalRead(eksi)==HIGH)
  {
    delay(20);
    dig1=dig1-1;
    if(dig1==-1)dig1=9;
     pickNumber(dig1);
    while(digitalRead(eksi)==HIGH);
  } 
  
   pickNumber(dig1);
}
  
void pickNumber(int x){
   switch(x){
     case 1: one(); break;
     case 2: two(); break;
     case 3: three(); break;
     case 4: four(); break;
     case 5: five(); break;
     case 6: six(); break;
     case 7: seven(); break;
     case 8: eight(); break;
     case 9: nine(); break;
     default: zero(); break;
   } 
}

void clearLEDs()
{   
  digitalWrite(  2, LOW); // A
  digitalWrite(  3, LOW); // B
  digitalWrite(  4, LOW); // C
  digitalWrite(  5, LOW); // D
  digitalWrite(  6, LOW); // E
  digitalWrite(  7, LOW); // F
  digitalWrite(  8, LOW); // G 
}

void one()
{
  digitalWrite( aPin, LOW); 
  digitalWrite( bPin, HIGH);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, LOW); 
  digitalWrite( ePin, LOW); 
  digitalWrite( fPin, LOW); 
  digitalWrite( gPin, LOW); 
}

void two()
{
  digitalWrite( aPin, HIGH); 
  digitalWrite( bPin, HIGH);
  digitalWrite( cPin, LOW); 
  digitalWrite( dPin, HIGH); 
  digitalWrite( ePin, HIGH); 
  digitalWrite( fPin, LOW); 
  digitalWrite( gPin, HIGH); 
}

void three()
{
  digitalWrite( aPin, HIGH); 
  digitalWrite( bPin, HIGH);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, HIGH); 
  digitalWrite( ePin, LOW); 
  digitalWrite( fPin, LOW); 
  digitalWrite( gPin, HIGH); 
}

void four()
{
  digitalWrite( aPin, LOW); 
  digitalWrite( bPin, HIGH);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, LOW); 
  digitalWrite( ePin, LOW); 
  digitalWrite( fPin, HIGH); 
  digitalWrite( gPin, HIGH); 
}

void five()
{
  digitalWrite( aPin, HIGH); 
  digitalWrite( bPin, LOW);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, HIGH); 
  digitalWrite( ePin, LOW); 
  digitalWrite( fPin, HIGH); 
  digitalWrite( gPin, HIGH); 
}

void six()
{
  digitalWrite( aPin, HIGH); 
  digitalWrite( bPin, LOW);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, HIGH); 
  digitalWrite( ePin, HIGH); 
  digitalWrite( fPin, HIGH); 
  digitalWrite( gPin, HIGH); 
}

void seven()
{
  digitalWrite( aPin, HIGH); 
  digitalWrite( bPin, HIGH);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, LOW); 
  digitalWrite( ePin, LOW); 
  digitalWrite( fPin, LOW); 
  digitalWrite( gPin, LOW); 
}

void eight()
{
  digitalWrite( aPin, HIGH); 
  digitalWrite( bPin, HIGH);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, HIGH); 
  digitalWrite( ePin, HIGH); 
  digitalWrite( fPin, HIGH); 
  digitalWrite( gPin, HIGH); 
}

void nine()
{
  digitalWrite( aPin, HIGH); 
  digitalWrite( bPin, HIGH);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, HIGH); 
  digitalWrite( ePin, LOW); 
  digitalWrite( fPin, HIGH); 
  digitalWrite( gPin, HIGH); 
}

void zero()
{
  digitalWrite( aPin, HIGH); 
  digitalWrite( bPin, HIGH);
  digitalWrite( cPin, HIGH); 
  digitalWrite( dPin, HIGH); 
  digitalWrite( ePin, HIGH); 
  digitalWrite( fPin, HIGH); 
  digitalWrite( gPin, LOW); 
}

