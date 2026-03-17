import serial
import time


ser = serial.Serial('/dev/ttyUSB0')
while True:
veri = ser.readline()[:-2]
veriler = veri.split(“,”)
print veriler




