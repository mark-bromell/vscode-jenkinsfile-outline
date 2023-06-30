import * as assert from 'assert';

import { tokenizeJenkinsfile } from '../../tokenizer';
import { jenkinsfile, simpleJenkinsfile } from './data';

suite('Tokenizer test suite', () => {
    test('Debug (delete this)', () => {
        let lexer = tokenizeJenkinsfile(jenkinsfile);

        do {
            try {
                let token = lexer.consume('word', 'stage');
                console.log(token.value);
            } catch (error) {
                console.log('next');
            }
        } while (!lexer.peek().isA('EOF'));

        lexer.reset();

        do {
            try {
                let token = lexer.consume('word', 'stage');
                console.log(token.value);
            } catch (error) {
                console.log('next');
            }
        } while (!lexer.peek().isA('EOF'));

        assert.strictEqual(false, true);
    });
});
