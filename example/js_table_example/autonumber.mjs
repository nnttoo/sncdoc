
/**
 * 
 * @param {import("./mtool.type").SncDocApi} reader 
 */
export function AutoNumber(reader) {
    /**
     * 
     * @param {string} text 
     * @param {string} startText 
     * @param {string} EndText 
     */
    function selectContent(text, startText, endText) {
        var indexStart = text.indexOf(startText);
        if (indexStart < 0) return null;

        // ditambah panjang text karena index itu dimulai dari start text
        indexStart = indexStart + startText.length;

        let indexEnd = text.indexOf(endText);
        if (indexEnd < 0) return null;

        return {
            textStart: text.substring(0, indexStart),
            textCenter: text.substring(indexStart, indexEnd),
            textEnd: text.substring(indexEnd, text.length)
        }
    }


    /**
     * 
     * @param {string} txt 
     */
    function isNumberRow(txt) {
        var nOnly = txt.replace(/[^0-9]/gi, "");
        return nOnly.length > 0;
    }

    /**
     * 
     * @param {string} txt 
     * @param {number} n 
     */
    function addSpace(txt, n) {
        txt = "" + txt;
        while (txt.length < n) {
            txt = txt + " ";
        }

        return txt;
    }

    /**
     * 
     * @param {string} text 
     * @param {string} start 
     * @param {string} end 
     */
    function addNumberTable(text, start, end) {
        let ctn = selectContent(text, start, end);

        if (ctn == null) return;


        let hitung = 1;
        /**
         * 
         * @param {string} line
         * @param {number} numCol
         */
        function addNumberToCol(line, numCol) {
            let col = line.split("|");
            if (col.length < (numCol + 1)) return line;

            if (isNumberRow(col[numCol])) {
                col[numCol] = " " + addSpace(hitung + "", 4);
                hitung++;
            }

            return col.join("|");
        }



        let tableSplited = ctn.textCenter.split("\n");
        for (let key in tableSplited) {

            console.log(key);
            tableSplited[key] = addNumberToCol(tableSplited[key], 1);
        }

        ctn.textCenter = tableSplited.join("\n");

        return ctn.textStart + ctn.textCenter + ctn.textEnd;
    }

    reader.mdText = addNumberTable(reader.mdText, "<!--autonumbertable-->", "<!--autonumbertableEnd-->");
} 
