import * as fs from "fs";
import * as util from "util";

//拷贝文件夹
function copyFolderSync(src, dest) {
    let files = fs.readdirSync(src);
    files.forEach(function (file) {
        const curPath = src + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
            copyFolderSync(curPath, dest + "/" + file);
        } else {
            fs.copyFileSync(curPath, dest + "/" + file);
        }
    });
}

function copyFolder(folder) {
    if (!fs.existsSync(folder.dest)) {
        console.log(`创建目录：${folder.dest}`);
        fs.mkdirSync(folder.dest);
    }
    copyFolderSync(folder.src, folder.dest)
}

function copyFiles(files) {
    for (const file of files) {
        copyFolder(file)
    }
}

copyFiles([
    { src: './node_modules/adbkit/lib', dest: './node_modules/adbkit/src' },
    { src: './node_modules/adbkit-logcat/lib', dest: './node_modules/adbkit-logcat/src' },
    { src: './node_modules/adbkit-monkey/lib', dest: './node_modules/adbkit-monkey/src' },
])
