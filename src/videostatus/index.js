export async function videoStatus(videopage) {
    const getState = await videopage.evaluate(()=>{
        return player1.getState();
    })
    
    if(getState!="complete"){
        return videoStatus(videopage);
    }else{
        return 1;
    }
}
export async function videoStatus2(videopage) {
    const getState = await videopage.evaluate(()=>{
        return player3.getState();
    })
    
    if(getState!="complete"){
        return videoStatus(videopage);
    }else{
        return 1;
    }
}
