import { MermaidSaver } from "./mermaidSaver.mjs";
import { svgToPng } from "./svgToPng.mjs";

export class Mtools{

    docFilePath = "";  
    docFilePathBase64 = "";
    /** @type {MermaidSaver} */
    mermaidSaver = null;

    constructor(){
        this.mermaidSaver = new MermaidSaver(this);
        this.setFileDocPath(); 
    }

    /** @param {()=>void} callback */
    async runWebSocket(callback){ 
        const port = window.location.port;
        const host = window.location.hostname; 
        const wsUrl = `ws://${host}:${port}`; 
        const ws = new WebSocket(wsUrl);

        ws.addEventListener("message",()=>{
            callback();
            console.log("refresh");
        })
    }

    setFileDocPath(){ 

        this.docFilePath = window.location.pathname; 
        this.docFilePathBase64 = btoa(this.docFilePath);
        console.log(this.docFilePathBase64);
    }



    /** @returns {Promise<string?>} */
    async getFileContent(){ 
    
        var surl = "/getcontent?file=" + this.docFilePathBase64; 
        var response = await fetch(surl);
        return await response.text();
    }  

    async saveText(filepath, filecontent){
        var params = new URLSearchParams();
        params.append("file", filepath);
    
        var str = params.toString(); 
        await fetch("/savetext?" + str,{
            method : "POST",
            body : filecontent,
            headers: {
                'Content-Type': 'application/octet-stream'  // Atur sesuai dengan jenis konten yang benar
            }
        });
    } 


    async saveSvgToPng(filepath, svgcontent, maxwidth){
        var blob = await svgToPng(svgcontent, maxwidth); 
        return this.saveText(filepath,blob);
    }

    /** @type {Mtools} */
    static instance 

    /** @return {Promise<Mtools>} */
    static async getInstance(){
        if(this.instance == null){
            this.instance = new Mtools();
            await this.instance.mermaidSaver.deleteAllSvgFile();
        }

        return this.instance;
    }

    /** @param {string}  content */
    async saveMarkdown(content){
        var extension = ".sncdoc";
        var curFilename = this.docFilePath;
        if(curFilename.endsWith(extension)){
            curFilename =   curFilename.substring(0, curFilename.length - extension.length);
        }
        
        curFilename +=".md";

        this.saveText(curFilename,content);

    }

    /**
     * 
     * @param {string[]} listFiles 
     */
    async deleteListFile(listFiles){
        let jsonStr = JSON.stringify(listFiles); 

        console.log("lah ini gemana sih");

        var r = await fetch("/delete_files",{
            method : "POST",
            body : jsonStr
        });
        var t = await r.text();

        console.log(t);
    }

}  