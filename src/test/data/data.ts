import fs from "fs";

export const jenkinsfileSimple = fs.readFileSync('src/test/data/Jenkinsfile.simple').toString();
export const jenkinsfileFull = fs.readFileSync('src/test/data/Jenkinsfile.full').toString();
