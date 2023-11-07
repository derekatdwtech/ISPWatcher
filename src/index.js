const FastSpeedtest = require("fast-speedtest-api");
const Database = require("./db");
const { scrapeFastApi } = require("./fast");
const logger  = require('./logger')

function delay(t) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

async function execute() {
  const token = await scrapeFastApi("https://www.fast.com");
  let db = new Database("SPEEDTEST.db");

  let speedtest = new FastSpeedtest({
    token: token, // required
    verbose: false, // default: false
    timeout: 10000, // default: 5000
    https: true, // default: true
    urlCount: 100, // default: 5
    bufferSize: 8, // default: 8
    unit: FastSpeedtest.UNITS.Mbps, // default: Bps
  });

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
