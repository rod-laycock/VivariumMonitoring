# Todo on this bloody project

1. Decide on tech - Raspberry Pi or ESP32.
### Raspberry Pi
#### Pros
Known
Can get a screen for it.

#### Cons
High power

### ESP32
#### Pros
Low Power
Has comms on board, BT, WIFI 
Built in webserver
#### Cons
C++ / rust
No SD storage
No GUI output


What do I want?
UI - which can be switched off so I can see the output
SD storage - to record a history of about 12 months
Webserver - so I can view this on my phone
Low power - needs to be able to run on very low power
API - Can amend the UI
Configurable - so we can almost sell them with config changes


Pi ZeroWH - £16.80 + Delivery
Pi Zero2W - £17.00 / 40 pin header £1.50 + Delivery

As Raspberry's are like Gold Dust - use ESP32, add SD card for configuration along with antenna and use it as a webserver.

# Main elements
## Hardware
ESP32 - to read the sensors = Need an extra sensor.
Multiple DHT22 sensors to read temp and humidity (2 per viv)
  10K pull up resistors across + and Data on DHT22
MicroSD Card module - ordered.
Micro SD card for config + other elements
Wifi Antenna to boost signal - GOT
Proto board for cabling - GOT
Case to put it all into - Need to know dimensions, also need some mounting mechanism
Power Supply - low power.

### Future expansions
Touchscreen / epaper display

## Software elements
Initialise
  Read config file and confugure accordingly
  Initialise local web server for monitoring
  Initialise Logging

Loop
  Read sensors
  Send data to API for logging / record onto SD card - ensure we clean it down though to prevent it filling up.
  
  If request to API is received
    Act
  If request to website is received
    Return site


Required:
  Objects
  JSON reading > objects


## Adding SD Card
  - CS    -> GPIO27 / Pin 16
  - SCK   -> GPIO14 / Pin 17
  - MOSI  -> GPIO13 / Pin 20
  - MISO  -> GPIO12 / Pin 18
  - VCC   -> +5v
  - GND   -> Gnd

Store JSON formatted config + other elements of
