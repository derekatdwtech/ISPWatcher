import { Database } from "sqlite3";
import logger from '../logger';
import { exit } from "process";
import { Config } from "../config/config";
import * as kConfig from './knexfile';
import Knex from 'knex';

export default class DBContext {
  private file;

  constructor() {
    const config = Config;
    switch (config.db.type) {
      case 'sqlite':
        this.file = config.db.filename;
        this.initSqlite();
    }
  }

  private initSqlite() {
    logger.info("Initializing Database");
    const db = new Database(this.file, (err) => {
      if (err && err.name == "SQLITE_CANTOPEN") {
        logger.error(`Failed to create or open sqlite file ${this.file}. Error ${err.message}`);
        exit(1);
      }
    });
  }

  public GetConnection() {
    return new Database(this.file);
  }

  public MigrateDatabase() {
    const knex = Knex(kConfig[Config.environment]);
    try {
      logger.info('Updating database schema.');
      knex.migrate.latest();
    }
    catch (e) {
      logger.error('Failed to update database. Rolling back changes...');
      knex.migrate.rollback();
    }
  }

//   insertTestResult(test_date, speed_result) {
//     var db = this.getDb();

//     db.run(
//       `
//         
//     `,
//       [test_date, speed_result],
//       (err) => {
//         if (err) {
//           return logger.error(err);
//         }
//       }
//     );
//   }

//   insertErrorTestResult(test_date, error) {
//     var db = this.getDb();

//     db.run(
//       `
//         INSERT INTO failures (test_date, error_message) VALUES (?, ?);
//     `,
//       [test_date, error],
//       (err) => {
//         if (err) {
//           return logger.error(err);
//         }
//       }
//     );
//   }
 }
module.exports = DBContext;
