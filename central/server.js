const fs = require('fs');
const path = require('path');

const five = require('johnny-five');
const express = require('express');
const cors = require('cors');

// Johnny Five
let board;
let launcher;
let pins = [];


// Server
app = express();
app.use(cors({
    origin: '*'
}));
const port = 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/led/:mode', (req, res) => {
    if (launcher) {
        const status = "OK";
        switch (req.params.mode) {
            case "on":
                launcher.on();
                break;
            case "off":
                launcher.off();
                break;
            case "blink":
                launcher.blink(30);
                break;
            case "stop":
                launcher.stop();
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
    board = new five.Board({
        port: 'COM6'
    });
    board.on('ready', () => {
        console.log('Board initialized.')
        const ledPin = 13;
        launcher = new five.Led(ledPin);

        const pinIds = [2, 3, 4];
        for (const id of pinIds) {
            pins[id] = new five.Pin(id, {
                // mode: 0x0B
            });
            board.pinMode(id, 0x0B);
            pins[id].read((error, value) => {
                // console.log(`Pin ID ${id}: just read ${value}`);
            });
        }
    })
    board.on('close', (e) => {
        respondWithError(e, 'close')
    })
    board.on('fail', (e) => {
        respondWithError(e, 'fail')
    })
    board.on('exit', (e) => {
        respondWithError(e, 'exit')
    })
    board.on('error', (e) => {
        respondWithError(e, 'error')
    })
})

app.get('/status', (req, res) => {
    let promises = []
    for (const id in pins) {
        let pin = pins[id];
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
    if (launcher) {
        launcher.on();
    }
    res.send('ok');
});

app.listen(port, () => {
    console.log('Up and running, boi!');
})