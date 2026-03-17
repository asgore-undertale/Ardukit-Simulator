void setup()
{
  pinMode( 38, INPUT);
  pinMode( 39, INPUT);
  pinMode( 40, INPUT);
  pinMode( 41, INPUT);
  pinMode( 43 , OUTPUT);
  pinMode( 44 , OUTPUT);
  pinMode( 45 , OUTPUT);
  pinMode( 46 , OUTPUT);
}

void loop()
{
  if (digitalRead(38))
  {
    delay( 20 );
    digitalWrite( 43 , HIGH );
  }
  else
  {
    digitalWrite( 43 , LOW );
  }
  if (digitalRead(39))
  {
    delay( 20 );
    digitalWrite( 44 , HIGH );
  }
  else
  {
    digitalWrite( 44 , LOW );
  }
  if (digitalRead(40))
  {
    delay( 20 );
    digitalWrite( 45 , HIGH );
  }
  else
  {
    digitalWrite( 45 , LOW );
  }
  if (digitalRead(41))
  {
    delay( 20 );
    digitalWrite( 46 , HIGH );
  }
  else
  {
    digitalWrite( 46 , LOW );
  }
}


