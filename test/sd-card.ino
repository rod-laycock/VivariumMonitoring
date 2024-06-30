//  SD Card Test Example Sketch
//
//  Programming Electronics Academy
//
// include file system library

#include "FS.h"

// include SD card library

#include "SD.h"

// include SPI library

#include "SPI.h"

// Define SD card connection

#define SD_MOSI     23
#define SD_MISO     19
#define SD_SCLK     18
#define SD_CS       5

File myFile;

// Setup

void setup()
{
  Serial.begin(115200);
  while (!Serial) 
  {
    // Wait for serial port to connect. Needed for native USB port only
    ; 
  }

  Serial.println("Setup start");
  SPI.begin(SD_SCLK, SD_MISO, SD_MOSI, SD_CS);
  if (!SD.begin(SD_CS)) 

  {

    Serial.println("SD Card MOUNT FAIL");

  } 

  else 

  {
    Serial.println("SD Card MOUNT SUCCESS");
    Serial.println("");
    uint32_t cardSize = SD.cardSize() / (1024 * 1024);
    String str = "SDCard Size: " + String(cardSize) + "MB";
    Serial.println(str);
    uint8_t cardType = SD.cardType();
    if(cardType == CARD_NONE)
    {
      Serial.println("No SD card attached");
    }
    Serial.print("SD Card Type: ");
    if(cardType == CARD_MMC)
    {
        Serial.println("MMC");
    } 
    else if(cardType == CARD_SD)
    {
        Serial.println("SDSC");
    } 
    else if(cardType == CARD_SDHC)
    {
        Serial.println("SDHC");
    } 
    else 
    {
        Serial.println("UNKNOWN");
    }
    myFile = SD.open("/");
    printDirectory(myFile, 0);
    myFile.close();
    Serial.println("");

    // open a new file and immediately close it:

    Serial.println("Creating helloworld.txt...");
    myFile = SD.open("/helloworld.txt", FILE_WRITE);

    // Check to see if the file exists:

    if (SD.exists("/helloworld.txt")) 
    {
      Serial.println("helloworld.txt exists.");
    } 
    else 
    {
      Serial.println("helloworld.txt doesn't exist.");
    }

    // delete the file:
    Serial.println("Removing helloworld.txt...");
    SD.remove("/helloworld.txt");
    if (SD.exists("/helloworld.txt")) 
    {
      Serial.println("helloworld.txt exists.");
    } 
    else 
    {
      Serial.println("helloworld.txt doesn't exist.");
    }
    myFile.close();
    Serial.println("");

    // Open a file. Note that only one file can be open at a time,
    // so you have to close this one before opening another.
    myFile = SD.open("/test.txt", FILE_WRITE);

    // if the file opened okay, write to it.
    if (myFile) 
    {
      Serial.print("Writing to test.txt...");
      myFile.println("testing 1, 2, 3.");
      
    // close the file:
      myFile.close();
      Serial.println("done.");
    } 
    else 
    {

      // if the file didn't open, print an error.
      Serial.println("error opening test.txt");
    }

    // Re-open the file for reading.
    myFile = SD.open("/test.txt");
    if (myFile) 

    {

      Serial.println("test.txt:");
      // Read from the file until there's nothing else in it.
      while (myFile.available()) 
      {
        Serial.write(myFile.read());
      }
      
     // Close the file.
      myFile.close();
    } 
    else 
    {
    
     // If the file didn't open, print an error.
      Serial.println("error opening test.txt");
    }
    myFile.close();
  }
  SD.end();
  SPI.end();
  Serial.println("INFO: Setup complete");
}

// loop
void loop() 
{
  
   // Nothing to do here. 
}
   
   // printDirectory
void printDirectory(File dir, int numTabs) 
{
  while (true) 
  {
    File entry =  dir.openNextFile();
    if (! entry) 
    {
      
     // no more files
      break;
    }
    for (uint8_t i = 0; i < numTabs; i++) 
    {
      Serial.print('t');
    }
    Serial.print(entry.name());
    if (entry.isDirectory()) 
    {
      Serial.println("/");
      printDirectory(entry, numTabs + 1);
    } 
    else 
    {

      // Files have sizes, directories do not.
      Serial.print("tt");
      Serial.println(entry.size(), DEC);
    }
    entry.close();
  }
}
