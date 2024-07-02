 

async function drawImageSrc(imgsrc){
    var imgelem = new Image();  
    await new Promise((r,x)=>{
        imgelem.onload = r;
        imgelem.src = imgsrc;
    });

    return imgelem;
}

/**
 * 
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas){
    return new Promise((r,x)=>{
        canvas.toBlob((blob)=>{
            r(blob);
        }, 'image/png');
    })
}

/**
 * 
 * @param {string} svgcontent 
 * @param {int} reqwidth 
 * @returns {Promise<Blob>}
 */
export async function svgToPng(svgcontent, reqwidth){
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgcontent);
        

    var canvas = document.createElement('canvas');

    var imgelem =  await drawImageSrc(svgDataUrl);
   
    var pengali = reqwidth / imgelem.width; 

    var cwidth =  imgelem.naturalWidth * pengali;
    var cheight =  imgelem.naturalHeight * pengali;

    canvas.width = cwidth * 2;
    canvas.height = cheight * 2; 

    var ctx = canvas.getContext('2d'); 
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(imgelem, 0, 0 );
    
    var blob = await canvasToBlob(canvas);  


    return blob;
}