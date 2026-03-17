/*
ArduKIT DENEY2-4LEDKONTROL
  
  43-44-45-46 numaralı pinlere bağlı ledleri 1 saniye aralıkla yakıp söndürür

  Uygulama Arduino BLINKLED örneğinden uyarlanmıştır.

  30/04/2016
 */


// setup fonksiyonu ile kullanılan pinler ve işlemci için ön ayarlamalar yapılır
void setup() {
  // 43-44-45-46  numaralı pinler çıkış olarak ayarlanır
  pinMode(43, OUTPUT);
  pinMode(44, OUTPUT);
  pinMode(45, OUTPUT);
  pinMode(46, OUTPUT);
}

//  loop fonksiyonu sürekli olarak çalışmasını istediğimiz işlemleri yaptığımız bölümdür 
void loop() {
  digitalWrite(46, LOW);    // 4. LED  sönsün (LOW gerilim seviyesinin Lojik 0 yani 0 V olmasını sağlar)
  digitalWrite(43, HIGH);   // 1. LED  çalışsın (HIGH gerilim seviyesinin Lojik 1 yani 5 V olmasını sağlar)
  delay(1000);              // 1 saniye bekleme (milisaniye cinsinden yazıyoruz)
  digitalWrite(43, LOW);    // 1. LED  sönsün (LOW gerilim seviyesinin Lojik 0 yani 0 V olmasını sağlar)
  digitalWrite(44, HIGH);   // 2. LED  çalışsın (HIGH gerilim seviyesinin Lojik 1 yani 5 V olmasını sağlar)
  delay(1000);              // 1 saniye bekleme (milisaniye cinsinden yazıyoruz)
  digitalWrite(44, LOW);    // 2. LED  sönsün (LOW gerilim seviyesinin Lojik 0 yani 0 V olmasını sağlar)
  digitalWrite(45, HIGH);   // 3. LED  çalışsın (HIGH gerilim seviyesinin Lojik 1 yani 5 V olmasını sağlar)
  delay(1000);              // 1 saniye bekleme (milisaniye cinsinden yazıyoruz)
  digitalWrite(45, LOW);    // 3. LED  sönsün (LOW gerilim seviyesinin Lojik 0 yani 0 V olmasını sağlar)
  digitalWrite(46, HIGH);   // 4. LED  çalışsın (HIGH gerilim seviyesinin Lojik 1 yani 5 V olmasını sağlar)
  delay(1000);              // 1 saniye bekleme (milisaniye cinsinden yazıyoruz)
}
