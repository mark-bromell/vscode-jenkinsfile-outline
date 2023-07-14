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

    const tokens = lexer.tokens();

    for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < rules.length; j++) {
            if (parseRule(i, tokens, context, rules[j])) {
                break;
            }
        }
    }

    return context.symbols;
}

type ParseRuleFunction = {
    (index: number, tokens: Token[], context: ParserContext): boolean;
};

function parseRule(
    index: number,
    tokens: Token[],
    context: ParserContext,
    fn: ParseRuleFunction,
): boolean {
    let result: boolean;

    try {
        result = fn(index, tokens, context);
    } catch (error) {
        console.error(error);
        result = false;
    }

    return result;
}

function parseRuleDepthIncrease(index: number, tokens: Token[], context: ParserContext): boolean {
    if (!(tokens[index].type === 'char' && tokens[index].value === '{')) {
        return false;
    }

    context.pushDepth();
    return true;
}

function parseRuleDepthDecrease(index: number, tokens: Token[], context: ParserContext): boolean {
    if (!(tokens[index].type === 'char' && tokens[index].value === '}')) {
        return false;
    }

    context.popDepth();
    return true;
}

function parseRulePipeline(index: number, tokens: Token[], context: ParserContext): boolean {
    if (!(tokens[index].type === 'word' && tokens[index].value === 'pipeline')) {
        return false;
    }

    let range = new vscode.Range(
        new vscode.Position(tokens[index].line, tokens[index].pos),
        new vscode.Position(tokens[index].line, tokens[index].pos + tokens[index].value.length)
    );
    let selectionRange = new vscode.Range(
        new vscode.Position(tokens[index].line, tokens[index].pos),
        new vscode.Position(tokens[index].line, tokens[index].pos + tokens[index].value.length)
    );
    let newSymbol: vscode.DocumentSymbol = new vscode.DocumentSymbol(
        'Pipeline',
        '',
        vscode.SymbolKind.Interface,
        range,
        selectionRange
    );

    context.pushBlock(newSymbol);
    return true;
}

function parseRuleStage(index: number, tokens: Token[], context: ParserContext): boolean {
    if (!(tokens[index].type === 'word' && tokens[index].value === 'stage')) {
        return false;
    }

    const stageName = tokens[index + 2].value;

    let range = new vscode.Range(
        new vscode.Position(tokens[index].line, tokens[index].pos),
        new vscode.Position(tokens[index].line, tokens[index].pos + tokens[index].value.length)
    );
    let selectionRange = new vscode.Range(
        new vscode.Position(tokens[index].line, tokens[index].pos),
        new vscode.Position(tokens[index].line, tokens[index].pos + tokens[index].value.length)
    );
    let newSymbol: vscode.DocumentSymbol = new vscode.DocumentSymbol(
        stageName,
        'stage',
        vscode.SymbolKind.Event,
        range,
        selectionRange
    );

    context.pushBlock(newSymbol);
    return true;
}

class SymbolDepth {
    index: number;
    depth: number;

    constructor(index: number, depth: number) {
        this.index = index;
        this.depth = depth;
    }
}

class ParserContext {
    symbols: vscode.DocumentSymbol[];
    symbolDepth: SymbolDepth[];
    depthCount: number = 0;

    constructor() {
        this.symbols = [];
        this.symbolDepth = [];
    }

    get currentSymbol(): vscode.DocumentSymbol | undefined {
        if (this.symbolDepth.length === 0) {
            return undefined;
        }

        let symbol = this.symbols[this.symbolDepth[0].index];
        for (let i = 1; i < this.symbolDepth.length; i++) {
            symbol = symbol.children[this.symbolDepth[i].index];
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

    pushBlock(symbol: vscode.DocumentSymbol) {
        this.push(symbol);
        this.pushSymbolDepth();
    }

    pushDepth() {
        this.depthCount++;
    }

    popDepth() {
        this.depthCount--;

        if (!this.symbolDepth.at(-1)) {
            return;
        }

        if (this.depthCount === this.symbolDepth.at(-1)!.depth) {
            this.symbolDepth.pop();
        }
    }

    pushSymbolDepth() {
        if (!this.symbols) {
            return;
        }

        if (this.currentSymbol) {
            this.symbolDepth.push(new SymbolDepth(this.currentSymbol.children.length - 1, this.depthCount));
        } else {
            this.symbolDepth.push(new SymbolDepth(this.symbols.length - 1, this.depthCount));
        }
    }
}
