import serial
import time


ser = serial.Serial('/dev/ttyUSB0')
veri = ser.readline()[:-2]
print veri


