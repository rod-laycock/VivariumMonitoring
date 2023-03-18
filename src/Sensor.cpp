#include "Sensor.h"

#include <DHT.h>
#include <DHT_U.h>

Sensor::Sensor(std::string name, std::string location, std::string type, int pin, bool monitorTemperature, bool monitorHumidity, std::string comment) :
  name(name), location(location), pin(pin),monitorHumidity(monitorHumidity), monitorTemperature(monitorTemperature), comment(comment)
  {
    if (strcasecmp(type.c_str(), "DHT11") == 0) this->type = DHT11;
    else if (strcasecmp(type.c_str(), "DHT12") == 0) this->type = DHT12;
    else if (strcasecmp(type.c_str(), "DHT21") == 0) this->type = DHT21;
    else if (strcasecmp(type.c_str(), "DHT22") == 0) this->type = DHT22;
    else if (strcasecmp(type.c_str(), "AM203") == 0) this->type = AM2301;

    // TODO: Exception needs to be thrown if none of the above are specified.
}
