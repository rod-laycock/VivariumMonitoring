/*
  Header file for the Vivaria - one or more Vivarium.
*/
#include "Vivarium.h"

#include <string>
#include <vector>

class Vivaria {
   
  private:
    std::vector<Vivarium> vivariums;

  public:
    std::string title;
    
    Vivaria(std::string title);
};