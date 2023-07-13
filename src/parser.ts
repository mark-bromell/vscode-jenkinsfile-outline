import * as vscode from 'vscode';
import Tokenizr, { Token } from 'tokenizr';
import { tokenizeJenkinsfile } from './tokenizer';

export default function parseJenkinsfile(documentText: string): vscode.DocumentSymbol[] {
    const lexer: Tokenizr = tokenizeJenkinsfile(documentText);
    const context: ParserContext = new ParserContext();
    const rules: ParseRuleFunction[] = [
        parseRuleDepthIncrease,
        parseRuleDepthDecrease,
        parseRulePipeline,
        parseRuleStage,
    ];

    do {
        rules.every(rule => !parseRule(lexer, context, rule));
    } while (lexer.peek().type !== 'EOF');

    return [];
}

type ParseRuleFunction = {
    (token: Token, lexer: Tokenizr, context: ParserContext): boolean;
};

function parseRule(
    lexer: Tokenizr,
    context: ParserContext,
    fn: ParseRuleFunction,
): boolean {
    lexer.begin();
    const token = lexer.token();

    if (token === null) {
        lexer.rollback();
        return false;
    }

    let result: boolean;

    try {
        result = fn(token, lexer, context);
    } catch (error) {
        console.error(error);
        result = false;
    }

    if (result) {
        lexer.commit();
    } else {
        lexer.rollback();
    }

    return result;
}

function parseRuleDepthIncrease(token: Token, lexer: Tokenizr, context: ParserContext): boolean {
    if (!(token.type === 'word' && token.value === '{')) {
        return false;
    }

    context.pushDepth();
    return true;
}

function parseRuleDepthDecrease(token: Token, lexer: Tokenizr, context: ParserContext): boolean {
    if (!(token.type === 'word' && token.value === '}')) {
        return false;
    }

    context.popDepth();
    return true;
}

function parseRulePipeline(token: Token, lexer: Tokenizr, context: ParserContext): boolean {
    if (!(token.type === 'word' && token.value === 'pipeline')) {
        return false;
    }

    let range = new vscode.Range(
        new vscode.Position(token.line, token.pos),
        new vscode.Position(token.line, token.pos + token.value.length)
    );
    let selectionRange = new vscode.Range(
        new vscode.Position(token.line, token.pos),
        new vscode.Position(token.line, token.pos + token.value.length)
    );
    let newSymbol: vscode.DocumentSymbol = new vscode.DocumentSymbol(
        'Pipeline',
        '',
        vscode.SymbolKind.File,
        range,
        selectionRange
    );

    context.push(newSymbol);
    return true;
}

function parseRuleStage(token: Token, lexer: Tokenizr, context: ParserContext): boolean {
    if (!(token.type === 'word' && token.value === 'stage')) {
        return false;
    }

    lexer.consume('word', '(');
    const stageName = lexer.consume('string').value;
    lexer.consume('word', ')');

    let range = new vscode.Range(
        new vscode.Position(token.line, token.pos),
        new vscode.Position(token.line, token.pos + token.value.length)
    );
    let selectionRange = new vscode.Range(
        new vscode.Position(token.line, token.pos),
        new vscode.Position(token.line, token.pos + token.value.length)
    );
    let newSymbol: vscode.DocumentSymbol = new vscode.DocumentSymbol(
        stageName,
        '',
        vscode.SymbolKind.Interface,
        range,
        selectionRange
    );

    context.push(newSymbol);
    return true;
}

class ParserContext {
    symbols: vscode.DocumentSymbol[];
    depth: number[];

    constructor(
        symbols: vscode.DocumentSymbol[] = [],
        depth: number[] = [],
    ) {
        this.symbols = symbols;
        this.depth = depth;
    }

    get currentSymbol(): vscode.DocumentSymbol | undefined {
        if (!this.depth) {
            return undefined;
        }

        let symbol = this.symbols[this.depth[0]];
        for (let i = 1; i < this.depth.length; i++) {
            symbol = symbol.children[this.depth[i]];
        }
        return symbol;
    }

    push(symbol: vscode.DocumentSymbol) {
        if (this.currentSymbol) {
            this.currentSymbol.children.push(symbol);
        } else {
            this.symbols.push(symbol);
        }
    }

    pushDepth() {
        if (!this.symbols) {
            return;
        }

        if (this.currentSymbol) {
            this.depth.push(this.currentSymbol.children.length - 1);
        } else {
            this.depth.push(this.symbols.length - 1);
        }
    }

    popDepth() {
        this.depth.pop();
    }
}
