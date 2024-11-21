export default async function question(videopage) {
    await videopage.waitForSelector(".container-fluid  div.row div div div .question")
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(10000);
        await videopage.evaluate( async function(){
               try {
                    const delay = ms => new Promise(res => setTimeout(res, ms)); // wait function
                    const questions = Array.from(document.querySelectorAll(`.container-fluid  div.row div div div .question`));  //list of questions 
                     await delay(10000); // wait for 10s
                     for(let i=0;i<questions.length+2;i++){
                             try {
                                // MCQ answers 
                                const answer = document.querySelector(`.row #dispanswer${i+2}`).innerHTML.trim().toLocaleLowerCase();
                                // MCQ options
                                const option = Array.from(questions[i].querySelectorAll(`.choosebest div.optionpart label`)); 
                                    option.map(async (data)=>{
                                        if(data.querySelector("span").innerText.trim().toLocaleLowerCase()==answer){
                                            data.querySelector("input").click();
                                        }
                                })
                                // submit answer
                                questions[i].querySelector(`#chngbutdiv${i+2} .result_submit_strip #quiz${i+2}`).click();
                                questions[i].querySelector(`#chngbutdiv${i+2} .result_submit_strip #proceed${i+2}`).click();   
                           } catch (error) {
                                    try {
                                        // true & false answers
                                       const answer = document.querySelector("#tfanswer2").getAttribute("value").split(",");
                                        // true & false questions
                                       const option = Array.from(questions[i].querySelectorAll(`div div.truefalse`)); 
                                          option.map(async (data,index)=>{
                                            // answering question
                                              if(answer[index].includes("true")){
                                                Array.from(data.querySelectorAll("div.right_cursor label input"))[0].click()
                                              }else{
                                                Array.from(data.querySelectorAll("div.right_cursor label input"))[1].click()
                                              }
                                      })
                                      // submit answers
                                      questions[i].querySelector(`#tfsubmit${i+2}`).click();
                                      questions[i].querySelector(`tfshow${i+2}`).click(); 
                                    } catch (error) {
                                        process.stdout.write(`\r assessment skiped \n`)
                                        logToFile(`assessment skiped`)
                                    }
                 
                           }              
                    }
               } catch (error) {
                    
               }
            })
}