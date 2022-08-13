const puppeteer = require('puppeteer');


async function getBrowser(opts = {}) {
    const chromeOptions = {
        headless: true,
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        args: [
            "--no-sandbox"
        ],
        timeout: 120000,
        ...opts
    }
    return await puppeteer.launch(chromeOptions)
}


async function ssweb(url, fpage = false, filetype, darkmode = false) {
    const browser = await getBrowser({
        executablePath: 'google-chrome-stable',
        ignoreDefaultArgs: ['--disable-extensions']
    });
    const page = await browser.newPage();
    try {
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 300000
        })
        const screenshot = await page.screenshot({
            type: filetype || 'jpeg',
            fullPage: fpage
        })
        await browser.close()
        return screenshot
    } catch (e) {
        await browser.close()
        throw e
    }
}

module.exports = async function (opts) {
    let { url, fullpage, filetype } = opts || {};
    if (!url) throw { status: 400, creator: 'Cakra & Caliph', message: 'parameter url tidak boleh kosong!' };
    let buffer = await ssweb(url, fullpage, filetype)
    return buffer
}
