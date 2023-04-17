import * as nomnoml from 'nomnoml';
import * as axios from 'axios';

const canvas = document.getElementById('target-canvas');

const initialize = document.getElementById('initialize');

initialize.addEventListener('click', (e) => {
    axios.get('http://localhost:3000/initialize')
        .then(response => {
            console.log(response)
            console.log('Board initialized')
            e.target.disabled = true;
            e.target.innerHTML = 'Board Initialized :)'
        })
        .catch(error => {
            if (error.response){
                alert(error.response.data)
            }
        })
})

const teams = [
    {
        pin: 2,
        name: 'Robots'
    },
    {
        pin: 3,
        name: 'Dookie'
    }
];

axios.get('http://localhost:3000/diagram')
    .then(response => {
        console.log(response);
        nomnoml.draw(canvas, response.data);
    })
let source = '[nomnoml] is -> [Not connected to server yet.]';
nomnoml.draw(canvas, source);

const interval = setInterval(() => {
    axios.get('http://localhost:3000/status')
        .then(response => {
            const readings = response.data
            let diagram = `#.green: fill=#25c023 stroke=white title=bold\n`
            diagram += `#.red: fill=#FF4E30 stroke=white title=bold\n`;

            let readyCount = 0;
            for (const team of teams) {
                const status = readings.filter(reading => {
                    return reading.id === team.pin;
                })[0];
                console.log(readings);
                diagram += `[<${status.reading ? 'green' : 'red'}> Team: ${team.name} (Pin ${team.pin})|` +
                    `${status.reading ? 'Launch is a GO!!!' : 'Not Authorized'}|status:${status.reading}] -> [Controller]\n`;

                readyCount += status.reading;
            }

            if (readyCount === teams.length){
                diagram +=`[<green> Controller|Launching!!!!!!]\n`;
                clearInterval(interval);

                setTimeout(()=>{
                    axios.get('http://localhost:3000/launch')
                        .then(response =>{
                          // Do something cool.
                        })
                },2000)
            } else {
                diagram +=`[<red> Controller|Waiting for Launch Codes]\n`;
            }



            nomnoml.draw(canvas, diagram);
        })
}, 2000)