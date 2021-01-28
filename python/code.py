import sys
from gpiozero import LED

from pygame import mixer


led = LED(26)
while True:
    data = input()
    if (str(data) == "LED_ON"):
        led.on()
        
    if (data == "LED_OFF"):
        led.off()
        
    if (data == "SOUND_NEWMESSAGE"):
        mixer.init()
        mixer.music.load('/home/pi/Documents/Eindwerk_STEM/eindwerk-interface/python/sample.wav')
        mixer.music.play()
