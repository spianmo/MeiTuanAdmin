/* Show a message box */
import {app, BrowserWindow, dialog, ipcMain, shell} from "electron";
import appStoreFs from "fs";
import {debug, log} from "electron-log";
import {appConf} from "../configuration";

function msg(str: string) {
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

// new window example arg: new windows url
ipcMain.on('open-win', (event, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload: appConf.preload,
            nodeIntegration: true,
        },
    })

    if (app.isPackaged) {
        childWindow.loadFile(appConf.indexHtml, {hash: arg})
    } else {
        childWindow.loadURL(`${appConf.url}/#${arg}`)
        // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
    }
    childWindow.on('ready-to-show', function () {
        childWindow?.show()
    })
})

ipcMain.on('get-meituan-cookie', (event, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            //preload: appConf.loginwrapper
        },
    })

    childWindow.loadFile(appConf.meituanHtml)
    childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
    childWindow.on('ready-to-show', function () {
        childWindow?.show()
    })
})
