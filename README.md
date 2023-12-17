# Vivarium Monitoring

## Introduction

I have 3 ball pythons and I need to ensure they are temperature regulated, too hot and they will not thrive, too cold and they will sleep and eventually die through not eating.

### A quick introduction to Pythons
Pythons (Python Regius) are cold blooded reptiles originating from central Africa, which live in a vivarium (as it's normally too cold for them in the UK) with a heater on one side (known as the warm side) and hides on both the warm and opposite side (the cool side). This warm / cold side provides a gradient temperature shift between so allowing the snake to move freely between in order to regulate it's own temperature - Sir David Attenborough would be proud!

Snakes don't have eyelid, so need moisture in the air to protect their eyes, and keep them hydrated, at around 50% - 60% moisture content.

They are covered in overlapping scales which need to be shed approximately every 4-6 weeks, known as ecdysis.  End to end shedding cycles last about a week, and during this time it's best to have the moisture elevated (up to about 80% moisture), this aids in them shedding as the snake skin is moisturised.  If the moisture is fine, the skin comes off in one.  If the moisture is too low, the skin comes off in chunks in a "blow out", in which case you may need to intervene in order to remove any old skin which remains after the shed has completed.

[Wikipedia](https://en.wikipedia.org/wiki/Ball_python) has some good stuff on Pythons, if you fancy a read.

As We need to measure the humidity across the vivarium and the temperature at both ends, we will need 2 sensors per vivarium - so by my maths, that's 6 temperature sensors (+ spares to replace any faulty ones).


## Plan
Create a temperature monitoring system which can monitor all the vivarium's, which I can check on a local website using a browser.

Ball pythons need to ensure the temperature and humidity are always at the right levels.  So this project is starting life as a simple temperature/humidity sensor & recorder with web access, but over time could build up to include web-cams, temperature controller, over / under temperature alarms, door open sensors, you get the idea.


## Components
- [ESP32 with wifi and Bluetooth](https://www.amazon.co.uk/gp/product/B0811KLGDD)
- [External antenna (as wifi is not great on ESP32s)](https://www.amazon.co.uk/gp/product/B07FDN82D8)
- [DHT22 temperature/humidity probe](https://www.amazon.co.uk/gp/product/B08HCHVC3W)
- [10K resistors](https://www.amazon.co.uk/gp/product/B091LYNNT5) - one per DHT22.
- [16 GB Micro SD Card](https://www.amazon.co.uk/gp/product/B073K14CVB)
- [Micro SD Card Memory shield](https://www.amazon.co.uk/gp/product/B06X1DX5WS)
- [Case](https://www.amazon.co.uk/gp/product/B0C951LHBK)
- [Solderless Breadboard](https://www.amazon.co.uk/gp/product/B08V183BFJ/)
- [wire](https://www.amazon.co.uk/gp/product/B07G72DRKC/)
- [Micro USB regualted power supply](https://www.amazon.co.uk/gp/product/B08ZMXJPLM)
- [USB A to Micro USB cable](https://www.amazon.co.uk/gp/product/B0711PVX6Z)

## Tools
I am not going to put links in here for the following, unless someone asks me.	
- Soldering Iron
- Solder
- Snips
- Needle nose pliers

## Software
- [Visual Studio Code](https://code.visualstudio.com/)
- [C++ 14](https://en.cppreference.com/w/cpp/14)
- [Platform IO Visual Studio Code Plugin](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide)

### Libraries
- [Adafruit Unified Sensor](https://www.arduinolibraries.info/libraries/adafruit-unified-sensor) 
- [Arduino JSON](https://arduinojson.org/)
- [DHT Sensor Library](https://www.arduinolibraries.info/libraries/dht-sensor-library)

# Approach
Each vivarium will need 2 sensors attached to it (one for the hot side, one for the cool side).

Each vivarium will need a location and a name.

Each sensor will need a min / max temperature and humidity.

If the temperature / humidity goes below the min or over the the max - we need to signal this through the use of the LED. This will look to be extended to include a buzzer, push to phone, etc.

Using the button we should be able to reset the warning for a period of time.

The SD card will contain configuration information, which will be loaded once on boot-up.

Temperatures will be recorded to the SD card, and I will look to expand this to push them to an API going forward so I can visualise the data.

# Beyond basics
Once we have the basics dowm, I would like to extend this to have online data backup, web interface for changing settings / viewing the current state, push notification to my phone via an approved app.  I would also like a touchscreen UI to sit on top of the vivaria.
