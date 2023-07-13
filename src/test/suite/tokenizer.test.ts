import * as assert from 'assert';

import { tokenizeJenkinsfile } from '../../tokenizer';
import { jenkinsfileFull, jenkinsfileSimple } from '../data/data';

// suite('Tokenizer test suite', () => {
//     test('Debug (delete this)', () => {
//         let lexer = tokenizeJenkinsfile(jenkinsfileFull);
//         lexer.tokens().forEach(t => console.log(t.toString()));
//         assert.strictEqual(false, true);
//     });
// });
