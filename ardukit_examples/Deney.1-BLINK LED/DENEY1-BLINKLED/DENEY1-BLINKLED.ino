/*
  ArduKIT DENEY1-BLINKLED
  
  43 numaralı pine bağlı ledi 1 saniye aralıkla yakıp söndürür

  Uygulama Arduino BLINKLED örneğinden uyarlanmıştır.

  30/04/2016
 */


// setup fonksiyonu ile kullanılan pinler ve işlemci için ön ayarlamalar yapılır
void setup() {
  // 43 numaralı pin çıkış olarak ayarlanır
  pinMode(43, OUTPUT);
}

// loop fonksiyonu sürekli olarak çalışmasını istediğimiz işlemleri yaptığımız bölümdür 
void loop() {
  digitalWrite(43, HIGH);   // LED  çalışsın (HIGH gerilim seviyesinin Lojik 1 yani 5 V olmasını sağlar)
  delay(1000);              // 1 saniye bekleme (milisaniye cinsinden yazıyoruz) 
  digitalWrite(43, LOW);    // LED  sönsün (LOW gerilim seviyesinin Lojik 0 yani 0 V olmasını sağlar)
  delay(1000);              // 1 saniye bekleme (milisaniye cinsinden yazıyoruz) 
}
