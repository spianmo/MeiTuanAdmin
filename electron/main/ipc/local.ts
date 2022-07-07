
/* Show a message box */
import {dialog, ipcMain, shell} from "electron";
import appStoreFs from "fs";
import {debug, log} from "electron-log";

function msg(str:string) {
    const options =
        {
            type: 'info',
            title: '提示',
            message: str,
            buttons: ['好的']
        }
    dialog.showMessageBox(options);
}

/* Received a message */
ipcMain.on('asynchronous-message', (event, arg) => {
    msg(arg);
})

ipcMain.on('open-browser-message', (event, arg) => {
    shell.openExternal(arg)
})

ipcMain.on('get-config', (event, arg) => {
    let profile = {}
    if (appStoreFs == null) return
    appStoreFs.readFile('config.json', 'utf-8', function (err, data) {
        if (err) {
            debug("读取json配置文件失败")
        } else {
            debug("read config json:" + data)
            profile = JSON.parse(data);
        }
    });
    event.reply("get-config", profile)
    event.returnValue = profile;
})

ipcMain.on('save-config', (event, arg) => {
    if (appStoreFs == null) {
        debug("fs 载入失败")
        return;
    }
    appStoreFs.writeFile("config.json", JSON.stringify(arg, null, "  "), function (err) {
        if (err) {
            debug(err);
        } else {
            debug("配置保存成功")
        }
    })
})