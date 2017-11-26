const columns = [
    {
        name: 'Date',
        type: 'DATE'
    },
    {
        name: 'Time',
        type: 'TIME'
    },
    {
        name: 'TR_106',
        type: 'REAL'
    },
    {
        name: 'TR_111',
        type: 'REAL'
    },
    {
        name: 'TR_107',
        type: 'REAL'
    },
    {
        name: 'TR_112',
        type: 'REAL'
    },
    {
        name: 'PPC_305',
        type: 'REAL'
    },
    {
        name: 'PPC_307',
        type: 'REAL'
    },
    {
        name: 'TPC_101',
        type: 'REAL'
    },
    {
        name: 'TPC_102',
        type: 'REAL'
    },
    {
        name: 'Warning',
        type: 'STRING'
    }
];

const sqlite3 = require('sqlite3').verbose();
let db;

function createDb() {
    console.log("createDb db");
    db = new sqlite3.Database('db.sqlite3', createTable);
}


function createTable() {
    console.log("createTable SCADA");

    const placeholders = columns.map(({name, type}) => `${name} ${type}`).join(',');
    //console.log(placeholders);
    // fields: date, time, ...parameters, warning
    db.run(`CREATE TABLE IF NOT EXISTS SCADA (${placeholders})`);
}

exports.insertRows = function (...arg) {
    console.log("insertRows SCADA");

    const placeholders = columns.map(({name}) => name).join(',');
    const placeholdersValue = columns.map(() => '?').join(',');

    const statement = db.prepare(`INSERT INTO SCADA (${placeholders}) VALUES (${placeholdersValue})`);

// fills the rows (Date, Time)
    statement.run(...arg);

    //statement.finalize(readAllRows);
};

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

exports.runDB =  function () {
    createDb();
};


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