from gpiozero import LED

led = LED(22)
led.blink(0.5, 0.5) # On time, off time


input()
