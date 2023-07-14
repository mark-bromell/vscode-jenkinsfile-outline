import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';

import parseJenkinsfile from '../../parser.old';
import { jenkinsfileFull, jenkinsfileSimple } from '../data/data';

// suite('Old parser test suite', () => {
//     test('Empty pipeline returns emtpy list of stages', () => {
//         const stages: vscode.DocumentSymbol[] = parseJenkinsfile(jenkinsfileSimple);
//         assert.strictEqual(stages.length, 0);
//     });

//     test('Stages count is correct', () => {
//         const stages: vscode.DocumentSymbol[] = parseJenkinsfile(jenkinsfileFull);
//         assert.strictEqual(stages.length, 4);
//         assert.strictEqual(stages[0].children.length, 2);
//         assert.strictEqual(stages[0].children[0].children.length, 2);
//         assert.strictEqual(stages[2].children.length, 2);
//     });

//     test('Stages are parsed correctly', () => {
//         const stages: vscode.DocumentSymbol[] = parseJenkinsfile(jenkinsfileFull);
//         assert.strictEqual(stages.length, 4);
//         assert.strictEqual(stages[0].name, 'Setup');
//         assert.strictEqual(stages[0].children[0].name, 'Pre-action');
//         assert.strictEqual(stages[0].children[0].children[0].name, 'One');
//         assert.strictEqual(stages[0].children[0].children[1].name, 'Two');
//         assert.strictEqual(stages[0].children[1].name, 'Downloading');

//         assert.strictEqual(stages[1].name, 'Static Scan');

//         assert.strictEqual(stages[2].name, 'Build and Test');
//         assert.strictEqual(stages[2].children[0].name, 'Build');
//         assert.strictEqual(stages[2].children[1].name, 'Test');

//         assert.strictEqual(stages[3].name, 'Report');
//     });
// });
