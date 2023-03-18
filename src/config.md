# Configuration Explained

## Webserver
This will be the configuration of the webserver.

**SSID** - This is the Access Point name so it can connect to the wifi network.

**Password** - This is the password for the network access point.

**Port** - This is the port the webserver will be listening on.

**ConnectionTimeout** - Specifies how long the connection should take, if not connected after this time then continue without a webserver.

Default is 60 seconds.


Example:
```
   "webserver" : {
     "SSID": "MyWifi",
     "Password": "MyPassword",
     "Port": "80",
     "ConnectionTimeout": 60
   }
```

	*Note - If not specified / specified incorrectly, you will not be able to view the monitor on a webpage.


# Misc
**PollFrequency** - this is the delay (in seconds) between reading temps / humidity from each of the sensors. 

Defaults to 60s if not specified.

Example:
```
"PollFrequency": "5",
```

**TemperatureUnit** - This is the temperature output, which will either be in Celcius "**C**" or Farenheith "**F**". 

Defaults to **C** if not specified.

Example:
```
"TemperatureUnit": "C",
```

# Vivaria
**Title** - this is just the title for the Vivaria being monitored

## Vivarium
These are instance of each vivarium being monitored, Each will need at least 1 sensor.

**Name** - This is the name of the vivarium being monitored - seems sensible so you can put the pets name in there.

**Location** - If like me you more than one vivarium, makes sense to display a location. I have mine stacked, so this will be something like Top, Middle, Bottom.

Example:

```
"Vivarium": [
	{
		"Name": "Snakey",
		"Location": "Top",
		"Sensors": [
			... See 'Sensors' below ...
		]
	}
]
```

### Sensors
**Name** - The name of the sensor
Location - As the heat source can be positioned left, right or middle - makes sense to describe where the sensor is located within the vivarium.

	*Note - The system should not start up is this is not specified.

**Pin** - This is the pin on the ESP which is used to read data back from.

	*Note - The system should not start up is this is not specified as we don't want to damage any components / misread the values.*

**Sensor Type** - We need to know what kind of sensor is in use. Valid values are defined in the DHT.H file:
- DHT11
- DHT12
- DHT21
- DHT22 <-- We will be using these, but you can use any you wish.
- AM2301

	*Note - The system should not start up is this is not specified as we don't want to damage any components / misread the values.*


**Comment** - not sure if this is needed, but always good to have something which can be read by a person.

**MonitorTemperature** - Boolean which indicates if we should be monitoring and reporting on Temperature in this Vivarium. Valid values are "**true**" or "**false**".

Default is **False**

**MonitorHumidity** - Boolean which indicates if we should be monitoring and reporting on Humidity in this Vivarium. Valid values are "**true**" or "**false**".

Default is **False**

Example
```
"Sensors": [
	{
		"Name": "Hot",
		"Location": "Left",
		"Port": 1,
		"Pin": 25,
		"SensorType": "DHT22",
		"Comment": "GPIO 25",
		"MonitorTemperature": true,
		"MonitorHumidity" : true
	}
]
```

# TODO:
Logging
DHCP / Static IP Addresses