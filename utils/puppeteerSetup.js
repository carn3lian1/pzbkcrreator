const puppeteer = require('puppeteer-extra')

// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(
    AdblockerPlugin({
        // Optionally enable Cooperative Mode for several request interceptors
        interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
    })
)

exports.puppeteerInit = async () => {

    //Launches a browser instance
    const browser = await puppeteer.launch(
        {
            ignoreDefaultArgs: ['--disable-extensions'],
            headless: true,
            args: ['--no-sandbox', "--disabled-setupid-sandbox", '--start-maximized']

        }
    );

    // // Creates a new page in the default browser context
    return await browser.newPage();
}
