from machine import Pin
from utime import sleep
import dht

# DHT class to simplify working with the sensor
class DHT:
    def __init__(self, pin: int):
        self.pin = self.setPin(pin)
        self.sensor = self.setDht(self.pin)

    def setDht(self, pin: Pin):
        return dht.DHT22(Pin(pin, Pin.OUT,Pin.PULL_UP))

    def setPin(self, pin: int):
        return Pin(pin)

    def measure(self):
        self.sensor.measure()

    def getTemperature(self):
        return self.sensor.temperature()

    def getHumidity(self):
        return self.sensor.humidity()

dht_sensor = DHT(16)
led = Pin(22, Pin.OUT)

print("Starting LED and sensor...")
while True:
    try:
        led.value(1) # Turn LED on 
        sleep(3) # Sleep 3 seconds

        print('\nReading values...')
        dht_sensor.measure()
        humidity = dht_sensor.getHumidity()
        temperature = dht_sensor.getTemperature()

        print(f"Temperature: {temperature:.1f}° C\nHumidity: {humidity:.1f}%")
        led.value(0) # Turn LED off 
    except OSError as e:
        print(f"Sensor error: {e}")
    except KeyboardInterrupt:
        break
    sleep(3)
led.off()
print("Finished.")