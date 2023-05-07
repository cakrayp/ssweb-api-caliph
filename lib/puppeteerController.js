const puppeteer = require('puppeteer');


async function getBrowser(options = {}) {
    const chromeOptions = {
        headless: true,
        // defaultViewport: {
        //     width: 1920,
        //     height: 1080
        // },
        args: [
            "--no-sandbox"
        ],
        timeout: 120000,
        ...options
    }
    return await puppeteer.launch(chromeOptions)
}


/**
 * 
 * @param {URL} url 
 * @param {{
 *      width: number,
 *      height: number,
 * }} defaultViewport 
 * @param {Boolean} fullpage 
 * @param {"jpeg" | "png" | "webp" | undefined} filetype
 * @returns 
 */
async function ssweb(url, defaultViewport, fullPage = false, filetype) {
    const browser = await getBrowser({
        defaultViewport,
        // executablePath: 'google-chrome-stable',
        ignoreDefaultArgs: ['--disable-extensions']
    });
    try {
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 300000
        });
        const title = await page.title();
        const description = await (await (await page.$('meta[name="description"]')).getProperty("content")).jsonValue() ?? null;
        // console.log(description)
        const viewport = await page.viewport();
        const pageURL = await page.url();
        const screenshot = await page.screenshot({
            type: filetype ?? 'jpeg',
            fullPage
        });
        await browser.close();
        
        return {
            title,
            description,
            viewport,
            screenshot,
            url: pageURL
        };
    } catch (e) {
        await browser.close()
        throw e;
    }
}

module.exports = {

    /**
     * @param {{
     *      url: puppeteer.url<URL>,
     *      defaultViewport: { width:number, height:number },
     *      fullpage: Boolean,
     *      filetype: "jpeg" | "png" | "webp" | undefined
     * }} options 
     * @returns {Promise<puppeteer.Browser.screenshot>}
     */
    screenshot: async function (options) {
        try {
            let { url, defaultViewport, fullpage, filetype } = options || {};
            if (!url) throw { code: 400, message: 'parameter url tidak boleh kosong!' };
            let browserData = await ssweb(url, defaultViewport, fullpage, filetype);
            return browserData;
        } catch(e) {
            console.log(e);     // When the program are crashed, you will see the logs.
            throw { code: 500, message: 'This server cannot be processed, please try again.' };
        }
    }
};