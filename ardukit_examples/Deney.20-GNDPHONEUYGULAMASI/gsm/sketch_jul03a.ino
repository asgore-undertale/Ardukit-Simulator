
#include <String.h>
 

// GPS DATASINI KONSOLA VERMEKTEDIR.


void setup()
{
  Serial.begin(115200);   
  Serial2.begin(115200);
  delay(500);
}
 
void loop()
{
 

  if (Serial2.available()){ // if the shield has something to say
    Serial.write(Serial2.read()); // display the output of the shield
  }
}




