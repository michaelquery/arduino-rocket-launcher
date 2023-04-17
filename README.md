# Arduino Rocket Launch Project
## Background
### Components
There are three components functions that need to run:
- a web interface
- and a server-side app that interfaces with the central arduino board
- and 'cabinet-member' arduino boards that connect to the 'central' arduino board

## Component Arduino Cabinet Member
The Arduino code for this is in `/cabinet-member`. It should be loaded via the Arudino IDE

## Web and Arduino Server
### WSL Considerations
At the time of writing this COM ports could not be exposed to WSL.

As a result, if you are on a Windows machine, this needs to be run in Windows not in WSL.

### Installation
`cd central`

`npm i`

### Run the server
- Plugin in the Arduino
- Find the Arudino COM port
  - Make sure the COM port value matches the COM port in `central/server.js`
- From the `central` directory,
`npm run server`

### Run the web interface
- In a new process, from the `central` directory `npm run client`


## Improvements