import * as vscode from 'vscode';
import {JenkinsDocumentSymbolProvider} from './provider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider(
			{ language: 'groovy', scheme: 'file' },
			new JenkinsDocumentSymbolProvider()
		)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
