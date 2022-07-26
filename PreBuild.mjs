import * as fs from "fs";
import * as util from "util";

async function copyFolder(folder) {
    console.log(fs.existsSync(folder.dest));
    if (!fs.existsSync(folder.dest)) {
        console.log(`创建目录：${folder.dest}`);
        await util.promisify(fs.mkdir)(folder.dest);
    }
    await util.promisify(fs.copyFile)(folder.src, folder.dest)
}

async function copyFiles(files) {
    for (const file of files) {
        await copyFolder(file)
    }
}

await copyFiles([
    { src: './node_modules/adbkit/lib', dest: './node_modules/adbkit/src' },
    { src: './node_modules/adbkit-logcat/lib', dest: './node_modules/adbkit-logcat/src' },
    { src: './node_modules/adbkit-monkey/lib', dest: './node_modules/adbkit-monkey/src' },
])
