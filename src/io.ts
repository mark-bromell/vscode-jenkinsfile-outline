import { readFileSync, promises as fsPromises } from "fs";

async function asyncReadFile(filename: string): Promise<string> {
    try {
        const contents = await fsPromises.readFile(filename, "utf-8");
        return contents;
    } catch (err) {
        console.log(err);
        return "";
    }
}
