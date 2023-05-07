const puppeteer = require('puppeteer');
const UserAgent = require('user-agents');


async function getBrowser(options = {}) {
    // "google-chrome-stable" is the package name of avaiable from command linux.
    const executablePath = process.platform === 'linux' ? 'google-chrome-stable' : "";

    // User-agent
    const userAgent = new UserAgent({
        deviceCategory: "desktop",
        platform: "Linux x86_64",
    });
    
    // Puppeteet chrome options.
    return await puppeteer.launch({
        headless: true,
        executablePath,
        args: [
            "--no-sandbox",
            '--disable-setuid-sandbox',
            '--disable-infobars',
            `--user-agent=${userAgent.toString()}`,
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-gpu',
            '--disable-features=site-per-process',
            '--no-default-browser-check',
            "--no-cache"
        ],
        timeout: 120000,
        ...options
    });
};


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
        ignoreDefaultArgs: ['--disable-extensions']
    });
    try {
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 300000
        });
        const title = await page.title();
        const description = await (await (await page.$('meta[name="description"]'))?.getProperty("content"))?.jsonValue() ?? null;
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