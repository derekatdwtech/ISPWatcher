import type { Knex } from "knex";
import path from "path";
import { Config } from "../config/config";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const kConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: Config.db.filename || "SPEEDTEST.db"
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'migrations'),
    },
    useNullAsDefault: true
  }

};

module.exports = kConfig;
