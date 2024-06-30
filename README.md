# Vivarium Monitoring

## Introduction

I have 3 ball pythons and I need to ensure they are temperature regulated, too hot and they will not thrive, too cold and they will sleep and eventually die from starvation.

### A quick introduction to Pythons
Pythons (Python Regius) are cold blooded reptiles originating from central Africa, which live in a vivarium (as it's normally too cold for them in the UK) with a heater on one side (known as the warm side) and hides on both the warm and opposite side (the cool side). This warm / cold side provides a gradient temperature shift between so allowing the snake to move freely between in order to regulate it's own temperature - [Sir David Attenborough](https://en.wikipedia.org/wiki/David_Attenborough) would be proud!

Snakes don't have eyelids, so need moisture in the air to protect their eyes, and keep them hydrated, at around 50% - 60% moisture content.

They are covered in overlapping scales which need to be shed approximately every 4-6 weeks, known as ecdysis.  End to end shedding cycles last about a week, and during this time it's best to have the moisture elevated (up to about 60% - 65% moisture), this aids in them shedding as the snake skin is moisturised.  If the moisture level is just right, the skin comes off in one.  If the moisture is too low, the skin comes off in chunks known as a"blow out", in which case you may need to intervene in order to remove any old skin which remains after the shed cycle has completed.

[Wikipedia](https://en.wikipedia.org/wiki/Ball_python) has some good stuff on Pythons, if you fancy a read.

As We need to measure the humidity across the vivarium and the temperature at both ends, we will need 2 sensors per vivarium - so by my maths, that's 6 temperature sensors (+ spares to replace any faulty ones).


## Plan
Create a temperature monitoring system which can monitor all the vivarium's, which I can check on using a browser.

Ball pythons need to ensure the temperature and humidity are always at the right levels.  So this project is starting life as a simple temperature/humidity sensor & recorder with web access, but over time could build up to include web-cams, temperature controller, over / under temperature alarms, door open sensors, you get the idea.


## Components
- [ESP32 with wifi and Bluetooth](https://www.amazon.co.uk/gp/product/B0811KLGDD) - Microcontroller.
- [External antenna (as wifi is not great on ESP32s)](https://www.amazon.co.uk/gp/product/B07FDN82D8)
- [DHT22 temperature/humidity probe](https://www.amazon.co.uk/gp/product/B08HCHVC3W) - 6 of them as a minimum.
- [10K resistors](https://www.amazon.co.uk/gp/product/B091LYNNT5) - one per DHT22.
- [16 GB Micro SD Card](https://www.amazon.co.uk/gp/product/B073K14CVB) - any capacity will be fine.
- [Micro SD Card Memory shield](https://www.amazon.co.uk/gp/product/B06X1DX5WS)
- [ESP32 Breakout board](https://www.amazon.co.uk/gp/product/B0CWR6BXT7)
- [Micro USB regualted power supply](https://www.amazon.co.uk/gp/product/B08ZMXJPLM)
- [wire](https://www.amazon.co.uk/gp/product/B07G72DRKC/)
- [USB A to Micro USB cable](https://www.amazon.co.uk/gp/product/B0711PVX6Z)
- [Crimping Tool and plugs](https://www.amazon.co.uk/gp/product/B0CT5TP9PC)
- Heatshrink

- Case - Need to rethink this.
- [Solderless Breadboard](https://www.amazon.co.uk/gp/product/B08V183BFJ/)

## Tools
I am not going to put links in here for the following, unless someone asks me.	
- Soldering Iron
- Solder
- side Snips
- Needle nose pliers
- Precision screwdriver
- Heat gun

## Software
### VSCode
- [Visual Studio Code](https://code.visualstudio.com/)
- [C++ 14](https://en.cppreference.com/w/cpp/14)
- [Platform IO Visual Studio Code Plugin](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide)

### Arduino IDE
- [Arduino IDE](https://www.arduino.cc/en/software)

### Libraries
- [Adafruit Unified Sensor](https://www.arduinolibraries.info/libraries/adafruit-unified-sensor) 
- [Arduino JSON](https://arduinojson.org/)
- [DHT Sensor Library](https://www.arduinolibraries.info/libraries/dht-sensor-library)
- SPI / SD

# Approach
## Simple Configuration
We will need to use the SD card for storing configuration / data. We need to ensure this is connected to the ESP32 and we have the right libraries installed so we can:

1. Read and parse a JSON configuration file.
2. Write the JSON configuration file back to SD card.
2. Create a folder to store data in, if it doesn't exist.
3. Create a CSV file to store the temperatures and humidities of all the attached sensors, which rolls over on a daily basis.
4. Delete any data files which are over a specific time period, as defined in the configuration.

The SD card will contain configuration information, which will be loaded once on boot-up.

## Temperature / Humidity sensors
We then need the ability to add one or more temperature / humidity sensors. Each sensor is connected to a specific GPIO port, this will need defining in the configuration.

Each sensor will be housed in a vivarium, and the vivarium will have a name and location.

Each sensor will have a location, and will need a min & max temperature and humidity.

Temperature data will be recorded to the SD card in predefined intervals (as defined in the configuration)

## Web interface to view the sensors 
A nice little webpage to allow me to view the sensors would be ideal.

We will use the Wi-Fi Manager library to create an ad-hoc Access Point so that the user can configure Wi-Fi access. Once configured it will store the Wi-Fi settings on the SD card

The webpage, JS and CSS will be stored on the SD card under a folder, so we can easily make amendments by putting it into a laptop and editing the files directly.

The webpage will display the current temperatures / humidities of the vivarium's and allow the user to view the history.

## Amend settings via web interface
It would be nice if the user could amend settings by using the web interface. This could be almost any part of the system (anything stored in the JSON configuration file).

Backup / Restore the configuration (to allow it to be downloaded / uploaded to the client) are also required.

We also need the ability to reboot / restore a factory configuration.

## Under / Over notification
Now that each sensor has a minimum and maximum temperature and humidity, we would like to provide the ability to turn an LED amber (warning) or red (error) when different incidents occur.

We will need to attach LED's or an RGB LED to accomplish this.

We could also attach a buzzer to sound audible warnings.

## Adding a screen
Adding a screen (or e-ink display) to display similar visuals to the web page would mean I don't need to take my phone out to check the temperatures.

# Process

## SD Card reader
Let's start with getting the SD reader connected and the ESP talking to it. The ESP uses a Serial Peripheral Interface (SPI) to do this.

SPI uses a synchronous serial connection, to ensure that the controller and peripheral are running at the same speed.

SPI uses the concept of Master / Slave (now redefined as Controller / Peripheral) to allow 2 devices to talk to each other.

The SPI has 6 pins.

### MISO / POCI
MISO = Master In/Slave Out, which has now replaced with POCI = Peripheral Out/Controller In.
	
This line accepts data from the peripheral which is sent to the controller.


### MOSI / PICO
MOSI = Master Out/Slave In, which has now replaced with PICO = Peripheral In/Controller Out
	
This line sends data from the controller to the peripheral.

### CLK / SCK
CLK (CLocK) is also knowns as the SCK (Serial ClocK). This line runs from the controller to the peripheral and is the clock speed of the controller. 

### CS
CS (Chip Select) line goes low when data is being sent in either from controller to peripheral or vice versa.

### VCC
This is the positive connector which should connect to the +5v (not the 3.3V, as this won't be enough to power it).  It provides power to the peripheral.

### GND
The GND (Ground) line allows a ground connector from the peripheral back to the controller.

**Note:** Some of the names have been redefined, the Open Source Hardware Association resolved to redefine SPI Signal Names as follows:
https://www.oshwa.org/a-resolution-to-redefine-spi-signal-names/


Using the crimp tool, I created a 6 pin female plug to connect to the end of the SD Shield leaving the other end of the cables bare so I can use the terminal connector on the Breakout Board as follows:

[IMAGE]

Now I connected the SD Breakout board pins back to the ESP in the following configuration:

| ESP | SD Card Reader  |
|---------|-------------|
| GPIO 19 | MISO / POCI |
| GPIO 23 | MOSI / PICO |
| GPIO 18 | CLK         |
| GND     | GND         |
| GPIO 5  | CS          |
| VCC     | 5v          |

[Image]

Once hooked up, load up the code in the `test/sd-card.ino` into Arduino IDE, select the correct board and port and upload it.  More to come on this process.
