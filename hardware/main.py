from machine import Pin, unique_id
from utime import sleep, ticks_ms
import dht
import json

from config import MQTT_BROKER, MQTT_PASSWORD, MQTT_USERNAME, SSID, SSID_PASSWORD
from umqtt.simple import MQTTClient
import network

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


# Set up internal led
internalLed = Pin("LED", Pin.OUT)

# SSID settings
def connect(ssid, password):
    #Connect to WLAN
    try:
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        
        # Give WiFi module time to initialize
        sleep(2)
    
        # Disable power saving mode for better reliability with hotspots
        wlan.config(pm=0xa11140)

        print(f"Connecting to {ssid}...")
        wlan.connect(ssid, password)
        
        # Wait a bit longer for WPA2/WPA3 negotiation
        sleep(3)
        
        elapsed = 0
        while wlan.isconnected() == False:
            internalLed.toggle()
            status = wlan.status()
            
            elapsed+=1
            print(f"Waiting for connection... (elapsed: {elapsed}s, status: {status})")
            sleep(1)
        
        print("-> Connected to WiFi.")
        internalLed.on()
        
    except Exception as e:
        print("ERROR: Could not establish WiFi connection.")
        print(f"Connection error: {e}")
        return False

connect(SSID, SSID_PASSWORD)

# MQTT settings
MQTT_PORT = "8883"
CLIENT_ID="pico_w"
PUBLISH_TOPIC = b"mm225mz/sensors/dht"
SUBSCRIBE_TOPIC = b"mm225mz/commands/led"
ssl_params = {
    "server_hostname": MQTT_BROKER
}

# Open MQTT connection
mqttClient = MQTTClient(
    client_id=CLIENT_ID, 
    server=MQTT_BROKER, 
    user=MQTT_USERNAME.encode("utf-8"),password=MQTT_PASSWORD.encode("utf-8"), 
    keepalive=60, 
    port=8883,
    ssl=True, 
    ssl_params=ssl_params
    )
try:
    mqttClient.connect()
    print("-> Connected to MQTT broker.")
except Exception as e:
    print(f"Failed to connect: {e}")

# Set up MQTT subscription
def sub_cb(topic, msg):
    print(f'Callback message: {msg.decode()}')
    command = msg.decode().lower()
    if command == "on" or command == "1" :
        externalLed.on()
    elif command == "off" or command == "0":
        externalLed.off()
    else:
        print("ERROR: Could not process command.")
mqttClient.set_callback(sub_cb)
mqttClient.subscribe(SUBSCRIBE_TOPIC)

# Set up sensor and external led
dht_sensor = DHT(16)
externalLed = Pin(4, Pin.OUT)

print("Starting external led and sensor...")
while True:
    try:
        # Check subscription message
        mqttClient.check_msg()
        sleep(1)

        print('\nReading values...')
        dht_sensor.measure()
        humidity = dht_sensor.getHumidity()
        temperature = dht_sensor.getTemperature()

        print(f"Temperature: {temperature:.1f}° C\nHumidity: {humidity:.1f}%")
        sensorData = json.dumps({
            "temperature": temperature,
            "humidity": humidity
        })
        mqttClient.publish(topic=PUBLISH_TOPIC, msg=str(sensorData).encode(), retain=False, qos=0)
        sleep(1)
    except OSError as e:
        print(f"Sensor error: {e}")
    except KeyboardInterrupt:
        break
externalLed.off()
internalLed.off()
print("\nExiting...")
