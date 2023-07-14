import Tokenizr from 'tokenizr';

const PATTERN = {
    word: /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: /[+-]?[0-9]+/,
    stingDoubleMulti: /(""".*?""")/s,
    stringSingleMulti: /('''.*?''')/s,
    stringDouble: /"((?:\\"|[^\r\n])*)"/,
    stringSingle: /'((?:\\'|[^\r\n])*)'/,
    comment: /\/\/[^\r\n]*\r?\n/,
    commentBlock: /(\/\*.*?\*\/)/s,
    extraWhitespace: /[ \t\r\n]+/,
    catchAll: /./
};

export function tokenizeJenkinsfile(documentText: string): Tokenizr {
    let lexer = new Tokenizr();

    lexer.rule(PATTERN.word, (context, _) => context.accept("word"));
    lexer.rule(PATTERN.number, (context, match) => context.accept("number", parseInt(match[0])));
    lexer.rule(PATTERN.stingDoubleMulti, (context, match) => context.accept("string", match[1]));
    lexer.rule(PATTERN.stringSingleMulti, (context, match) => context.accept("string", match[1]));
    lexer.rule(PATTERN.stringDouble, (context, match) => context.accept("string", match[1].replace(/\\"/g, "\"")));
    lexer.rule(PATTERN.stringSingle, (context, match) => context.accept("string", match[1].replace(/\\'/g, "\'")));
    lexer.rule(PATTERN.comment, (context, _) => context.ignore());
    lexer.rule(PATTERN.commentBlock, (context, _) => context.ignore());
    lexer.rule(PATTERN.extraWhitespace, (context, _) => context.ignore());
    lexer.rule(PATTERN.catchAll, (context, _) => context.accept("char"));

    lexer.input(documentText);
    return lexer;
}
