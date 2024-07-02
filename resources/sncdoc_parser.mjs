import { MermaidParser } from "./MarkdownViewer/mermaid/mermaid_generator.mjs";
import { Mtools } from "./mtools.mjs";
import {sleep} from "./tools.mjs"
 

export class SncDocParser{

    mdText = "";

    /**
     * @type {Mtools?}
     */
    mtools = null;
    
    /** @type {{[key : string] : string}} */
    dictionary = {};

    callTable(){
        function replaceTable(txt){
            var split = txt.split("\n");
            var realTable = [];
            for(var i of split){ 
    
                i = i.replace(/[\n\r]/g, "");
    
                if(i.startsWith("|")){
                    realTable.push(i);
                } else {
                    var posTerakhir = realTable.length - 1;
                    if(posTerakhir > 0){
    
                        var txtClean = i
                        realTable[ posTerakhir ] += txtClean;
    
                    }
                    
                }
            } 
            
            return realTable.join("\n");
        }

        let mdText= this.mdText;

        const evalRegex = /SNC_TABLE\b[^\n]*\n([\s\S]*?)END_SNC_TABLE/g; 
        let textResult = mdText.replace(evalRegex,function(match,txtJs){ 
                return replaceTable(txtJs);
        });

        this.mdText = textResult;
        
    }

    parseDictionary(){
        let mdText = this.mdText;


        // taroh jam

        var d = new Date();
        this.dictionary["date"]  =  d.toLocaleString('en-US',{
            day: '2-digit',
            month: 'long', 
            year: 'numeric'
        });
        
        this.dictionary["hour"] = d.toLocaleString("en-us",{ 
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit', 
            hour12: false 
        });
 

          



        const evalRegex = /```dictionary_json\b[^\n]*\n([\s\S]*?)```/g; 
        let textResult = mdText.replace(evalRegex,(match,txtJsCall)=>{ 
            //harus pakai arrow supaya this bisa
            try {
                let dictionaryObj = JSON.parse(txtJsCall);

                
                if(dictionaryObj != null){
                    Object.assign(this.dictionary,dictionaryObj);
                } 
            } catch (error) {
                
            }                
            
            return "";
        });

        

        this.mdText = textResult;
    }



    callDictionary(){
        let dictionaryObj = this.dictionary;
        let mdText = this.mdText;
        let regextText = "DICT\\[(.*?)\\]";
        let regexDic = new RegExp(regextText,"gi"); 


        console.log(this.dictionary);
        let textResult = mdText.replace(regexDic,(m,p)=>{

            console.log(p);
            console.log(dictionaryObj[p]);
            if(dictionaryObj[p] != null){
                return dictionaryObj[p];
            }

            return "<!-- "+m +" -->";
        })
        
        this.mdText = textResult;

    }

    async callEval(){

        
        /** @type  {Promise[]} **/
        var listPromise = [];

        let mdText = this.mdText;
        const evalRegex = /```eval_js\b[^\n]*\n([\s\S]*?)```/g; 
        let textResult = mdText.replace(evalRegex, (match,txtJsCall)=>{ 

            let evalInnerCall = async()=>{
                try {
                    await sleep(1);
                    await execEval(txtJsCall,this); 
                } catch (error) {
                    console.log("eval Error : " + error);
                }

            }

            listPromise.push(evalInnerCall());

            return "";
        });  

        this.mdText = textResult;        
        await Promise.all(listPromise); 
    }
 
    async convertMermaidToImage() { 
        
        /** @type  {Promise[]} **/
        var listPromise = [];

        let mdText = this.mdText;
        let mytools = this.mtools;
 

        let mermaid = new MermaidParser();

        const mermaidRegex = /```embed_mermaid\b[^\n]*\n([\s\S]*?)```/g;
        var textResult = mdText.replace(mermaidRegex, (match, txtMermaid) => {
            var mermaidid = mermaid.getMermaidId();
            listPromise.push(new Promise(async (r,x)=>{
                     
                var svgElement = await mermaid.renderMermaid(txtMermaid,mermaidid);  
                var mermaidContent = "";

                if(svgElement != null){
                    var imgpath = await mytools.mermaidSaver.saveMermaid(
                        mermaidid + ".png", 
                        svgElement
                    ); 

                    mermaidContent = `![${mermaidid}](${imgpath})`;
                } else {
                    mermaidContent = "```\n" + txtMermaid + "\n```";
                } 

                textResult  = textResult.replace(`imgmermaidid${mermaidid}`, 
                    mermaidContent
                );
                r();
                
            }));


            return `imgmermaidid${mermaidid}`;
        });

        await Promise.all(listPromise);

        this.mdText = textResult; 
    }

    

    /**
     * 
     * @param {string} mdText 
     * @param {Mtools} mtools 
     */
    static async parse(mdText,mtools){
        let parser = new SncDocParser();
        parser.mdText = mdText;
        parser.mtools = mtools;

        try {
            
            parser.parseDictionary();
        } catch (error) {
            
        }

        try {
            
            await parser.callEval();
        } catch (error) {
            
        }

        try {
            
            parser.callDictionary();

        } catch (error) {
            
        }

        try {
            
            parser.callTable();
        } catch (error) {
            
        }

        try {
            
            await parser.convertMermaidToImage();
        } catch (error) { 
        }

        
        return parser.mdText;
    }
}