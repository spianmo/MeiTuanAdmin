import fse from 'fs-extra'

function copyFolderSync(src, dest) {
    fse.copySync(src, dest,{ overwrite: true });
}

function copyFiles(files) {
    for (const file of files) {
        copyFolderSync(file.src, file.dest)
    }
}

copyFiles([
    { src: './node_modules/adbkit/lib', dest: './node_modules/adbkit/src' },
    { src: './node_modules/adbkit-logcat/lib', dest: './node_modules/adbkit-logcat/src' },
    { src: './node_modules/adbkit-monkey/lib', dest: './node_modules/adbkit-monkey/src' },
])
