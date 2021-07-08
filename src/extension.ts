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

		vscode.window.showInformationMessage('formating file formated');
		let orange = vscode.window.createOutputChannel("Orange");

		let date = new Date();
		// Copy file into a temporary file for formatting
		orange.appendLine(date + "Setting fileName");
		let file = document.fileName;
		let tempFile = path.join(path.dirname(file), "___format___" + path.basename(file));
		orange.appendLine("Copy file");
		let fileUri = vscode.Uri.file(file);
		let tempFileUri = vscode.Uri.file(tempFile);
		vscode.workspace.fs.copy(fileUri, tempFileUri, { overwrite: true });

		date = new Date();
		orange.appendLine(date + "Run idea64 formatter");
		let executable = "C:\\Program Files\\JetBrains\\IntelliJ IDEA Community Edition 2021.1.3\\bin\\idea64.exe";
		let args = ['format', tempFile];
		cp.spawnSync(executable, args);

		date = new Date();
		orange.appendLine(date + "Read formatted file");
		try {
			let text = fs.readFileSync(tempFile, 'utf-8');
			const firstLine = document.lineAt(0);
			const lastLine = document.lineAt(document.lineCount - 1);
			const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
	
	
			orange.appendLine(date + "Delete temp file");
			const edit = new vscode.WorkspaceEdit();
			edit.deleteFile(tempFileUri, { recursive: true, ignoreIfNotExists: true });
			vscode.workspace.applyEdit(edit);
	
			orange.appendLine(text);
	
			date = new Date();
			orange.appendLine(date + "Return TextEdit modifications");
	
			return [(vscode.TextEdit.replace(textRange, text))];
		} catch (error) {
			orange.appendLine("Error : " + error);
		}
		throw new Error("Could not format file");
		
	}

}

export function activate(context: vscode.ExtensionContext) {
	let formatter = new IdeaDocumentFormattingEditProvider();
	let mode = "java";
	vscode.languages.registerDocumentFormattingEditProvider(mode, formatter);
}
