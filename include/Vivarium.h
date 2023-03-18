/*
  Header file for the Vivarium.
*/
#include "Sensor.h"

#include <string>
#include <vector>

class Vivarium {
   
  private:
    std::vector<Sensor> sensors;

  public:
    std::string name;
    std::string location;

    Vivarium(std::string name, std::string location);
};