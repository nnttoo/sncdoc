import { sleep } from "./tools.mjs";

export class ScrollTools{
    
    /**
     * 
     * @param {number} scollNumb 
     */
    localStoragesaveScroll(scollNumb){
        let localstorage = window.localStorage;
        localstorage.setItem("scrollpos", scollNumb + "");
    }

    localStorageGetScroll(){
        let localstorage = window.localStorage;
        let scollposstr = localstorage.getItem("scrollpos");
        return Number(scollposstr);
    }
    
    async goToScroll(){
        await sleep(1000);
        try {
            let scrollpos = this.localStorageGetScroll();
            document.documentElement.scrollTo(0,scrollpos);

        } catch (error) {
            
        }
    }

    saveScroll(){
        
        try {
            this.localStoragesaveScroll(document.documentElement.scrollTop);
        } catch (error) {
            
        }
    }
    
}