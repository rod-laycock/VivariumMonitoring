# Vivarium Monitoring

## Introduction

I have 3 ball pythons and I need to ensure they are temperature regulated, too hot and they will not thrive, too cold and they will sleep and eventually die from starvation.

### A quick introduction to Pythons
Pythons (Python Regius) are cold blooded reptiles originating from central Africa, which live in a vivarium (as it's normally too cold for them in the UK) with a heater on one side (known as the warm side) and hides on both the warm and opposite side (the cool side). This warm / cold side provides a gradient temperature shift between so allowing the snake to move freely between in order to regulate it's own temperature - [Sir David Attenborough](https://en.wikipedia.org/wiki/David_Attenborough) would be proud!

Snakes don't have eyelids, so need moisture in the air to protect their eyes, and keep them hydrated, at around 50% - 60% moisture content.

They are covered in overlapping scales which need to be shed approximately every 4-6 weeks, known as ecdysis.  End to end shedding cycles last about a week, and during this time it's best to have the moisture elevated (up to about 60% - 65% moisture), this aids in them shedding as the snake skin is moisturised.  If the moisture level is just right, the skin comes off in one.  If the moisture is too low, the skin comes off in chunks known as a"blow out", in which case you may need to intervene in order to remove any old skin which remains after the shed cycle has completed.

[Wikipedia](https://en.wikipedia.org/wiki/Ball_python) has some good stuff on Pythons, if you fancy a read.

As We need to measure the humidity across the vivarium and the temperature at both ends, we will need 2 sensors per vivarium - so by my maths, that's 6 temperature sensors (+ spares to replace any faulty ones).

## Disclosure
In the interest of being completely open and transparent, and as I don't believe in being underhanded, dishonest or hiding any facts. The following links in the Components and Tools sections are setup to take you to Amazon via their [Amazon Affiliate Programme](https://affiliate-program.amazon.co.uk/), and every purchase you make using them will mean I get a small amount back without plastering ads all over the place. 

These are not the most expensive products, I have intentionally tried to keep the costs down for you and as I find alternative products will revise these.

The only reason I am doing this is to give you a chance to show me that you appreciate the content I am producing and if you find it helpful, give a little back to me which doesn't come out of your own pocket.


## Components
Here is a list of components used in the creation of this project, you can probably source them from elsewhere (please see Disclosure above).

- [ESP32 with Wi-Fi and Bluetooth](https://amzn.to/4dJF6OY)
- [External antenna (as wifi is not great on ESP32s)](https://amzn.to/3Z70iun)
- [DHT22 temperature/humidity probe](https://amzn.to/4fM44iu) - I will need 6 of them as a minimum.
- [10K resistors](https://amzn.to/3YI2yYG) - one per DHT22.
- [16 GB Micro SD Card](https://amzn.to/3M6ShxA) - any capacity will be fine.
- [Micro SD Card Memory shield](https://amzn.to/4coMgag)
- [ESP32 Breakout board](https://amzn.to/4cxb2Fl)
- [Micro USB regualted power supply](https://amzn.to/3yExMFx)
- [Wire](https://amzn.to/4ct728Q)
- [USB A to Micro USB cable](https://amzn.to/3SS83Ak)
- [1/2 inch Heat shrink tubing](https://amzn.to/3Xij9kR)
- Case - I need to build it before I recommend a case.
- [Solderless Breadboard](https://amzn.to/4cuTYQh)

## Tools
Here is a list of tools used in the creation of this project, you can probably source them from elsewhere (please see Disclosure above).

- [Soldering Iron Kit](https://amzn.to/3ABCHr8)
- [Side Snips](https://amzn.to/46OzmRI)
- [Needle nose pliers](https://amzn.to/4cud3Sv)
- [Flathead Precision screwdriver](https://amzn.to/4ctQ0XV)
- [Heat Gun](https://amzn.to/46ROyxF)
- [Wire strippers](https://amzn.to/3SUmC6t)
- [Crimping Tool and plugs](https://amzn.to/3yJ4buw)

## Software
So I'm running [Ubuntu Linux](https://www.ubuntu.com) as my primary operating system, so I'm going to provide instructions based upon this.

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

# Approach
Using the following as rough plan of action.

## Temperature / Humidity sensors
We then need the ability to add one or more temperature / humidity sensors. Each sensor is connected to a specific GPIO port, this will need defining in the configuration.

Each sensor will be housed in a vivarium, and the vivarium will have a name and location.

Each sensor will have a location, and will need a min & max temperature and humidity.

Temperature data will be recorded to the SD card in predefined intervals (as defined in the configuration)

More detailed instructions on the sensors and how to connect the sensors can be found [here](./docs/dht22.md)

Now we need some code to be able to read the temperature and display it on a web interface.



## Simple Configuration
We will need to use the SD card for storing configuration / data. We need to ensure this is connected to the ESP32 and we have the right libraries installed so we can:

1. Read and parse a JSON configuration file.
2. Write the JSON configuration file back to SD card.
2. Create a folder to store data in, if it doesn't exist.
3. Create a CSV file to store the temperatures and humidities of all the attached sensors, which rolls over on a daily basis.
4. Delete any data files which are over a specific time period, as defined in the configuration.

The SD card will contain configuration information, which will be loaded once on boot-up.

To connect the card reader use the following [instructions](./docs/sdcard.md)


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

## Adding a display
Adding a screen (or e-ink digusplay) to display similar visuals to the web page would mean I don't need to take my phone out to check the temperatures.



## Plan
Start small - make it big.

### Step 1
Start by creating a simple temperature and humidity monitoring which can monitor one vivarium, which I can check on using a browser over my local Wi-Fi network. 

To do this, we will need to connect the DHT22 to the ESP32 as per this [document](docs/dht22.md)

### Step 2
Add an SD Card to the project to store the website so I'm using less memory on the ESP32.

### Step 3
Move the settings into a configuration file on the SD Card, have the startup process read the settings and initialise itself.

### Step 4
Add additional sensors (I have 3 pythons so need 6 sensors in total), all configured through the SD Card and all visible on the interface. It should not matter how many sensors I add, it should all just work.

### Step 5
Add an initialisation routine so that when the monitor starts up to begin with it creates it's own local network so you can connect to it and configure it.

### Step 6
Store and view historic data on the SD card - ensuring it does not run out of disk space, so self cleaning is needed.

### Step 7
Add the ability to reconfigure certain parts of the system through a web based admin interface.

### Step 8
Add more steps once I've completed this lot.


