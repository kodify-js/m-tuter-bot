import {baseUrl} from "../constants/index.js"
import videosPage from "../videopage/index.js"
import {logToFile} from "../utils/index.js"
import readline from "readline-sync"; 
import {JSDOM} from "jsdom";

export async function login(page){
    await page.goto(`${baseUrl}/login.php`); // m-tuter login page
    await page.waitForSelector('#email');
    process.stdout.write('Enter your email: ');
    const email = readline.question(); // m-tuter email
    process.stdout.write('Enter your password: ');
    const password = readline.question(); // m-tuter password
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
                logToFile(`${email} on ${date} ============================`); // new index in log file
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
                        subjects.push(subject) // Array of subjects
                    })
                })
                for(let i=0;i<subjects.length;i++){
                    process.stdout.write(`\r${i+1}. ${subjects[i].name}\n`);
                }
                process.stdout.write("Enter subject number:");
                const subject_number = Number(readline.question()); // subject index number

                await page.goto(`${baseUrl}/${subjects[subject_number-1].link}`) //subject videos page
                await page.waitForSelector("ul.pagination");
                const subdom = new JSDOM(await page.content());
                const subdocument = subdom.window.document;
                const max_page = Number(Array.from(subdocument.querySelectorAll("ul li.last a"))[1].getAttribute("href").split("&page=")[1]);
                for(let i=0;i<max_page;i++){
                    process.stdout.write(`\r${i+1}\n`);
                }
                process.stdout.write("Enter page number:");
                const page_number = Number(readline.question()); // page number
                videosPage(subjects,subject_number,page_number,page,max_page,false) // list of videos
        }