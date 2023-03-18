# VivariumMonitoring

## Introduction

I have 3 ball pythons and I need to ensure they are temperature regulated, too hot and they will not thrive, too cold and they will sleep and eventually die through not eating.

## Plan
Create a temperature monitoring system which can monitor all the vivariums, which I can check on a local website using a browser.

I will also need an colour coded LED to inform me if there is an issue.

I decided against a screen as it will sit in the corner and use very little power and I don't want a screen on all the time.

# Components
ESP32
DHT22 Temp / Humidity Sensors - one per item to monitor
100K Ohm Resistors - one per DHT22 sesnsor
Micro SD Card
Micro SD Card Memory shield
Button
Case
Tri Colour LED
Breadboard / PCB / ESP32 Microcontroller Development Board
Wire
Micro USB regualted power supply

# Software
Visual Studio Code
C++ 14+
Platform IO Visual Studio Code Plugin

## Libraries
Adafruit Unified Sensor
Arduino JSON
DHT Sensor Library

# Approach
Each vivarium will need 1 or more sensors attached to it (one for the hot side, one for the cool side).

Each vivarium will need a location and a name.

Each sensor will need a min / max temperature and humidity.

If the temp / humidity goes above / below the min / max - we need to signal this through the use of the LED.

Temperatures will be recorded to the SD card, and I will look to expand this to push them to an API going forward so I can visualise the data.

