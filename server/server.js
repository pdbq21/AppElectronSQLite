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

exports.readEachRows = function (callback) {
    console.log("readEachRows SCADA");
    db.each("SELECT * FROM SCADA", function (err, row) {
        if(err !== null){
            console.log(err);
        }
        callback(row)
    });
    //db.close();
};

exports.closeDb = function () {
    db.close();
};

exports.runDB =  function () {
    createDb();
};

exports.selectDB = function(query, callback){
db.each(query, function (err, row) {
        if(err !== null){
            console.log(err);
        }
        callback(row)
    });
};