void setup()
{
  pinMode( 43 , OUTPUT);
  digitalWrite( 43 , LOW );

}

void loop()
{
  digitalWrite( 43 , HIGH );
  delay( 1000 );
  digitalWrite( 43 , LOW );
  delay( 1000 );
}


