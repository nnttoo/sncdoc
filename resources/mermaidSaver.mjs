

export class MermaidSaver{

    /** 
     * @typedef {import("./mtools.mjs").Mtools} Mtools 
     * @type {Mtools}
    */
    mtools = null;

    /**
     * 
     * @param { Mtools} mtoolsIn 
     */
    constructor(mtoolsIn){ 
        this.mtools = mtoolsIn;
    }

    async deleteAllSvgFile(){

        var listFile = [];
        for(let i=1;i<21;i++){
            let fname = "mid_" + i + ".svg";

            listFile.push(this.getSvgFilePath(fname));
        }
 
        await this.mtools.deleteListFile(listFile);
    }


    getRelative(filepath){
        let currentFilepath = this.mtools.docFilePath;
        var normalisePath = currentFilepath.replace(/\\/gi,"/");
        if(normalisePath.startsWith("/")){
            normalisePath = normalisePath.substring(1, normalisePath.length);
        }

        var normaliseSplit = normalisePath.split("/");
        var startPath = "./";
        if(normaliseSplit.length > 1){
            startPath = "../";

            for(var i =2;i< normaliseSplit.length;i++){
                startPath += "../";
            }
        } 

        if(filepath.startsWith("/") || startPath.startsWith("\\")){
            filepath = filepath.substring(1,filepath.length);
        }


        return startPath + filepath;
    }

    getSvgFilePath(filename){
        var filepathBase = this.mtools.docFilePath;
        let extension = ".sncdoc";
        if(filepathBase.endsWith(extension)){
            filepathBase = filepathBase.substring(0, filepathBase.length - extension.length);
        }
        filepathBase = filepathBase.replace(/[^a-zA-Z0-9)]/gi,"_");
        let fpath = "/sncdoc_img/"  + filepathBase + "_" + filename;
        return fpath;
    }

    /**
     * 
     * @param {string} filename 
     * @param {string} filecontent 
     */
    async saveMermaid(filename, filecontent){

        let fpath = this.getSvgFilePath(filename);
       
        try {

            await this.mtools.saveText(fpath,filecontent);
        } catch (error) {
            
        } 
        
        var relativeFileapth =  this.getRelative(fpath); 

        return relativeFileapth;
    }
}