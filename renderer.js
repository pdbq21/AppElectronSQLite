const {runDB, insertRows} = require('./server/server');

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
// todo: below
//PPC_305>7; [6] > 7
//PPC_307>5; [7] > 5
// parameter => index of array
const TR_106 = 0;
const TR_111 = 1;
const TR_107 = 3;
const TR_112 = 4;
const PPC_305 = 6;
const PPC_307 = 7;
const TPC_101 = 9;
const TPC_102 = 10;
// not used indexs = 2, 5, 8, 11
// all parameters
const parameters = [
    'TR_106',
    'TR_111',
    'TR_107',
    'TR_112',
    'PPC_305',
    'PPC_307',
    'TPC_101',
    'TPC_102'
];
// start button launchers the SCADA program
controlStart.onclick = function () {
    console.log('start');
    runSCADAProgram();
    controlStart.parentNode.replaceChild(controlStop, controlStart);

    // run DB => create Table,
    runDB();
    // readLastLine();

    // save last line
    let savedLastLine = '';
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
// => ['', '', ...]
            let parameters = lastLine.trim().split(/\s+/g);

            const paramsByOption = parameters.filter((item, index) => [2, 5, 8, 11].indexOf(index) === -1);
            console.log(paramsByOption, parameters);

            const date = new Date();
            // Date yyyy-mm-dd
            const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            // Time hh:mm:ss
            const timeStr = date.toLocaleTimeString();

            //PPC_305>7; [6] > 7
            //PPC_307>5; [7] > 5
            let warning = (parameters[6] > 7 && parameters[7] > 5) ?
                'Warning: the values of PPC_305 and PPC_307 exceed the permissible values' :
                (parameters[6] > 7) ? 'Warning: The value of PPC_305 is more than 7' :
                    (parameters[7] > 5) ? 'Warning: The value of PPC_307 is more than 5' : 'OK';
            // insert rows (Date, Time, ...parameters)
            insertRows(dateStr, timeStr, ...paramsByOption, warning);
        });
    }, 1000);
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


// Reading the file every second; Todo: need fix this logic
/*setInterval(function () {
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

        const fields = lastLine.trim().split(/\s+/g);

        console.log(fields);
    });
}, 1000);*/
//setTimeout(readLastLine(), 1000);





