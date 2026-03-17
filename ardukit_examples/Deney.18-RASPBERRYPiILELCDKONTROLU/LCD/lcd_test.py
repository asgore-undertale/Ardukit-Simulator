import RPi.GPIO as GPIO ## Import GPIO Library
import sys
sys.path.append('/home/pi/lcd')
import lcd
import time
GPIO.setmode(GPIO.BOARD) ## Use BOARD pin numbering
GPIO.setup(22, GPIO.OUT) ## Setup GPIO pin 7 to OUT
GPIO.setup(40, GPIO.OUT) ## Setup GPIO pin 7 to OUT
GPIO.output(40, False) ## Turn on GPIO pin 7
lcd.lcd_init()

##GPIO.output(22, True) ## Turn on GPIO pin 7
lcd.lcd_byte(lcd.LCD_LINE_1, lcd.LCD_CMD)
lcd.lcd_string("Raspberry Pi", 2)
lcd.lcd_byte(lcd.LCD_LINE_2, lcd.LCD_CMD)
lcd.lcd_string("Model B+", 2)
time.sleep(10)
lcd.GPIO.cleanup()
