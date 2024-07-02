import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import express, { urlencoded } from 'express';
import WebSocket, { Server } from 'ws';

function openBrowser(url: string) {
    switch (process.platform) {
        case 'darwin':
            cp.exec(`open -a "Google Chrome" "${url}"`);
            break;
        case 'win32':
            cp.exec(`start chrome "${url}"`);
            break;
        case 'linux':
            cp.exec(`xdg-open "${url}"`);
            break;
    }
}

async function readBody(req: express.Request) {
    let bodystr: any = await new Promise((r, x) => {
        let fileData: Buffer[] = [];
        req.on("data", (chunk) => {
            fileData.push(chunk);
        });

        req.on("end", () => {
            const fileBuffer = Buffer.concat(fileData);
            r(fileBuffer);
        })
    });

    return bodystr;
}

function getCurrentFileDir(strReferer : string | undefined){
    if(typeof(strReferer) == "undefined") return "";
    try { 
        let u = new URL(strReferer).pathname;
        return path.dirname(u);
    } catch (error) {
        
    } 
    return "";
}

export default class MyServer {
    resourceFolder?: string;
    workspacePath?: string;
    workFileFolderPath?: string;

    server: http.Server | null = null;

    wss?: WebSocket.WebSocketServer;

    refreshAllSocket() {
        if (this.wss == null) return;

        this.wss.clients.forEach((w) => {
            if (w.readyState === WebSocket.OPEN) {
                w.send("refresh");
            }
        })
    }



    private createServer() {

        return new Promise(async (r, x) => {
            if (this.resourceFolder == null || this.workspacePath == null) return;
            var htmlPath = path.join(this.resourceFolder, "index.html");

            var htmlctn = await fs.promises.readFile(htmlPath);
            const app = express();

            this.server = http.createServer(app);

            app.use("/static", express.static(this.resourceFolder));

            app.get("/getcontent", async (req, res) => {
                let filecontent = "";
                if (this.workspacePath != null) {
                    try {
                        let file = req.query.file as string;
                        let fpath = atob(file);
                        fpath = path.join(this.workspacePath, fpath);
                        this.workFileFolderPath = path.dirname(fpath);

                        
                        filecontent = (await fs.promises.readFile(fpath)).toString();
                    } catch {

                    }
                }

                res.setHeader('Content-Type', 'text/plain');
                res.send(filecontent);
            })

            app.post("/savetext", async (req, res) => {
                if (this.workspacePath == null) return; 
                var filepath = req.query.file as string;

                


                
 

                // hanya izinkan menulis file md dan svg
                // biar lebih aman

                var fpathLower = filepath.toLocaleLowerCase();
                if (fpathLower.endsWith(".md") ||
                    fpathLower.endsWith(".svg") || 
                    fpathLower.endsWith(".jpg") || 
                    fpathLower.endsWith(".png") 

                ) {
                    if(filepath.startsWith(".")){
                        var fileDir = getCurrentFileDir(req.get("Referer"));
                        filepath = path.join(fileDir,filepath);
                    }
                    var fileFullpath = path.join(this.workspacePath, filepath);

                    try {
                        // buat dulu foldernya jika belum ada
                        await fs.promises.mkdir(path.dirname(fileFullpath));
                    } catch (error) {
                    }


                    let bodystr = await readBody(req);   
                    await fs.promises.writeFile(fileFullpath, bodystr);
                } 

                res.setHeader('Content-Type', 'text/html');
                res.send("berhasil");

            });

            app.post("/delete_files", async (req, res) => {
                if (this.workspacePath == null) return;

                let body = await readBody(req);
                let jumlahFile = 0;
                try {

                    let listfile: string[] = JSON.parse(body);
                    for (let itemFile of listfile) {
                        try {

                            // Check hanyaboleh hapus svg.
                            // biar aman, takutnya kepanggil dan malah
                            // menghapus file penting
                            if (!itemFile.toLocaleLowerCase().endsWith(".svg")) continue;

                            if(itemFile.startsWith(".")){
                                var fileDir = getCurrentFileDir(req.get("Referer"));
                                itemFile = path.join(fileDir,itemFile);
                            }

                            var fileFullpath = path.join(this.workspacePath, itemFile);

                            await fs.promises.unlink(fileFullpath);
                            jumlahFile++;
                        } catch (error) {

                        }
                    }

                } catch (error) {

                }

                res.setHeader('Content-Type', 'text/html');
                res.send("file didelete " + jumlahFile);

            });

            app.use("/", async (req, res) => {

 
                if (this.workspacePath == null) {
                    res.send("error");
                    return;
                }

                let fullpath = path.join(this.workspacePath, req.path);

                if (!fs.existsSync(fullpath)) {
                    res.send("file not found");
                    return;
                }

                if (fullpath.endsWith(".sncdoc")) {
                    res.setHeader('Content-Type', 'text/html');
                    res.send(htmlctn);

                    return;
                }

                res.sendFile(fullpath);


            });

            this.server = app.listen(0, () => {
                r(null);
            });


            var server = this.server;
            this.wss = new WebSocket.WebSocketServer({ server });
        })
    }

    public async openFile(arg: {
        filepath: string

    }) {
        if (this.server == null) await this.createServer();

        let filepath = arg.filepath;

        filepath = filepath.replace(/\\/gi, "/");

        console.log(filepath);

        if (filepath.startsWith("/")) {
            filepath = filepath.substring(1, filepath.length);
        }


        var actualPort = (this.server as any)?.address().port;
        openBrowser(`http://localhost:${actualPort}/${filepath}`);



    }

    public close() {
        if (this.server != null) {
            this.server.close();
            this.server = null;
        }
    }
}