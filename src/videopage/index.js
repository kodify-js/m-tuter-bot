import {baseUrl} from "../constants/index.js"
import openVideo from "../openvideo/index.js"
import readline from "readline-sync"; 
import {JSDOM} from "jsdom";
export default async function videosPage(subjects,subject_number,page_number,page,max_page,isnextPage) {
    const current_page =  (`${baseUrl}/${subjects[subject_number-1].link}&page=${page_number}`)
        await page.goto(`${current_page}`)
        await page.waitForSelector(".mt-grids")

        //using jsdom
        const video_dom = new JSDOM(await page.content());
        const videodocument = video_dom.window.document;
        const videos = Array.from(videodocument.querySelectorAll(".mt-grids .grid_view .custom-card"));
        // Array of videos
        const videolist = videos.map((data,index)=>{
            const video = {
                "title":data.querySelector(".card-content .col-md-11 .card-title a").getAttribute("data-original-title"),
                "number":index+1,
                "link":`${baseUrl}/${data.querySelector(".card-content .col-md-11 .card-title a").getAttribute("data-href_url")}`
            }
            return video;
        })
        var video_number; // video index number
        if(!isnextPage){
            for(let i=0;i<videolist.length;i++){
                process.stdout.write(`\r${i+1}. ${videolist[i].title}\n`);
            }
            process.stdout.write("Enter video number:");
            video_number=Number(readline.question());
        }else{
            video_number = 1;
        }
        openVideo(page,video_number,videolist,subjects,subject_number,page_number,max_page) // play video
}