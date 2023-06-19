import XRegExp from 'xregexp';
import { readFileSync, promises as fsPromises } from 'fs';

async function main() {
    let data = await asyncReadFile('sample.Jenkinsfile');
    let matches = XRegExp.matchRecursive(data, '{', '}', 'mgs', {
        valueNames: ['between', 'left', 'match', 'right']
    });

    for (const match of matches) {
        console.log(match);
    }
}

function getMatches(stages, braces) {
    for (const body of braces) {
        let nestedBraces = XRegExp.matchRecursive(body, '\\{', '\\}', 'mgs');

        if (nestedBraces.length == 0) {
            return match;
        }
        if (true) {
            true;
        }
        return getMatches(newMatches);
    }
}

async function asyncReadFile(filename) {
    try {
        const contents = await fsPromises.readFile(filename, 'utf-8');
        return contents;
    } catch (err) {
        console.log(err);
    }
}

await main();
