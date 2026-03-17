/*
    ARDUKİT &&& RÖLE KONTROL UYGULAMASI
    BUTON İLE RÖLE KONTROLÜ; 38 numaralı pine bağlı butona basıldığında 
    6 numaralı pine bağlı olan Röle çalışır
    01/05/2016
 */
// programda kullanılan sabitler bu bölümde tanımlanır
const int role=6;
const int buton=38;

// programda kullanılan değişkenler bu bölümde tanımlanır
int i;         

// setup fonksiyonu ile kullanılan pinler ve işlemci için ön ayarlamaları yapılır
void setup() {
  // initialize digital pin 43-44-45-46 as an output.
  pinMode(role, OUTPUT);
  pinMode(buton, INPUT);

}

// loop fonksiyonu sürekli olarak çalışmasını istediğimiz işlemleri yaptığımız bölümdür 
void loop() {
 
  if(digitalRead (buton)==HIGH)
  {
  delay(20);
  digitalWrite(role,HIGH);
  }
  else 
  digitalWrite(role,LOW);
  }

