mermaid.initialize({
    startOnLoad: false, // agar Mermaid tidak otomatis memproses konten Mermaid saat memuat halaman
    });


export class MermaidParser{
    mermaidID = 0;

    getMermaidId(){
        this.mermaidID++;
        return "mid_" + this.mermaidID;
    }
    

    /**
     * @param {string} txt  
     * @param {string} id */
    async  renderMermaid(txt, id){ 
        try {
            
            var w =  await mermaid.render(id+"ddd", txt); 
            return `${w.svg}`;
        } catch (error) {
            console.log(error);
        }

        return null;

    }
}
 

