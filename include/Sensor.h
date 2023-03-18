/*
  Header file for the Sensor
*/

#include <stdint.h>
#include <string>

class Sensor {
   
  private:
    uint8_t type;             // Type of sensor - see DHT.H for sensor types
    int pin;                  // Pin on the board this sensor is connected to.
    bool monitorTemperature;  // Enable / disable monitoring of the Temperature
    bool monitorHumidity;     // Enable / disable monitoring of the Humidity

  public:
    std::string name;         // Friendly name of the sensor
    std::string location;     // Human readable location of the sensor
    std::string comment;      // Any comments associated with this sensor

    Sensor(std::string name, std::string location, std::string type, int pin, bool monitorTemperature, bool monitorHumidity, std::string comment);
};