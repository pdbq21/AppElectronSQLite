//let server = require('./server/server');

const fs = require('fs');
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
    controlStart.parentNode.replaceChild(controlStop, controlStart);

   // readLastLine()
    //readLastLine();
};
// stop buttons (close the SCADA)
controlStop.onclick = function () {
    console.log('stop');
    //closeSCADAProgram();
    controlStop.parentNode.replaceChild(controlStart, controlStop);
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

//const stream = fs.ReadStream(filepath);

function readLastLine() {
    /*fs.readFile(filepath, 'utf-8', (err, data) => {
         if (err) {
             console.log("An error ocurred reading the file :" + err.message);
             return;
         }
         if (data.trim() === '') return;

         const lines = data.trim().split('\n');
         const lastLine = lines.slice(-1)[0];

         //const fields = lastLine.split(',');
         //const audioFile = fields.slice(-1)[0].replace('file:\\\\', '');

         console.log(lastLine);
     });*/

    /*
    stream.on('readable', function(){
        const data = stream.read();
        //if (data.trim() === '') return;
        //const lines = data.trim().split('\n');
        //const lastLine = lines.slice(-1)[0];

        //const fields = lastLine.split(',');
        //const audioFile = fields.slice(-1)[0].replace('file:\\\\', '');

        console.log(data);
    });*/

    /*stream.on('end', function(){
        console.log("THE END");
    });*/


    /*const stream = fs.createReadStream(filepath, {encoding: 'utf8'});
    stream.on('readable', function () {
        const data = this.read();
        //const lines = data.trim().split('\n');
        //const lastLine = lines.slice(-1)[0];
        console.log(data)

    });*/

   /* stream.on('end', function () {
        console.log('end');
    });*/

       console.log('read')

}

// save last line
let savedLastLine = '';
// Reading the file every second; Todo: need fix this logic
setInterval(function () {
    console.log('read');
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) {
            console.log("An error ocurred reading the file :" + err.message);
            return;
        }
        if (data.trim() === '') return;

        const lines = data.trim().split('\n');
        const lastLine = lines.slice(-1)[0];
        if (savedLastLine === lastLine) return;
        savedLastLine = lastLine;
        //const fields = lastLine.split(',');

        console.log(lastLine);
    });
}, 1000);
//setTimeout(readLastLine(), 1000);


