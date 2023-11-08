"use strict";
var sqlite3 = require("sqlite3");
const logger = require("./logger");
class Database {
    constructor(path) {
        this.file = path;
        this.init();
    }
    init() {
        logger.info("Initializing Database");
        new sqlite3.Database(`${this.file}`, sqlite3.OPEN_READWRITE, (err) => {
            if (err && err.code == "SQLITE_CANTOPEN") {
                logger.info(`Database file ${this.file} not found.`);
                this.createDatabase();
                return;
            }
            else if (err) {
                logger.error("Getting error " + err);
                exit(1);
            }
        });
    }
    getDb() {
        return new sqlite3.Database(`${this.file}`, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                logger.info(err);
                exit(1);
            }
        });
    }
    createDatabase() {
        logger.info("Creating database");
        var newDb = new sqlite3.Database(`${this.file}`, (err) => {
            if (err) {
                logger.error(err);
                exit(1);
            }
            this.createTables(newDb);
        });
    }
    createTables(db) {
        logger.info("Creating new database tables");
        db.exec(`
        CREATE TABLE results (
            id INTEGER primary key autoincrement,
            test_date datetime default current_timestamp not null,
            speed_result decimal(20, 20) not null
        );

        CREATE TABLE failures (
            id INTEGER primary key autoincrement,
            test_date datetime default current_timestamp not null,
            error_message TEXT NOT NULL
        )
    `);
    }
    insertTestResult(test_date, speed_result) {
        var db = this.getDb();
        db.run(`
        INSERT INTO results (test_date, speed_result) VALUES (?, ?);
    `, [test_date, speed_result], (err) => {
            if (err) {
                return logger.error(err);
            }
        });
    }
    insertErrorTestResult(test_date, error) {
        var db = this.getDb();
        db.run(`
        INSERT INTO failures (test_date, error_message) VALUES (?, ?);
    `, [test_date, error], (err) => {
            if (err) {
                return logger.error(err);
            }
        });
    }
}
module.exports = Database;
