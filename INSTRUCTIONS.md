# Paper Airplane Launcher
## Groups

## Make Airplane
- https://www.youtube.com/watch?v=m2wSXaffzS0

## Steps
- Setup Airplane (Jon)
    - Verify that releasing clasp will fire plane
    - Connect relay / linear actuator to clasp

- Solder up the switch
    - Connect batteries
    - Connect to relay
    - Connect relay COM to linear actuator
    - Connect IN1 to Pin13 on Arduino
    - Connect grounds
    - Pull down resistor on IN1

- Get Arduino Central up and running
    - Connect Arduino
        - Verify that the firmware is loaded
        - Verify COM port (set in .env if not COM6)
    - Run Client and Server
    - Initialize board

- Setup cabinet member arduinos
    - Set team names in main.js and assign pin number on Central
    - Connect to the appropriate Central pin
    - Don't forget pull-down resistors on buttons

- Don't forget
    - Tie grounds together
    - Pull down resistor on Arduino output pin 13