const fs = require('fs');
const path = require('path');
require('dotenv-defaults').config()

const five = require('johnny-five');
const express = require('express');
const cors = require('cors');

// Johnny Five
let BOARD;
let BOARD_INITIALIZED = false;
let LAUNCH_PIN;
const LAUNCH_PIN_ID = 13;
let CABINET_PINS = [];
const CABINET_PIN_IDS = [2, 3, 4, 5];


// Server
app = express();
app.use(cors({
    origin: '*'
}));
const port = 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/led/:mode', (req, res) => {
    if (LAUNCH_PIN) {
        const status = "OK";
        switch (req.params.mode) {
            case "on":
                LAUNCH_PIN.on();
                break;
            case "off":
                LAUNCH_PIN.off();
                break;
            case "blink":
                LAUNCH_PIN.blink(30);
                break;
            case "stop":
                LAUNCH_PIN.stop();
                break;
            default:
                let status = "Unknown: " + req.params.mode;
                break;
        }
        console.log(status);
        res.send(status);
    } else {
        res.send('Board NOT ready!')
    }
});

app.get('/diagram', (req, res) => {
    res.send(fs.readFileSync('./diagram.noml'));
})

app.get('/initialize', (req, res) => {
    const respondWithError = (e, eventName) => {
        if (res.headersSent) return;
        res.status(500).send(`Board event '${eventName}': \n${e.message}`);
    }
    BOARD = new five.Board({
        port: process.env.ARDUINO_COM_PORT
    });
    BOARD.on('ready', () => {
        BOARD_INITIALIZED = true;
        console.log('Board initialized.')
        LAUNCH_PIN = new five.Led(LAUNCH_PIN_ID);


        for (const id of CABINET_PIN_IDS) {
            CABINET_PINS[id] = new five.Pin(id, {
                // mode: 0x0B
            });
            BOARD.pinMode(id, 0x0B);
            CABINET_PINS[id].read((error, value) => {
                // console.log(`Pin ID ${id}: just read ${value}`);
            });
        }
    })
    BOARD.on('close', (e) => {
        respondWithError(e, 'close')
    })
    BOARD.on('fail', (e) => {
        respondWithError(e, 'fail')
    })
    BOARD.on('exit', (e) => {
        respondWithError(e, 'exit')
    })
    BOARD.on('error', (e) => {
        respondWithError(e, 'error')
    })
})

app.get('/status', (req, res) => {
    if (!BOARD_INITIALIZED){
        const response = CABINET_PIN_IDS.map((pinId) => {
            return {
                id: pinId,
                reading: 0
            }
        })
        res.send(response)
        return;
    }
    let promises = []
    for (const id in CABINET_PINS) {
        let pin = CABINET_PINS[id];
        let p = new Promise((resolve, reject) => {
            pin.query((state) => {
                console.log(`Pin id: ${id}: ${JSON.stringify(state)}`)
                resolve({id: parseInt(id), reading: state.value});
            })
        });
        promises.push(p);
    }
    Promise.all(promises)
        .then(readings => {
            res.send(readings)
        })
})

app.get('/launch', (req, res) => {
    if (LAUNCH_PIN) {
        LAUNCH_PIN.on();
    }
    res.send('ok');
});

app.listen(port, () => {
    console.log('Up and running, boi!');
})