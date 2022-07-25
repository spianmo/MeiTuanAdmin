import {ipcMain} from "electron";
import {
    closeLoginWindow,
    closeMainWindow,
    createLoginWindow,
    createMainWindow,
    hideMainWindow,
    minMainWindow
} from "../index";
import './local'
import './serialport'
import './sqlite3'

import axios from "axios";
import {clearAllData} from "./local";
import {refreshMtLoginWindow} from "./local"
import {onCookieBySession} from "./local";

export {
    clearAllData,
    refreshMtLoginWindow,
    onCookieBySession
}

ipcMain.on('close-message', (event, arg) => {
    closeLoginWindow()
})

ipcMain.on('login-success-message', async (event, arg) => {
    createMainWindow()
    closeLoginWindow()
})

ipcMain.on('re-login', async (event, arg) => {
    closeMainWindow()
    createLoginWindow()
})

ipcMain.on('min-main-window', async (event, arg) => {
    minMainWindow()
})

ipcMain.on('hide-main-window', async (event, arg) => {
    hideMainWindow()
})