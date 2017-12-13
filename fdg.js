const fs = require('fs');
const {execFile, spawn} = require('child_process');
const {runDB, insertRows, readEachRows, selectDB} = require('./db');

const filepath = './SCADA/SCADA.txt';
const processpath = './SCADA/Spirt.exe';

const controlContainer = document.getElementById('control_container');
const controlStart = document.getElementById('control_start');
const controlExit = document.getElementById('control_exit');
const controlSelectInput = document.querySelector('#control_select>input');
const controlSelectButton = document.querySelector('#control_select>button');

let controlStop = document.createElement('button');
controlStop.innerHTML = 'Stop';
controlStop.setAttribute('id', 'control_stop');
controlStop.setAttribute('class', 'btn');

let ifFirstStart = true;
let timerId = 0;
let select = false;

controlStart.onclick = function () {
    if (ifFirstStart) {
        runSCADAProgram();
        ifFirstStart = false;
    }
    controlStart.parentNode.replaceChild(controlStop, controlStart);
    runDB();
    let savedLastLine = '';
    timerId = setInterval(function () {
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
            let parameters = lastLine.trim().split(/\s+/g);
            const paramsByOption = parameters.filter((item, index) => [2, 5, 8, 11].indexOf(index) === -1);
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const timeStr = date.toLocaleTimeString();

            let warning = (parameters[6] > 7 && parameters[7] > 5) ?
                'Warning: the values of PPC_305 and PPC_307 exceed the permissible values' :
                (parameters[6] > 7) ? 'Warning: The value of PPC_305 is more than 7' :
                    (parameters[7] > 5) ? 'Warning: The value of PPC_307 is more than 5' : 'OK';
            insertRows(dateStr, timeStr, ...paramsByOption, warning);
        });
        readEachRows(renderTable);
    }, 1000);
};
controlStop.onclick = function () {
    stopReading()
};
function stopReading() {
    clearInterval(timerId);
    controlStop.parentNode.replaceChild(controlStart, controlStop);
}
controlExit.onclick = function () {
    window.close();
};

function runSCADAProgram() {
    const spirt = spawn(processpath);
    spirt.on('exit', () => {
        stopReading();
        ifFirstStart=true;
    });
}

let elementTableHead = document.querySelector('#table-props>thead>tr');
let elementTableBody = document.querySelector('#table-props>tbody');

function renderTable(data) {
    if (select || elementTableHead.innerHTML === '') {
        elementTableHead.innerHTML = '';
        elementTableBody.innerHTML = '';
        Object.keys(data).forEach((item) => {
            const th = document.createElement("th");
            th.innerHTML = item;
            elementTableHead.appendChild(th)
        });
        select = false;
    }

    const tr = document.createElement("tr");

    Object.keys(data).forEach((item) => {
        const td = document.createElement("td");
        td.innerHTML = data[item];
        tr.appendChild(td);
    });
    elementTableBody.insertBefore(tr, elementTableBody.firstChild);
}

controlSelectButton.onclick = function(){
    clearInterval(timerId);
    select = true;
    const value = controlSelectInput.value;
    if (!!value.trim()){
        selectDB(value, renderTable)
    }
    controlSelectInput.value = '';
}