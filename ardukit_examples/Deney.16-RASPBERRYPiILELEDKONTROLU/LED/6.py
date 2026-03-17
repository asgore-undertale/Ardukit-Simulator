from gpiozero import LED
from time import sleep

led0 = LED(19)
led1 = LED(20)
led2 = LED(21)
led3 = LED(22)

while True:
    led0.on()
    sleep(0.5)
    led0.off()
    
    led1.on()
    sleep(0.5)
    led1.off()
    
    led2.on()
    sleep(0.5)
    led2.off()
    
    led3.on()
    sleep(0.5)
    led3.off()

