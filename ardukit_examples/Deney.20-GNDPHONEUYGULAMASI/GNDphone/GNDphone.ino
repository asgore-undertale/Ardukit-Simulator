/* 
 GND TEKNİK  
 NEXTION HMI EKRAN ve GGS01 MODÜLÜ İLE ÖRNEK UYGULAMA
 BİLGİSAYARDAN VEYA HMI EKRAN ÜZERİNDEN İSTENİLEN NUMARA ARANABİLİR & MESAJ GÖNDERİLEBİLİR
 ARAMA İŞLEMİ  İÇİN a 5XXXXXXXXX ENTER (10 13) ŞEKLİNDE
 SMS GÖNDERMEK İÇİN m 5XXXXXXXXX MESAJ ENTER (10 13) ŞEKLİNDE 
 GPS VERİLERİ  İÇİN g ENTER (10 13) ŞEKLİNDE KOMUT VERİLMELİDİR. 
 
 GPS MODÜLÜNDEN GELEN VERİ İÇERİSİNDEN $GPRMC İLE BAŞLAYAN BÖLÜM SEÇİLEREK YORUMLANIR VE EKRANA AKTARILIR
 DİĞER KOD ÖRNEKLERİ İÇİN SIM28 DATASHEET İNCELENEBİLİR
 
                Table 2-10: RMC Data Format
                Example: $GPRMC,094330.000,A,3113.3156,N,12121.2686,E,0.51,193.93,171210,,,A*68<CR><LF>
                Name Example Unit Description
                Message ID $GPRMC RMC protocol header
                UTC Time 094330.000 hhmmss.sss
                Status [1] A A=data valid or V=data not valid
                Latitude 3113.3156 ddmm.mmmm
                N/S Indicator N N=north or S=south
                Longitude 12121.2686 dddmm.mmmm
                E/W Indicator E E=east or W=west
                Speed Over Ground 0.51 knots
                Course Over Ground 193.93 degrees True
                Date 171210 ddmmyy
                Magnetic Variation [2] degrees E=east or W=west
                East/West Indicator[2] E=east
                Mode A A=Autonomous,
                D=DGPS
                Checksum *68
                <CR><LF> End of message termination 
 
 4 USART BİRİMİ İÇERMESİ NEDENİYLE ARDUINO MEGA KULLANILMIŞTIR
 USART 0 - PC İLE HABERLEŞME İÇİN
 USART 1- GSM MODÜL İLE HABERLEŞMEK İÇİN
 USART 2- GPS MODÜL İLE HABERLEŞMEK İÇİN
 USART 3- HMI EKRAN İLE HABERLEŞMEK İÇİN KULLANILMIŞTIR

 UYGULAMANIN KULLANIM AMACI EĞİTİM İÇİN GELİŞTİRME ORTAMI SAĞLAMAKTIR BU NEDENLE KODLAR OPTİMİZE EDİLMEMİŞ
 BAZI İŞLEMLER İÇİN UZUN, ANLAMASI GÖRECELİ OLARAK DAHA KOLAY OLAN YÖNTEMLER KULLANILMIŞTIR

 UYGULAMANIZ DOĞRULTUSUNDA İSTEDİĞİNİZ BÖLÜMLERİ GÜNCELLEYİP PAYLAŞABİLİRSİNİZ  

 
*/ 
#include <String.h>
 
String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete

String inputString1 = "";         // a string to hold incoming data
boolean stringComplete1 = false;  // whether the string is complete

String inputString2 = "";         // a string to hold incoming data
boolean stringComplete2 = false;  // whether the string is complete

String inputString3 = "";         // a string to hold incoming data
boolean stringComplete3 = false;  // whether the string is complete

String telno;
String mesaj;
int sayac=0;
int komut=0;                       //  arama için: 'a' mesaj için 'm' gps için 'g'
String utc;                        //  gpsten alınan atom saati bilsini kaydedecek
String enlem;                      // Latitude (enlem) bilgisini kaydedecek
String boylam;                     // Longitude (boylam) bilgisini kaydedecek
String hiz;                        // Speed Over Ground (yere göre hız) bilgisini kaydedecek knot cinsinden
String aci;                        // Course Over Ground (açı) bilgisinin kaydedecek derece cinsinden
String tarih;                      // gps uydusundan alınan tarih bilgisini kaydedecek

int kod1=0;                       // gpsten gelen karakterler geçici olarak kod değişkenlerinde tutularak 
int kod2=0;                       // istediğimiz bölümlerin seçilmesi sağlanacak               
int kod3=0;
int kod4=0;
int kod5=0;
int kod6=0;
int kod7=0;
int kod8=0;
int kod9=0;

//String kod5;
//String kod6;
//char kod1;                          //
//char kod;


int gpsbayrak=0;                   // gps verisi sürekli geldiği için biz istediğimiz sürece güncellensin
void setup()
{
  Serial.begin(19200);    // seri0 bilgisayar ile iletişim için 
  Serial1.begin(19200);   // seri1 gsm modül ile iletişim için
  Serial2.begin(115200);  // seri2 gps modül ile iletişim için
  Serial3.begin(9600);    // seri3 hmi ekran ile iletişim için
  
  inputString.reserve(255);
  inputString1.reserve(255);
  inputString2.reserve(255);
  inputString3.reserve(266);
  telno.reserve(266);
  mesaj.reserve(266);
         
  delay(500);
}
 
void loop()
{ 
serialEvent(); //call the function
  if (stringComplete) {
     
  
    Serial.print(inputString);
   Serial.println();
    sayac=(inputString.length());
    inputString.remove(sayac-1,sayac);
    Serial3.print(inputString);
    Serial3.write(0xff);
    Serial3.write(0xff);
    Serial3.write(0xff);
    inputString = "";
    stringComplete = false;
    sayac=0;
  }

serialEvent1(); 
  if (stringComplete1) {
  Serial.println(inputString1);
  delay(100);
  Serial3.print("page bildiri");
  Serial3.write(0xff);
  Serial3.write(0xff);
  Serial3.write(0xff);
  delay(100);
  sayac=(inputString1.length());
  inputString1.remove(sayac-1,sayac);

  Serial3.print("bildiri1.txt=");
  Serial3.write(0x22); // " karakteri
  Serial3.print(inputString1);
  Serial3.write(0x22); // " karakteri
  Serial3.write(0xff);
  Serial3.write(0xff);
  Serial3.write(0xff);
 delay(100);


 Serial1.print("page bildiri");
  Serial1.write(0xff);
  Serial1.write(0xff);
  Serial1.write(0xff);
   delay(100);
  Serial.print("bildiri1.txt=");
  Serial.write(0x22); // " karakteri
  Serial.print(inputString1);
  Serial.write(0x22); // " karakteri
  Serial.write(0xff);
  Serial.write(0xff);
  Serial.write(0xff);
    inputString1 = "";
    stringComplete1 = false;
  }

  serialEvent2(); //call the function
  
  if (stringComplete2) {
  if (gpsbayrak==1){
    Serial.print("UTC SAAT:");
    Serial.println(utc);
    Serial.print("ENLEM   :");
    Serial.println(enlem);
    Serial.print("BOYLAM  :");
    Serial.println(boylam);
    Serial.print("HIZ     :");
    Serial.println(hiz);
    Serial.print("ACI     :");
    Serial.println(aci);
    Serial.print("TARIH   :");
    Serial.println(tarih);

    Serial3.print("gpsveri.txt=");
    Serial3.write(0x22); // " karakteri
    Serial3.print(utc);
    Serial3.print(enlem);
    Serial3.print(boylam);
    Serial3.print(hiz);
    Serial3.print(aci);
    Serial3.print(tarih);
    Serial3.write(0x22); // " karakteri
    Serial3.write(0xff);
    Serial3.write(0xff);
    Serial3.write(0xff);
    
       
    inputString2 = "";
    stringComplete2 = false;
    gpsbayrak=0;
   
  }
}

   serialEvent3(); 
   if (stringComplete3) {
switch(komut) // komuta göre işlem yap
  {
     case 'm': // if the character is 'm'
    Serial.println("MESAJ ATILIYOR");
    Serial.println(inputString3);
    SendTextMessage(); // send the text message
    inputString3 = "";
    stringComplete3 = false;
    break;

       
    case 'a': // if the character is 'a'
    DialVoiceCall(); // dial a number 
    Serial.println("ARAMA YAPILIYOR");
    Serial.println(inputString3);
    inputString3 = "";
    stringComplete3 = false;
    break;

       
     case 'g':  
    Serial.println("GPS VERISI ALINIYOR");
    Serial.println(inputString3);
    gpsbayrak=1;
    inputString3 = "";
    stringComplete3 = false;
    break; 
   }
    inputString3 = "";              // usart3 üzerinden farklı bir komut gelirse default işlem olarak komutu dikkate almadan mesajı silecek 
    stringComplete3 = false; 
 }
}

 
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == 10) {
      stringComplete = true;
    }
    if (stringComplete==false) {
    inputString += inChar;
    }
    }
}

void serialEvent1() {
  while (Serial1.available()) {
    char inChar = (char)Serial1.read();
    inputString1 += inChar;
    if (inChar == 13) {
      stringComplete1 = true;
    }
  }
}

void serialEvent2() {
  while (Serial2.available()) {
  char inChar = (char)Serial2.read();   //$GPRMC
   
      
     
   inputString2 += inChar;
   if (inChar == 10) {
//     String utc;                        //  gpsten alınan atom saati bilsini kaydedecek
//String enlem;                      // Latitude (enlem) bilgisini kaydedecek
//String boylam;                     // Longitude (boylam) bilgisini kaydedecek
//String hiz;                        // Speed Over Ground (yere göre hız) bilgisini kaydedecek knot cinsinden
//String aci;                        // Course Over Ground (açı) bilgisinin kaydedecek derece cinsinden
//String tarih;                      // gps uydusundan alınan tarih bilgisini kaydedecek
     
     
     kod1=(inputString2.indexOf('C'));    // $GPRMC den sonrasını almak için 'C' karakterinin yerini kod1 e kaydediyor 
//     
     inputString2.remove(0,kod1+2);      //  kod1 index değerine 2 ekleyerek utc saat bilgisinin başlangıcına ulaşıyor burdan itibaren paket başlayacak
     kod2=(inputString2.length());       //  gpsten gelen verinin kalan uzunluğu 
     kod3=(inputString2.indexOf('.'));   // saat bilgisinin bittiği index alınacak arayacak
     utc=inputString2; 
     utc.remove(kod3,kod2);
     kod4=(inputString2.indexOf('A'));   // veri doğru olarak gelmişse saat bilsinin salise kısmının sonu burdan sonra boylam bilgisi başlayacak
     inputString2.remove(0,kod4+2);
    
     kod2=(inputString2.length());
     kod5=(inputString2.indexOf('N')); // Siz S karakterini de kontrol edebilirsiniz
     enlem=inputString2; 
     enlem.remove(kod5,kod2);
     inputString2.remove(0,kod5+2);
     
     kod2=(inputString2.length());
     kod6=(inputString2.indexOf('E')); // Siz 'W' karakterini de kontrol edebilirsiniz
     boylam=inputString2; 
     boylam.remove(kod6,kod2);
     inputString2.remove(0,kod6+2);
     
     kod2=(inputString2.length());
     kod7=(inputString2.indexOf(','));
     hiz=inputString2;
     hiz.remove(kod7,kod2);
     inputString2.remove(0,kod7+1);

     kod2=(inputString2.length()); 
     kod8=(inputString2.indexOf(',')); 
     aci=inputString2;
     aci.remove(kod8,kod2);
     inputString2.remove(0,kod8+1);
     

     kod2=(inputString2.length()); 
     kod9=(inputString2.indexOf(',')); 
     tarih=inputString2;
     tarih.remove(kod9,kod2);
     inputString2.remove(0,kod9+1);
      

     
     stringComplete2 = true;
   
   
   }
       
  }
}


void serialEvent3() {
  while (Serial3.available()) {
    char inChar = (char)Serial3.read();
    if (inChar == 13) {
      stringComplete3 = true;
      sayac=0;
    }
    if (stringComplete3==false) {
    inputString3 += inChar;
    sayac=sayac+1;
    if (sayac==1) {       // eğer ilk karakter geldiyse
   komut=inChar;          // bu karakter komut stringine aktarılsın 
   inputString3="";       // gönderilen komutla diğer bilgiler birbirine karışmasın
    }
    }
  }
}


void SendTextMessage()
{
    sayac=(inputString3.length());      // mesaj uzunluğunu bulur
    inputString3.remove(sayac-1,sayac); // gelen mesajın sonuna eklenen yeni satır ve satır başı gibi karakterleri siler

    telno=inputString3;               // gelen mesajı telno değişkenine aktarır
    telno.remove(10,sayac);           // ilk 10 karakteri almak için 10. karakterden sonrasını siler
 
    mesaj=inputString3;               // gelen mesajı mesaj değişkenine aktarır
    mesaj.remove(0,10);               // gönderilecek mesajı bulmak için ilk 10 karakteri siler
                                      // daha global bir çözüm için telno ve mesaj bilgisi farklı komutlar ile gönderilebilir
  
  Serial.println(telno);
  Serial.println(mesaj);
  Serial.println("Sending Text...");
  Serial1.print("AT+CMGF=1\r"); // Set the shield to SMS mode
  delay(100);
  Serial1.print("AT+CMGS = \"+90");
  Serial1.print(telno);
  Serial1.println("\"");
  delay(100);
  Serial1.println(mesaj); //the content of the message
  delay(100);
  Serial1.print((char)26);//the ASCII code of the ctrl+z is 26 (required according to the datasheet)
  delay(100);
  Serial1.println();
  Serial.println("Text Sent.");

  Serial.print("AT+CMGS = \"+90");
  Serial.print(telno);
  Serial.println("\"");
 
  delay(100);
  Serial.println(mesaj); //the content of the message
  delay(100);
  Serial.print((char)26);//the ASCII code of the ctrl+z is 26 (required according to the datasheet)
  delay(100);
  Serial.println();
  Serial.println("Text Sent.");
  komut=0;
}
 



void DialVoiceCall()
{
  sayac=(inputString3.length());      // mesaj uzunluğunu bulur
  inputString3.remove(sayac-1,sayac); // gelen mesajın sonuna eklenen yeni satır ve satır başı gibi karakterleri siler
  inputString3+=";";                  // aramanın başlaması için ";" karakterini numaranın sonuna ekler  
  Serial1.print("ATD+90");//dial the number, must include country code
  Serial1.print(inputString3);
  Serial1.println();
  delay(100);
  Serial1.println();
  Serial.print("ATD+90");//dial the number, must include country code
  Serial.print(inputString3);
  Serial.println();
  komut=0;

}




