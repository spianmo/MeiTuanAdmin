import {ipcMain} from "electron";
import {closeLoginWindow, createMainWindow, closeMainWindow, createLoginWindow, minMainWindow, hideMainWindow} from "../index";
import './esmodules'
import './local'

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