const {runDB, insertRows, readEachRows, selectDB} = require('./server/server');


const fs = require('fs');
const {execFile, spawn} = require('child_process');
// path
const filepath = './SCADA/SCADA.txt';
const processpath = './SCADA/Spirt.exe';

// elements
const controlContainer = document.getElementById('control_container');
const controlStart = document.getElementById('control_start');
const controlExit = document.getElementById('control_exit');
const controlSelectInput = document.querySelector('.control_select>input');
const controlSelectButton = document.querySelector('.control_select>button');

let controlStop = document.createElement('button');
controlStop.innerHTML = 'Stop';
controlStop.setAttribute('id', 'control_stop');

// parameter => index of array
/*const TR_106 = 0;
const TR_111 = 1;
const TR_107 = 3;
const TR_112 = 4;
const PPC_305 = 6;
const PPC_307 = 7;
const TPC_101 = 9;
const TPC_102 = 10;*/
// not used indexs = 2, 5, 8, 11
let ifFirstStart = true;
let timerId = 0;
let select = false;
// start button launchers the SCADA program
controlStart.onclick = function () {
    console.log('start');
    if (ifFirstStart) {
        runSCADAProgram();
        ifFirstStart = false;
    }

    controlStart.parentNode.replaceChild(controlStop, controlStart);

    // run DB => create Table,
    runDB();
    // save last line
    let savedLastLine = '';
    timerId = setInterval(function () {
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
        readEachRows(renderTable);

    }, 1000);
};
// stop buttons (close the SCADA)
controlStop.onclick = function () {
    console.log('stop');
    stopReading()
};
function stopReading() {
    clearInterval(timerId);
    controlStop.parentNode.replaceChild(controlStart, controlStop);
}
// close app
controlExit.onclick = function () {
    window.close();
};

// below function it is work
function runSCADAProgram() {
    console.log('run');

    const spirt = spawn(processpath);

    spirt.on('exit', () => {
        stopReading();
        ifFirstStart=true;
    });
}


let elementTableHead = document.querySelector('#table-props>thead>tr');
let elementTableBody = document.querySelector('#table-props>tbody');


//

function renderTable(data) {
    console.log('callback', Object.keys(data).length);
    // render thead
    // todo: if this data from the SelectDB need clear thead for new header
    if (select || elementTableHead.innerHTML === '') {
        elementTableHead.innerHTML = '';
        elementTableBody.innerHTML = '';
        //theadLen
        Object.keys(data).forEach((item) => {
            const th = document.createElement("th");
            th.innerHTML = item;
            elementTableHead.appendChild(th)
        });
        select = false;
    }

    const tr = document.createElement("tr");
    // render tbody

    Object.keys(data).forEach((item) => {
        const td = document.createElement("td");
        td.innerHTML = data[item];
        tr.appendChild(td);
    });
    elementTableBody.insertBefore(tr, elementTableBody.firstChild);
}

console.log(controlSelectButton);
// Select date from DB
controlSelectButton.onclick = function(){
    clearInterval(timerId);
    select = true;
    const value = controlSelectInput.value;
    if (!!value.trim()){
        //
        selectDB(value, renderTable)
    }    
    
    // clean input
    controlSelectInput.value = '';
}


