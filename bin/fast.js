"use strict";
const puppeteer = require("puppeteer-extra"); // ^3.2.3
const StealthPlugin = require("puppeteer-extra-plugin-stealth"); // ^2.9.0
const UserAgent = require("user-agents"); // ^1.0.958
const logger = require("./logger");
puppeteer.use(StealthPlugin());
const scrapeFastApi = async (e) => {
    let REQUEST_URL = e;
    let PATTERN_URL = "api.fast.com";
    let browser;
    try {
        let desiredResUrl;
        logger.info("Retrieving Fast.com token.");
        browser = await puppeteer.launch({ headless: "new" });
        const [page] = await browser.pages();
        const userAgent = new UserAgent({ deviceCategory: "desktop" });
        await page.setUserAgent(userAgent.random().toString());
        const [res] = await Promise.all([
            page.waitForResponse((res) => {
                if (res.url().includes(PATTERN_URL)) {
                    desiredResUrl = res.url();
                    return true;
                }
                else {
                    return false;
                }
            }, {
                timeout: 90000,
            }),
            page.goto(REQUEST_URL, { waitUntil: "networkidle2" }),
        ]);
        const token = new URL(desiredResUrl).searchParams.get("token");
        return token;
    }
    catch (err) {
        logger.error(err);
    }
    finally {
        browser?.close();
    }
};
module.exports = { scrapeFastApi };
