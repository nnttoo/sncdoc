
/**
 * 
 * @param {string} svgcontent 
 * @param {int} reqwidth 
 * @returns {Promise<Blob>}
 */
export function svgToPng(svgcontent, reqwidth){
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgcontent);
        

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var imgelem = new Image();  

    
    var resolve;
    var p = new Promise((r,x)=>{
        resolve = r;
    });

    

    imgelem.onload = async ()=>{

        var pengali = reqwidth / imgelem.naturalWidth;
        canvas.width = imgelem.naturalWidth * pengali;
        canvas.height = imgelem.naturalHeight * pengali;


        ctx.drawImage(imgelem, 0, 0);
        
        canvas.toBlob((blob)=>{
            resolve(blob); 
        },'image/png') 
    }

    imgelem.src = svgDataUrl;

    return p;
}