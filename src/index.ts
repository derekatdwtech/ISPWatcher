import DBContext from './database/db';
import FastApi from './fast/fast';
import logger from './logger';
// import { DetectIsp } from './ip';
import {Worker} from 'worker_threads';


logger.info("Initializing ISPWatcher.")

try {
    logger.info("Setting up local database.");
    var db = new DBContext();
    db.MigrateDatabase();
}
catch (e) {
    logger.error(e);
    process.exit(1);
}

logger.info("Starting speedtest process.");
var fast = new FastApi();
fast.StartSpeedTest();