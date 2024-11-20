import { browser } from "../puppeteer/index.js";
import {videoStatus,videoStatus2} from "../videostatus/index.js";
import {logToFile} from "../utils/index.js";
import mcq from "../Questions/mcq/index.js";

export default async function playVideo(video,title) {
    const videopage = await browser.newPage(); // new tab
    // Set screen size.
    await videopage.setViewport({width: 1080, height: 1024});
    await videopage.goto(video); // video iframe link page
    await videopage.waitForSelector("#player1");
    await videopage.evaluate(()=>{
        player1.play() //play video
    })
    process.stdout.write(`\r Watching ${title} \n`);
    await videoStatus(videopage); // current video status
    try {
        await mcq(videopage); //Assessment
    } catch (error) {
        
    }
    const time = await videopage.evaluate(()=>{
        return player1.getDuration(); // video duration
    })
    logToFile(`${Number(time)/60} min added by ${title}`)
    process.stdout.write(`\r ${Number(time)/60} min added \n`)

    videopage.close();
}