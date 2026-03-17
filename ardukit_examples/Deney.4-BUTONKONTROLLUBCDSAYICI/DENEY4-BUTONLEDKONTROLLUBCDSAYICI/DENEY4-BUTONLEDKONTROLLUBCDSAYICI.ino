/*
  ArduKIT DENEY4-BUTONKONTROLLUBCDSAYICI
  
  43-44-45-46 numaralı pine bağlı ledleleri
  38-39-40-41 numaralı pinlere bağlı butonlar ile kontrol eder

  Uygulama Arduino BUTTON örneğinden uyarlanmıştır.

  30/04/2016
 */
// programda kullanılan sabitler bu bölümde tanımlanır
const int ledler[]={43,44,45,46};
const int arti=38;
const int eksi=39;
// programda kullanılan değişkenler bu bölümde tanımlanır
int deger = 0;         // sayma değerinin tutulacağı değişken

// setup fonksiyonu ile kullanılan pinler ve işlemci için ön ayarlamalar yapılır
void setup() {
 // 43-44-45-46 numaralı pinler çıkış, 38-39 numaralı pinler giriş olarak tanımlanır
  pinMode(ledler[0], OUTPUT);
  pinMode(ledler[1], OUTPUT);
  pinMode(ledler[2], OUTPUT);
  pinMode(ledler[3], OUTPUT);
  pinMode(38, INPUT);
  pinMode(39, INPUT);
  
}

// loop fonksiyonu sürekli olarak çalışmasını istediğimiz işlemleri yaptığımız bölümdür 
void loop() {
  // basılan butona göre değer değişkenini arttırıp azaltacağız ledler ile 0-9 arası BCD sayma değerini göstereceğiz.
  if(digitalRead(arti)==HIGH)       // eğer arti butonuna basıldı ise
  {
    delay(20);                      // 20 ms elektriksel parazitin ortadan kalkmasını bekler
    deger=deger+1;                  // değer değişkenini bir arttırır
    if(deger>=10)deger=0;           // değer 10 a eşitse yani 9 dan yukarı çıktıysak 0 a eşitler
    while(digitalRead(arti)==HIGH); // butona basıldığında değerin bir kere değişmesi için bırakılmasını bekler 
  }
 if(digitalRead(eksi)==HIGH)        // eğer eksi butonuna basıldı ise
  {
    delay(20);                      // 20 ms elektriksel parazitin ortadan kalkmasını bekler
    deger=deger-1;                  // değer değişkenini bir azaltır 
    if(deger==-1)deger=9;           // değer -1 e eşitse yani 0 dan aşağı indiysek 9 a eşitler  
    while(digitalRead(eksi)==HIGH); // butona basıldığında değerin bir kere değişmesi için bırakılmasını bekler 
  }
  switch(deger){                             // değer değişkeninin içeriğine göre yanacak ve ya sönecek ledleri belirler

     case 0 :                               // deger==0 ise ledler=0000
            digitalWrite(ledler[0],LOW);
            digitalWrite(ledler[1],LOW);
            digitalWrite(ledler[2],LOW);
            digitalWrite(ledler[3],LOW);
            break;

     case 1 :                               // deger==1 ise ledler=0001
            digitalWrite(ledler[0],HIGH);
            digitalWrite(ledler[1],LOW);
            digitalWrite(ledler[2],LOW);
            digitalWrite(ledler[3],LOW);
            break;        
      case 2 :                              // deger==2 ise ledler=0010
            digitalWrite(ledler[0],LOW);
            digitalWrite(ledler[1],HIGH);
            digitalWrite(ledler[2],LOW);
            digitalWrite(ledler[3],LOW);
            break;
      case 3 :                              // deger==3 ise ledler=0011
            digitalWrite(ledler[0],HIGH);
            digitalWrite(ledler[1],HIGH);
            digitalWrite(ledler[2],LOW);
            digitalWrite(ledler[3],LOW);
            break;
            
      case 4 :                              // deger==4 ise ledler=0100
            digitalWrite(ledler[0],LOW);
            digitalWrite(ledler[1],LOW);
            digitalWrite(ledler[2],HIGH);
            digitalWrite(ledler[3],LOW);
            break;

      case 5 :                              // deger==5 ise ledler=0101
            digitalWrite(ledler[0],HIGH);
            digitalWrite(ledler[1],LOW);
            digitalWrite(ledler[2],HIGH);
            digitalWrite(ledler[3],LOW);
            break;

      case 6 :                              // deger==6 ise ledler=0110
            digitalWrite(ledler[0],LOW);
            digitalWrite(ledler[1],HIGH);
            digitalWrite(ledler[2],HIGH);
            digitalWrite(ledler[3],LOW);
            break;
      case 7 :                              // deger==7 ise ledler=0111
            digitalWrite(ledler[0],HIGH);
            digitalWrite(ledler[1],HIGH);
            digitalWrite(ledler[2],HIGH);
            digitalWrite(ledler[3],LOW);
            break;     
      case 8 :                              // deger==8 ise ledler=1000
            digitalWrite(ledler[0],LOW);
            digitalWrite(ledler[1],LOW);
            digitalWrite(ledler[2],LOW);
            digitalWrite(ledler[3],HIGH);
            break;
      case 9 :                             // deger==9 ise ledler=1001
            digitalWrite(ledler[0],HIGH);
            digitalWrite(ledler[1],LOW);
            digitalWrite(ledler[2],LOW);
            digitalWrite(ledler[3],HIGH);
            break;
  
  }
  
  
 
 
  }

