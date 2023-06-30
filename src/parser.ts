import Tokenizr from 'tokenizr';
import * as vscode from 'vscode';

export function parseJenkinsfile(documentText: string): vscode.DocumentSymbol[] {
    documentText = cleanEscapedQuotes(documentText);
    documentText = cleanMatchInQuotes(documentText, /[{}]/g);

    let documentLines = documentText.split(/\r?\n/);
    let stages = lineReader(documentLines);
    return stages;
}

function cleanEscapedQuotes(documentText: string) {
    const re = /(\\\')|(\\\")/g;
    return documentText.replaceAll(re, "");
}

function cleanMatchInQuotes(documentText: string, regex: RegExp): string {
    const reStrings = /("(.*?)")|('(.*?)')/gs;
    let stringMatches = documentText.match(reStrings);
    let cleanedStrings: string[] = [];

    if (!stringMatches) {
        return documentText;
    }

    for (const stringMatch of stringMatches) {
        cleanedStrings.push(stringMatch.replaceAll(regex, ""));
    }

    for (let i = 0; i < cleanedStrings.length; i++) {
        documentText = documentText.replaceAll(stringMatches[i], cleanedStrings[i]);
    }

    return documentText;
}

function lineReader(documentLines: string[]): vscode.DocumentSymbol[] {
    let depth = 0;
    let previousStageDepth = -1;
    let stageContext: number[] = [];
    let stages: vscode.DocumentSymbol[] = [];

    // Going over each line and capturing stage lines.
    // We get the nested depth of each stage line based on braces {}.
    documentLines.forEach((line, i) => {
        const openCount = line.split("{").length - 1;
        const closeCount = line.split("}").length - 1;
        depth += openCount - closeCount;

        const stageName = getStageName(line);
        if (!stageName) {
            return;
        }

        // Based on the previousStageDepth we want to update the current stageContext
        // so that we can know where to push any new stages.
        // The stageContext will track the current stage index that we are in, to
        // an undifed depth, which is why we recurse with traversePushStages.
        if (depth > previousStageDepth) {
            // We have went into a nested stage within the previous stage,
            // Increasing the stage context's depth since no stage exists here yet.
            stageContext.push(0);
        } else if (depth === previousStageDepth) {
            // At the same depth as the previous stage so the current stage context
            // increments by 1 and doesn't increase depth.
            stageContext[stageContext.length - 1] += 1;
        } else {
            // We have exited a nested stage so our context depth pops up by 1
            // and we have to increment the new context since we are continuing in the
            // existing context.
            stageContext.pop();
            stageContext[stageContext.length - 1] += 1;
        }

        let lineNumber = i + 1;
        let range = new vscode.Range(
            new vscode.Position(lineNumber, 0),
            new vscode.Position(lineNumber, 0)
        );
        let selectionRange = new vscode.Range(
            new vscode.Position(lineNumber, 0),
            new vscode.Position(lineNumber, 0)
        );
        let newStage: vscode.DocumentSymbol = new vscode.DocumentSymbol(
            stageName,
            '',
            vscode.SymbolKind.Interface,
            range,
            selectionRange
        );

        traversePushStages(stages, newStage, stageContext);
        previousStageDepth = depth;
    });

    return stages;
}

function traversePushStages(
    stages: vscode.DocumentSymbol[],
    newStage: vscode.DocumentSymbol,
    stageContext: number[],
    depth: number = 0
) {
    // These are the top level stages which is just an array, just push.
    if (stageContext.length === 1) {
        stages.push(newStage);
        return;
    }

    // We are within a stage object so we must push to its stages field.
    // Only push to the stages field once we have reached the current stage
    // based on its depth within the context.
    if (depth === stageContext.length - 2) {
        stages[stageContext[depth]].children.push(newStage);
        return;
    }

    // We haven't reached the contexts current depth yet, recurse through the stages.
    traversePushStages(
        stages[stageContext[depth]].children,
        newStage,
        stageContext,
        depth + 1
    );
}

function getStageName(line: string): string | undefined {
    const reLine = /stage\(.*?\)/;
    const reName = /((?<=\')(.*?)(?=\')|(?<=\")(.*?)(?=\"))/;
    const stageLine = line.match(reLine);
    if (stageLine) {
        return stageLine[0].match(reName)![0];
    }
    return;
}
