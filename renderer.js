//let server = require('./server/server');
// executing a program
const {execFile, spawn} = require('child_process');
// path
const filepath = './SCADA/SCADA.txt';
const processpath = './SCADA/Spirt.exe';
// elements
const controlContainer = document.getElementById('control_container');
const controlStart = document.getElementById('control_start');

let controlStop = document.createElement('button');
controlStop.innerHTML = 'Stop';
controlStop.setAttribute('id', 'control_stop');

// start button launchers the SCADA program
controlStart.onclick = function () {
    console.log('start');
    runSCADAProgram();
    controlStart.parentNode.replaceChild(controlStop , controlStart);
};
// stop buttons (close the SCADA)
controlStop.onclick = function () {
    console.log('stop');
    //closeSCADAProgram();
    controlStop.parentNode.replaceChild(controlStart , controlStop);
};
// below function it is work
function runSCADAProgram() {
    execFile(processpath, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }

        console.log(data.toString());
    });
}
/*
// not working
function closeSCADAProgram() {
    const child = spawn(processpath, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }

        console.log(data.toString());
    });
    child.kill();
}
*/


