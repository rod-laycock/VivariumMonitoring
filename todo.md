# Data structure

IGNORE THE BELOW FOR NOW.

GROUPS
Id : INTEGER
Name : TEXT
Type : TEXT
Description : TEXT

| id | date-time | location_id | Type           | Description                   |
|----|---------|----------------|-------------------------------|
| 1  | Pumpkin | Snake Vivarium | Top viv in the living room    |
| 2  | Freddy  | Snake Vivarium | Middle viv in the living room |
| 3  | Nagini  | Snake Vivarium | Bottom viv in the living room |

SENSORS
Id : INTEGER
Location : TEXT
Description : TEXT

| Id | Group Id | Description      |
|----|----------|------------------|
| 1  | 1        | Hot side of viv  |
| 2  | 1        | Cold side of viv |
| 3  | 2        | Hot side of viv  |
| 4  | 2        | Cold side of viv |
| 5  | 3        | Hot side of viv  |
| 6  | 3        | Cold side of viv |

DATA
Id: INTEGER AUTOINCREMENT
DateTime : TIMESTAMP CURRENT_TIMESTAMP
GroupId : INTEGER
SensorId : INTEGER
Temp : NUMERIC(4,2)
Humidity : NUMERIC(4,2)

| Id | DateTime              | GroupId | SensorId | Temp  | Humidity |
|----|-----------------------|---------|----------|-------|----------|
| 1  | 2026-01-01T00:00:0000 | 1       | 1        | 12.22 | 22.22    |


# Endpoints

POST /groups
    { "name": "name data...", "type": "type data...", "description": "description data..." }
    Creates a group

GET  /groups
    Returns all groups

GET  /groups/id
    Returns group by Id

POST /sensors
    { "location": "location data", "description": "description data" }

GET /sensors?group_id=X
    Returns all sensors (optnally via grouo)

GET /sensors/{id}
    Retuns an individual sensor by Id

POST /readings
{ "sensor_id": 3, "temperature": 23.1, "humidity": 48.5, "timestamp": "2026‑02‑15T10:00:00Z" }

paginated - by DateTime


