
async function sleep(second){
    return new Promise((r)=>{
        setTimeout(r,second);
    });
}

/**
 * 
 * @param {HTMLDivElement} elem 
 */
async function addPrinterSize(elem){
    await sleep(1000);
 

    var heaidht = elem.clientHeight + 100;
    var width = elem.clientWidth + 100;

    console.log("set printer page ; " + heaidht);
    var css = `
    @page {
        size: ${width}px ${heaidht}px; 
        margin:  0px;
    }`;
    
     
    var  head = document.head || document.getElementsByTagName('head')[0]
    var  style = document.createElement('style');
    style.innerText = css;

    head.appendChild(style);
}

function renderMarkdown(txt, selector){ 
    var defaults = {
        html: true, // Enable HTML tags in source
        xhtmlOut: true, // Use '/' to close single tags (<br />)
        breaks: false, // Convert '\n' in paragraphs into <br>
        langPrefix: 'language-', // CSS language prefix for fenced blocks
        linkify: true, // autoconvert URL-like texts to links
        typographer: true, // Enable smartypants and other sweet transforms
        // options below are for demo only
        _highlight: true, // <= THIS IS WHAT YOU NEED
        _strict: false,
        _view: 'html' // html / src / debug
    };

    // and then do this:

    defaults.highlight = function (str, lang) {
        var esc = md.utils.escapeHtml;

        if (lang && hljs.getLanguage(lang)) {
        try {
            return '<pre class="hljs"><code>' +
                hljs.highlight(str,{language: lang, ignoreIllegals: true }).value +
                '</code></pre>';
        } catch (__) {}
        }else{
        return '<pre class="hljs"><code>' + esc(str) + '</code></pre>';
        }

    };


    md = window.markdownit(defaults);

    const result = md.render(txt);

     

    var p =  document.querySelector(selector);
    p.innerHTML = result;

    addPrinterSize(p);
}