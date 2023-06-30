import Tokenizr from 'tokenizr';

export function tokenizeJenkinsfile(documentText: string): Tokenizr {
    let lexer = new Tokenizr();

    lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (context, match) => {
        context.accept("word");
    });
    lexer.rule(/[+-]?[0-9]+/, (context, match) => {
        context.accept("number", parseInt(match[0]));
    });
    lexer.rule(/(""".*?""")/gs, (context, match) => {
        // Multi-line double quote strings
        context.accept("string", match[1]);
    });
    lexer.rule(/('''.*?''')/gs, (context, match) => {
        // Multi-line single quote strings
        context.accept("string", match[1]);
    });
    lexer.rule(/"((?:\\"|[^\r\n])*)"/, (context, match) => {
        // Double quote strings
        context.accept("string", match[1].replace(/\\"/g, "\""));
    });
    lexer.rule(/'((?:\\'|[^\r\n])*)'/, (context, match) => {
        // Single quote string
        context.accept("string", match[1].replace(/\\'/g, "\'"));
    });
    lexer.rule(/\/\/[^\r\n]*\r?\n/, (context, match) => {
        // Comments
        context.ignore();
    });
    lexer.rule(/[ \t\r\n]+/, (context, match) => {
        // Newlines and tabs
        context.ignore();
    });
    lexer.rule(/./, (context, match) => {
        // Everything else not captured
        context.accept("char");
    });

    lexer.input(documentText);
    return lexer;
}
