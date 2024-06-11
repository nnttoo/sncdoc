// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import MyServer from './myserver';


let myServer = new MyServer();



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("ini berhasil kah");
	context.subscriptions.push(vscode.commands.registerCommand('sncdoc.customCommand', (uri : vscode.Uri) => {
        myServer.resourceFolder = context.asAbsolutePath( "resources");

		let ws = vscode.workspace.workspaceFolders;

		if(ws != null && ws.length > 0){

			myServer.workspacePath  = ws[0].uri.fsPath;
		}

		if(myServer.workspacePath == null) return;

		let filepath = uri.fsPath;
		if(filepath.startsWith(myServer.workspacePath)){
			filepath = filepath.substring(myServer.workspacePath.length);
		}



		myServer.openFile({ 
			filepath : filepath
		});
    }));  

	const sncdocWatcher = vscode.workspace.createFileSystemWatcher('**/*.sncdoc');
	sncdocWatcher.onDidChange(( ) => { 

		myServer.refreshAllSocket();
    });


	const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'sncdoc' },
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                
                const linePrefix = document.lineAt(position).text.substring(0, position.character);
                // Check if linePrefix contains ![ and (./
                if (linePrefix.includes('![') && linePrefix.includes('(./')) {
                    // Get the current workspace folder
                    const rootPath =path.dirname(document.uri.fsPath);
 
                    if (!rootPath) {
                        return [];
                    }

                    // Get the part after (./
                    const startOfPathIndex = linePrefix.indexOf('(./') + 3;
                    const partialPath = linePrefix.substring(startOfPathIndex, position.character);

                    // Construct full path based on the partial path
                    const fullPath = path.join(rootPath, partialPath);

                    try {
                        // Read files and folders in the directory
                        const items = fs.readdirSync(fullPath);

                        // Create completion items for files and folders
                        const completionItems = items.map(item => {
                            const itemPath = path.join(fullPath, item);
                            const stat = fs.statSync(itemPath);
                            const kind = stat.isDirectory() ? vscode.CompletionItemKind.Folder : vscode.CompletionItemKind.File;
                            const relativePath = path.relative(rootPath!, itemPath).replace(/\\/g, '/');
                            const completionItem = new vscode.CompletionItem(item, kind);
                            completionItem.detail = relativePath;
                            return completionItem;
                        });

                        return completionItems;
                    } catch (error) {
                        console.error('Error reading directory:', error);
                        return [];
                    }
                }

                return undefined;
            }
        },
        '[' // Trigger autocomplete when '[' is typed
    );

    context.subscriptions.push(provider);
	 
}
 

export function deactivate() {
    myServer.close();
}