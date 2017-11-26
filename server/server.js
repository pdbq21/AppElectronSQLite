/*const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite3');

db.serialize(function() {
    db.run("CREATE TABLE SCADA (info TEXT)");

    const stmt = db.prepare("INSERT INTO SCADA VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();*/

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

const sqlite3 = require('sqlite3').verbose();
let db;

function createDb() {
    console.log("createDb chain");
    db = new sqlite3.Database('db.sqlite3', createTable);
}


function createTable() {
    console.log("createTable SCADA");
    let columnsParameters = '';
    parameters.forEach((param) => {
        columnsParameters += `, ${param} REAL`;
    });
    // fields: date, time, parameters, warning
    db.run(`CREATE TABLE IF NOT EXISTS SCADA (Date DATE, Time TIME ${columnsParameters}, Warning STRING)`, insertRows);
}

function insertRows() {
    console.log("insertRows SCADA");
    // todo: insert into SCADA for all fields
    //const stmt = db.prepare("INSERT INTO SCADA (test, abc) VALUES (?)");

    /*for (let i = 0; i < 10; i++) {
        stmt.run("test " + i);
    }*/

    //stmt.finalize(readAllRows);
}

function readAllRows() {
    console.log("readAllRows SCADA");
    db.all("SELECT rowid AS id, test FROM SCADA", function (err, rows) {
        console.log(rows);
        rows.forEach(function (row) {
            console.log(row.id + ": " + row.test);
        });
        closeDb();
    });
}

function closeDb() {
    console.log("closeDb");
    db.close();
}

function runChainExample() {
    createDb();
}

runChainExample();

// Todo: fields for the table:
// - date
// - time
// - parameters of SCADA:
// TR_106
/*TR_111
TR_107
TR_112
PPC_305
PPC_307
TPC_101
TPC_102*/
// - warning message