import {app, BrowserWindow, Menu, session} from 'electron'
import {release} from 'os'
import './ipc/index'
import {appConf} from './configuration'
import {setTray} from './tray/index'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
import {GlobalConfig} from "./config";

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// if (!app.requestSingleInstanceLock()) {
//     app.quit()
//     process.exit(0)
// }

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
if (process.mas) app.setName('MeiTuanAdmin');


Menu.setApplicationMenu(null)

let loginWindow: BrowserWindow | null = null
let mainWindow: BrowserWindow | null = null
let settingWindow: BrowserWindow | null = null


function _createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 360,
        height: 360,
        frame: false,
        resizable: false,
        fullscreen: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            session: session.fromPartition(GlobalConfig.sessionNameSpace)
        },
        icon: appConf.icon,
        show: false
    })
    loginWindow.loadFile(appConf.loginHtml)
    loginWindow.on('ready-to-show', function () {
        loginWindow?.show() // 初始化后再显示
    })
    loginWindow.on("close", () => {
        loginWindow = null
    })
    // loginWindow.webContents.openDevTools({
    //     mode: 'detach'
    // })
}

function _createMainWindow() {
    mainWindow = new BrowserWindow({
        title: '美团商家回访工具' + (GlobalConfig.poiInfo.name ? ' - ' + GlobalConfig.poiInfo.name : '') + (GlobalConfig.oaInfo.name ? ' - ' + GlobalConfig.oaInfo.name : ''),
        width: 1200,
        height: 710,
        minHeight: 480,
        minWidth: 800,
        resizable: false,
        icon: appConf.icon,
        webPreferences: {
            preload: appConf.preload,
            nodeIntegration: true,
            contextIsolation: false,
            session: session.fromPartition(GlobalConfig.sessionNameSpace)
        },
    })

    if (app.isPackaged) {
        mainWindow.loadFile(appConf.indexHtml)
        mainWindow.webContents.openDevTools({
            mode: "detach"
        })
    } else {
        mainWindow.loadURL(appConf.url)
        mainWindow.webContents.openDevTools({
            mode: "detach"
        })
    }

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show()
    })
}

app.on('ready', async () => {
    if (!app.isPackaged) {
        //clearAllData()
    }
    setTray();
    await _createLoginWindow();
    installExtension(VUEJS_DEVTOOLS.id)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
});

app.on('window-all-closed', () => {
    loginWindow = null
    mainWindow = null
    settingWindow = null
    if (process.platform !== 'darwin') app.quit()
})

// app.on('second-instance', () => {
//     if (mainWindow) {
//         // Focus on the main window if the user tried to open another
//         if (mainWindow.isMinimized()) mainWindow.restore()
//         mainWindow.focus()
//         return
//     }
//     if (loginWindow) {
//         // Focus on the main window if the user tried to open another
//         if (loginWindow.isMinimized()) loginWindow.restore()
//         loginWindow.focus()
//     }
// })

app.on('activate', async () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        await _createLoginWindow()
    }
})

export const showMainWindow = () => {
    if (loginWindow != null) {
        if (loginWindow?.isMinimized()) loginWindow.restore()
        loginWindow?.show()
    } else {
        if (mainWindow?.isMinimized()) mainWindow.restore();
        mainWindow?.show();
    }
};

export const closeLoginWindow = () => {
    loginWindow?.close();
}

export const createMainWindow = () => {
    _createMainWindow()
}

export const closeMainWindow = () => {
    mainWindow?.close();
}

export const createLoginWindow = () => {
    _createLoginWindow()
}

export const minMainWindow = () => {
    mainWindow?.minimize()
}

export const hideMainWindow = () => {
    mainWindow?.hide()
}
