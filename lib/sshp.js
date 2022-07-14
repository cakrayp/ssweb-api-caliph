const puppeteer = require('puppeteer');


async function getBrowser(opts = {}) {
    const chromeOptions = {
        headless: true,
        defaultViewport: {
            width: 720,
            height: 1080
        },
        timeout: 120000,
        args: [
            "--incognito",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
            "--no-cache"
        ],
        ...opts
    }
    return await puppeteer.launch(chromeOptions)
}

async function ssweb(url, fpage = false) {
    const browser = await getBrowser({
        executablePath: 'google-chrome-stable',
        ignoreDefaultArgs: ['--disable-extensions']
    })
    try {
        const page = await browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 11; SM-A205F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36')
        await page.goto(url, {
            waitUntil: 'load',
            timeout: 300000
        })
        const screenshot = await page.screenshot({
            type: 'png',
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
    let { url, fullpage } = opts || {};
    if (!url) throw { status: 400, creator: 'Cakra & Caliph', message: 'parameter url tidak boleh kosong!' };
    let buffer = await ssweb(url, fullpage)
    return buffer
}
