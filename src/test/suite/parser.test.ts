import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';

import parseJenkinsfile from '../../parser';
import { jenkinsfileFull, jenkinsfileSimple } from '../data/data';

suite('Parser test suite', () => {
    test('Simple pipeline parsing', () => {
        const symbols: vscode.DocumentSymbol[] = parseJenkinsfile(jenkinsfileSimple);
        assert.strictEqual(symbols.length, 1);
        assert.strictEqual(symbols[0].name, 'Pipeline');
    });

    test('Full pipeline parsing', () => {
        const symbols: vscode.DocumentSymbol[] = parseJenkinsfile(jenkinsfileFull);
        assert.strictEqual(symbols.length, 1);
        assert.strictEqual(symbols[0].children.length, 4);
        assert.strictEqual(symbols[0].children[0].children.length, 2);
        assert.strictEqual(symbols[0].children[0].children[0].children.length, 2);
        assert.strictEqual(symbols[0].children[0].children[1].children.length, 0);
        assert.strictEqual(symbols[0].children[1].children.length, 0);

        assert.strictEqual(symbols[0].name, 'Pipeline');
        assert.strictEqual(symbols[0].children[0].name, 'Setup');
        assert.strictEqual(symbols[0].children[1].name, 'Static Scan');
        assert.strictEqual(symbols[0].children[2].name, 'Build and Test');
        assert.strictEqual(symbols[0].children[3].name, 'Report');
    });
});
