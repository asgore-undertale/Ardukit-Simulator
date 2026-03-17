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
int dig2 = 0;
int dig3 = 0;
int dig4 = 0;
int DTime = 4;
int arti = 38;
int eksi = 39;
int bayrak = 0;
int bayrak2 = 0;





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
 
 
  if(digitalRead(arti)==HIGH&&bayrak==1)
  {
    delay(20);
    dig1=dig1+1;
    if(dig1>=10)
    {
    dig1=0;
    dig2=dig2+1;
    }

     if(dig2>=10)
    {
    dig2=0;
    dig3=dig3+1;
    }

     if(dig3>=10)
    {
    dig3=0;
    dig4=dig4+1;
    }

     if(dig4>=10)
    {
    dig1=0;
    dig2=0;
    dig3=0;  
    dig4=0;
    }
    bayrak=0;
    
    
  }
 if(digitalRead(arti)==LOW)bayrak=1;

 
 if(digitalRead(eksi)==HIGH&&bayrak2==1)
  {
    delay(20);
    dig1=dig1-1;
    if(dig1==-1)
    {
    dig1=9;
    dig2=dig2-1;
    }
    if(dig2==-1)
    {
    dig2=9;
    dig3=dig3-1;
    }
    if(dig3==-1)
    {
    dig3=9;
    dig4=dig4-1;
    }
    if(dig4==-1)
    {
    dig4=9;
    }
    bayrak2=0;
  } 
  if(digitalRead(eksi)==LOW)bayrak2=1;
  
   digitalWrite( GND4, HIGH);    //digit 4
  pickNumber(dig4);
  delay(DTime);
  digitalWrite( GND4, LOW);
  
  digitalWrite( GND3, HIGH);    //digit 3
  pickNumber(dig3);
  delay(DTime);
  digitalWrite( GND3, LOW);
  
  digitalWrite( GND2, HIGH);   //digit 2
  pickNumber(dig2);
  delay(DTime);
  digitalWrite( GND2, LOW);
  
  digitalWrite( GND1, HIGH);   //digit 1
  pickNumber(dig1);
  delay(DTime);
  digitalWrite( GND1, LOW);
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

