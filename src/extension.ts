// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import cp = require('child_process');
import path = require('path');
import fs = require('fs');
import * as vscode from 'vscode';
import { worker } from 'cluster';

export class IdeaDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {

	/**
	 * Implement DocumentFormattingEditProvider interface.
	 * @param document Document to format
	 * @param options Formatting options
	 * @param token 
	 * @returns a formatted document
	 */
	public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {
		return this.doFormatDocument(document, options, token);
	}

	/**
	 * Execute idea format to a document using idea64 executable.
	 * @param document Document to format
	 * @param options Formatting options
	 * @param token 
	 * @returns a formatted document
	 */
	private doFormatDocument(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {

		let date = new Date();
		vscode.window.showInformationMessage("Formating file... ");
		let logWindow = vscode.window.createOutputChannel("idea64-format");

		// Copy file into a temporary file for formatting
		let file = document.fileName;
		let tempFile = path.join(path.dirname(file), "___format___" + path.basename(file));
		let fileUri = vscode.Uri.file(file);
		let tempFileUri = vscode.Uri.file(tempFile);
		date = new Date();
		logWindow.appendLine("[" + date + "] Create temporary file");
		vscode.workspace.fs.copy(fileUri, tempFileUri, { overwrite: true });
		let config = vscode.workspace.getConfiguration("idea-format");
		let executable = config.get<string>("idea-executable");
		let args = ['format', tempFile];

		if (typeof executable === 'string') {
			date = new Date();
			logWindow.appendLine("[" + date + "] Starting ideda64 executable");
			cp.execFileSync(executable, args);
	
			date = new Date();
			logWindow.appendLine("[" + date + "] End of ideda64 execution");
			try {
				let text = fs.readFileSync(tempFile, 'utf-8');
				const firstLine = document.lineAt(0);
				const lastLine = document.lineAt(document.lineCount - 1);
				const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
	
	
				date = new Date();
				logWindow.appendLine("[" + date + "] Deleting temporary file");
				const edit = new vscode.WorkspaceEdit();
				edit.deleteFile(tempFileUri, { recursive: false, ignoreIfNotExists: true });
				vscode.workspace.applyEdit(edit);
	
	
				date = new Date();
				logWindow.appendLine("[" + date + "] Applying modification");
				return [(vscode.TextEdit.replace(textRange, text))];
			} catch (error) {
				vscode.window.showInformationMessage("Error trying to format.");
				date = new Date();
				logWindow.appendLine("[" + date + "] Error while formatting");
			}
			throw new Error("Could not format file");
		}
		throw new Error("Could not get executable path");	
	}
	
}

let languages: string[] = [];
for (let l of ['java', 'groovy', 'powershell', 'yaml', 'shell', 'bat']) {
	let confKey = `language.${l}.enable`;
	if (vscode.workspace.getConfiguration('idea-format').get(confKey)) {
		languages.push(l);
	}
}

const MODES: vscode.DocumentFilter[] = languages.map((language) => ({ language, scheme: 'file' }));

export function activate(context: vscode.ExtensionContext) {

	let availableLanguages = {};
	let formatter = new IdeaDocumentFormattingEditProvider();

	MODES.forEach((mode) => {
		context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(mode, formatter));
	});
}
