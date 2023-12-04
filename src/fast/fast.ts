import puppeteer from "puppeteer-extra";
import FastSpeedtest from 'fast-speedtest-api';
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import UserAgent from "user-agents";
import logger from "../logger";
import delay from "../utils/TimeUtils";
import DBContext from "../database/db";

export default class FastApi {

  private db: DBContext;

  constructor() {
    this.db = new DBContext();
  }

  public async StartSpeedTest() {
    const token = await this.GetFastApiToken("https://www.fast.com");

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
      await speedtest
        .getSpeed()
        .then((s) => {
          this.InsertSpeedTestResult(date, s, true);
          logger.info(`Speed: ${s} Mbps. Speed Test complete.`);
        })
        .catch((e) => {
          logger.error(`${date} - FAILED: Speed Test failed! ${e.message}`);
          this.InsertSpeedTestResult(date, 0, false);
        });
      await delay(5000);
    }
  }

  private async GetFastApiToken(url: string) {
    const REQUEST_URL = url;
    const FAST_API_URL = "api.fast.com";
    const puppet = puppeteer.use(StealthPlugin());

    let browser;
    try {
      logger.info("Retrieving fast.com token");
      browser = await puppet.launch({ headless: "new" });
      var [page] = await browser.pages();
      var userAgent = new UserAgent({ deviceCategory: "desktop" });
      await page.setUserAgent(userAgent.random().toString());
      await page.goto(REQUEST_URL, { waitUntil: "networkidle2" });
      await page.waitForResponse((res) => {
        if (res.url().includes(FAST_API_URL)) {
          var token: string | null = new URL(res.url()).searchParams.get("token");
          return token
        }
      }, { timeout: 30_000 });
    }
    catch (e) {
      logger.error("Failed to retrieve fast.com token", e);
      return "";
    }
    finally {
      browser.close();
    }
  }

  private InsertSpeedTestResult(test_date: string, speed_result: number, is_successful: boolean) {

    var sql: string = "INSERT INTO results (test_date, speed_result, is_successful) VALUES (?, ?, ?);";

    this.db.GetConnection().run(sql, [test_date, speed_result, is_successful], (err) => {
      if (err) {
        logger.error("Failed to insert test result", err);
      }
    });

  }
}
