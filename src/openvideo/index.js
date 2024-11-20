import playVideo from "../playvideo/index.js";
import videosPage from "../videopage/index.js";

export default async function openVideo(page,video_number,videolist,subjects,subject_number,page_number,max_page) {
    await page.goto(`${videolist[video_number-1].link}`) // video page
    const video = await page.evaluate(()=>{
        return document.querySelector("#embed-cust").getAttribute("src"); //video link
    })
    await playVideo(video,videolist[video_number-1].title); // play video in new tab
    video_number++
    if(videolist.length>=video_number){
        openVideo(page,video_number,videolist,subjects,subject_number,page_number,max_page) // auto play next
    }else{
        if(!max_page<(page_number+1)){
            videosPage(subjects,subject_number,page_number+1,page,max_page,true) // auto play next from next page
        }
    }
}