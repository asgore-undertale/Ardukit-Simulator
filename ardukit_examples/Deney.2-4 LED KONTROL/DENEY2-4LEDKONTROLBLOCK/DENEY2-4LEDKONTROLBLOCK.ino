void setup()
{
  pinMode( 46 , OUTPUT);
  pinMode( 43 , OUTPUT);
  pinMode( 44 , OUTPUT);
  pinMode( 45 , OUTPUT);
}

void loop()
{
  digitalWrite( 46 , LOW );
  digitalWrite( 43 , HIGH );
  delay( 1000 );
  digitalWrite( 43 , LOW );
  digitalWrite( 44 , HIGH );
  delay( 1000 );
  digitalWrite( 44 , LOW );
  digitalWrite( 45 , HIGH );
  delay( 1000 );
  digitalWrite( 45 , LOW );
  digitalWrite( 46 , HIGH );
  delay( 1000 );
}


