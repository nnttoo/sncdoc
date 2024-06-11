/**
 * 
 * @param {number} time 
 * @returns 
 */
export function sleep(time){
    return new Promise((r,x)=>{
        setTimeout(r,time);
    })
}
