import RPi.GPIO as GPIO
from time import sleep
GPIO.setmode(GPIO.BOARD)
GPIO.setup(5, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(40, GPIO.OUT)
try:
    while True:
        if GPIO.input(5):
            print "Port 3 lojik 1 - buton basılı"
            GPIO.output(40, False)
        else:
            print "Prt 3 lojik 0 - buton basılı değil"
            GPIO.output(40, True)
        sleep(0.1)
finally:
    GPIO.cleanup()

