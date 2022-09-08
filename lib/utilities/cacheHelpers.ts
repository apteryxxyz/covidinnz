import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

// Webpack overrides the require method so we create a new one here
const require = createRequire(resolve());

export function getJson<T>(filePath: string) {
    let json: any;
    try {
        json = require(filePath) as T;
    } catch (e) {
        writeFileSync(filePath, '{checkedAt:0}');
        json = { checkedAt: 0 };
    }
    return json as T;
}

export function saveJson<T>(filePath: string, json: Record<string, any>) {
    writeFileSync(filePath, JSON.stringify(json, null, 4));
    delete require.cache[filePath];
    return json as T;
}
