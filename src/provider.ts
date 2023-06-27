import * as vscode from 'vscode';
import { parseJenkinsFile } from './parser';

export class JenkinsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        return new Promise((resolve, reject) => {
            let symbols: vscode.DocumentSymbol[] = parseJenkinsFile(document.getText());
            resolve(symbols);
        });
    }
}
