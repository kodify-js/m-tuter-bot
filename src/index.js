import {login} from "./login/index.js"
import { browser } from "./puppeteer/index.js";

const page = await browser.newPage();
// Set screen size.
await page.setViewport({width: 1080, height: 1024});
login(page);