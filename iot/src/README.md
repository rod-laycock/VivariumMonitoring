# Todo on this bloody project

What do I want?
UI - which can be switched off so I can see the output
SD storage - to record a history of about 12 months
Webserver - so I can view this on my phone
Low power - needs to be able to run on very low power
API - Can amend the UI
Configurable - so we can almost sell them with config changes


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

