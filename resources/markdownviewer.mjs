import {Mtools} from "./mtools.mjs" 
//import {MermaidParser} from "./MarkdownViewer/mermaid/mermaid_generator.mjs"
import {SncDocParser} from "./sncdoc_parser.mjs"  
import { ScrollTools } from "./scrolltools.mjs";

/** 
 * @param {string} template
 * @param {{ [key : string ] : any}} obj
 * 
 * **/
function renderMustache(template, obj){ 
    /** @type {string} **/
    const rendered = Mustache.render(template, obj);
    
    return rendered;
}  


function refreshAllSvgImg(){
    let imgs = document.querySelectorAll("img");

    for(let item of imgs){
        let hrefsrc = item.getAttribute("src");
        if(hrefsrc != null && hrefsrc.endsWith(".svg")){
            hrefsrc = hrefsrc + "?d=" + Date.now()
            item.setAttribute("src",hrefsrc);
        }
    }
}
 

export default async function render(){
    let mytools = await  Mtools.getInstance(); 

    let textLaporan = await mytools.getFileContent();
    
    textLaporan = await SncDocParser.parse(
        textLaporan,
        mytools
    );
 
      
    renderMarkdown(textLaporan,"#ctn");  
    mytools.saveMarkdown(textLaporan);

    function setTitle(){
        try {
            
            var title = document.querySelector("h1").innerText; 
            document.querySelector("title").innerText = title;
        } catch (error) {
            
        }
    }

    setTitle();
    let scolltools = new ScrollTools(); 
    scolltools.goToScroll();

    mytools.runWebSocket(()=>{
        refreshAllSvgImg();
        scolltools.saveScroll();
        window.location.reload();
    });
}