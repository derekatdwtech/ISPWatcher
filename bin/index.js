"use strict";
const FastSpeedtest = require("fast-speedtest-api");
const Database = require("./db");
const { scrapeFastApi } = require("./fast");
const logger = require('./logger');
const { DetectIsp } = require("./ip");
function delay(t) {
    return new Promise((resolve) => setTimeout(resolve, t));
}
async function execute() {
    let db = new Database("SPEEDTEST.db");
    const token = await scrapeFastApi("https://www.fast.com");
    let speedtest = new FastSpeedtest({
        token: token,
        verbose: false,
        timeout: 10000,
        https: true,
        urlCount: 100,
        bufferSize: 8,
        unit: FastSpeedtest.UNITS.Mbps, // default: Bps
    });
    const isp = DetectIsp();
    while (true) {
        var date = new Date(Date.now()).toISOString();
        logger.info("Executing speedtest");
        await speedtest
            .getSpeed()
            .then((s) => {
            db.insertTestResult(date, s);
            logger.info(`Speed: ${s} Mbps. Speed Test complete.`);
        })
            .catch((e) => {
            logger.error(`${date} - FAILED: Speed Test failed! ${e.message}`);
            db.insertErrorTestResult(date, e.message);
        });
        await delay(5000);
    }
}
execute();
