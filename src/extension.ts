// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import cp = require('child_process');
import path = require('path');
import * as vscode from 'vscode';

export class IdeaDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {

	/**
	 * Implement DocumentFormattingEditProvider interface.
	 * @param document Document to format
	 * @param options Formatting options
	 * @param token 
	 * @returns a formatted document
	 */
	public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
		return this.doFormatDocument(document, options, token);
	}

	/**
	 * Execute idea format to a document using idea64 executable.
	 * @param document Document to format
	 * @param options Formatting options
	 * @param token 
	 * @returns a formatted document
	 */
	private doFormatDocument(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
		return new Promise((resolve, rejects) => {
			let file = document.fileName;
			let tempFile = path.join(path.dirname(file), "___format___" + path.basename(file));
			// vscode.window.showInformationMessage('Create temporary file ' + tempFile);
			let wsedit = new vscode.WorkspaceEdit();
			let filePath = vscode.Uri.file(tempFile);
			wsedit.createFile(filePath, { ignoreIfExists: false });
			vscode.workspace.applyEdit(wsedit);

			let executable = "C:\\Program Files\\JetBrains\\IntelliJ IDEA Community Edition 2021.1.3\\bin\\idea64.exe";
			let args = ['format', tempFile];

			// vscode.window.showInformationMessage("Filename is : " + file + "executable is : " + executable + "args are : " + args);

			let edits: vscode.TextEdit[] = [];

			let child = cp.spawnSync(executable, args);
			vscode.window.showInformationMessage('file formated');

			// wsedit.deleteFile(filePath);
			// vscode.workspace.applyEdit(wsedit);
			return resolve(edits);

		});
	}

}

export function activate(context: vscode.ExtensionContext) {
	let formatter = new IdeaDocumentFormattingEditProvider();
	let mode = "java";
	vscode.languages.registerDocumentFormattingEditProvider(mode, formatter);
}
