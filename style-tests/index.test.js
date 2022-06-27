import puppeteer from "puppeteer";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("styles.test", () => {
    // Give time to any async operation to complete after each test

    let originalTimeout;
    beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    afterEach(() => (jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout));   

    [
        { width: 529, height: 2000 },
        { width: 605, height: 1500 },
        { width: 900, height: 1500 },
    ].forEach(({ width, height }) =>
        it(`should have proper view for ${width}x${height} params`, async () => {
            // setting up puppeteer
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // set current view port size
            await page.setViewport({ width, height });
            // navigate to the page, served with webpack
            // IMPORTANT!: test assumes webpack is started
            await page.goto("http://localhost:9001", { waitUntil: "networkidle0" });

            const image = await page.screenshot();
            await browser.close();

            expect(image).toMatchImageSnapshot(
                process.env.CI
                    ? {
                        failureThreshold: 0.005,
                        failureThresholdType: "percent",
                    }
                    : undefined
            );
        })
    );
});
