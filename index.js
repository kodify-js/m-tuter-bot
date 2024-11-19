import puppeteer from 'puppeteer';
import readline from "readline-sync"; 
import {JSDOM} from "jsdom";
import {createWriteStream} from "fs";

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
const baseUrl = "https://www.m-tutor.com";

// Set screen size.
await page.setViewport({width: 1080, height: 1024});

async function login(){
    await page.goto(`${baseUrl}/login.php`);
    await page.waitForSelector('#email');
    process.stdout.write('Enter your email: ');
    const email = readline.question();
    process.stdout.write('Enter your password: ');
    const password = readline.question();
    await page.type('#email', email);
    await page.type('#password', password);
    await page.evaluate(() => {
        document.querySelector('input[type=submit]')?.click();
      });
      try {
        await page.waitForSelector('button.confirm'); 
      } catch (error) {
        
      }
        setTimeout(()=>{
            page.evaluate(() => {
                try {
                    document.querySelector('button.confirm')?.click();
                } catch (error) {
                    
                }
              });
        },1000)
                await page.waitForNavigation();
                await page.waitForSelector("section#RecommendedID");
                await page.click("section#RecommendedID .row .col-md-6 .home_box")
                await page.waitForSelector("section#RecommendedID");
                const date = new Date();
                logToFile(`${email} on ${date} ============================`);
                // using jsdom 
                const dom = new JSDOM(await page.content());
                const document = dom.window.document;
                await page.waitForSelector("section#RecommendedID .row")
                const row = Array.from(document.querySelectorAll('section#RecommendedID .row'));
                const subjects = [] // Array of Subjects
                row.map((data,index)=>{
                    const cards = Array.from(data.querySelectorAll("div.col-md-4"));
                    cards.map((card,i)=>{
                        const subject = {
                            "name":card.querySelector("a.home_box div.recource_top div.recource_head h1.head_1").getAttribute("title"),
                            "number":(i+1)+(index*3),
                            "link":card.querySelector("a.home_box").getAttribute("href")
                        }
                        subjects.push(subject)
                    })
                })
                for(let i=0;i<subjects.length;i++){
                    process.stdout.write(`${i+1}. ${subjects[i].name}\n`);
                }
                process.stdout.write("Enter subject number:");
                const subject_number = Number(readline.question());

                await page.goto(`${baseUrl}/${subjects[subject_number-1].link}`)
                await page.waitForSelector("ul.pagination");
                const subdom = new JSDOM(await page.content());
                const subdocument = subdom.window.document;
                const max_page = Number(Array.from(subdocument.querySelectorAll("ul li.last a"))[1].getAttribute("href").split("&page=")[1]);
                for(let i=0;i<max_page;i++){
                    process.stdout.write(`${i+1}\n`);
                }
                process.stdout.write("Enter page number:");
                const page_number = Number(readline.question());
                videosPage(subjects,subject_number,page_number,page,max_page,false)
        }

        async function videosPage(subjects,subject_number,page_number,page,max_page,isnextPage) {
            const current_page =  (`${baseUrl}/${subjects[subject_number-1].link}&page=${page_number}`)
                await page.goto(`${current_page}`)
                await page.waitForSelector(".mt-grids")

                //using jsdom
                const video_dom = new JSDOM(await page.content());
                const videodocument = video_dom.window.document;
                const videos = Array.from(videodocument.querySelectorAll(".mt-grids .grid_view .custom-card"));
                const videolist = videos.map((data,index)=>{
                    const video = {
                        "title":data.querySelector(".card-content .col-md-11 .card-title a").getAttribute("data-original-title"),
                        "number":index+1,
                        "link":`${baseUrl}/${data.querySelector(".card-content .col-md-11 .card-title a").getAttribute("data-href_url")}`
                    }
                    return video;
                })
                var video_number;
                if(!isnextPage){
                    for(let i=0;i<videolist.length;i++){
                        process.stdout.write(`${i+1}. ${videolist[i].title}\n`);
                    }
                    process.stdout.write("Enter video number:");
                    video_number=Number(readline.question());
                }else{
                    video_number = 1;
                }
                openVideo(page,video_number,videolist,subjects,subject_number,page_number,max_page)
        }

        async function openVideo(page,video_number,videolist,subjects,subject_number,page_number,max_page) {
            await page.goto(`${videolist[video_number-1].link}`)
            const video = await page.evaluate(()=>{
                return document.querySelector("#embed-cust").getAttribute("src");
            })
            await playVideo(video,videolist[video_number-1].title);
            video_number++
            if(videolist.length>=video_number){
                openVideo(page,video_number,videolist,subjects,subject_number,page_number,max_page)
            }else{
                if(!max_page<(page_number+1)){
                    videosPage(subjects,subject_number,page_number+1,page,max_page,true)
                }
            }
        }
        
        
        async function playVideo(video,title) {
            const videopage = await browser.newPage();
            // Set screen size.
            await page.setViewport({width: 1080, height: 1024});
            await videopage.goto(video);
            await videopage.waitForSelector("#player1");
            await videopage.evaluate(()=>{
                player1.play()
            })

            process.stdout.write(`Watching ${title} \n`);
            process.stdout.write(`[`);
            await checkStatus(videopage);
                await videopage.waitForSelector(".container-fluid  div.row div div div .question")
                // const dom = new JSDOM(await videopage.content());
                // const document = dom.window.document;
                // const questions = Array.from(document.querySelectorAll(`.container-fluid  div.row div div div .question`));
                // for(let i=0;i<questions.length;i++){
                //     await videopage.evaluate( async ()=>{   
                //             const answer = questions[i].querySelector(`.row #dispanswer${i+3}`).innerHTML.trim().toLocaleLowerCase();
                //             const option = Array.from(questions[i].querySelectorAll(`.choosebest div.optionpart label`)); 
                //                 option.map(async (data)=>{
                //                     if(data.querySelector("span").innerText.trim().toLocaleLowerCase()==answer){
                //                         data.querySelector("input").click();
                //                     }
                //             })
                //             questions[i].querySelector(`#chngbutdiv${i+3} .result_submit_strip #quiz${i+3}`).click();
                //             questions[i].querySelector(`#chngbutdiv${i+3} .result_submit_strip #proceed${i+3}`).click();                        
                //     })
                // }
                const time = await videopage.evaluate(()=>{
                    return player1.getDuration();
                })
                logToFile(`${Number(time)/60} min added by ${title}`)
                process.stdout.write(`${Number(time)/60} min added \n`)
                videopage.close();
          
        }
        async function checkStatus(videopage) {
            const getState = await videopage.evaluate(()=>{
                return player1.getState();
            })
            
            if(getState!="complete"){
                return checkStatus(videopage);
            }else{
                process.stdout.write(`*]\n`);
                return 1;
            }
        }

        function logToFile(message) {
            const logStream = createWriteStream('logs.txt', { flags: 'a' });
            logStream.write(`${message}\n`);
            logStream.end();
          }      
login();