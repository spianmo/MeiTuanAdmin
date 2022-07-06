// 这里可以注入Node.js的API,以及一些Electron的API
// 然后在项目中使用window.xxx.xxx来调用这些API或自行注册global
const { contextBridge, ipcRenderer, shell } = require('electron')
const fs = require('fs')
const childProcess = require('child_process')

contextBridge.exposeInMainWorld('electron', {
  // 如下API可以使用window.electron.openURL来调用
  openURL: (url) => shell.openExternal(url),
  runCommand: (cmd, path) => {
    return childProcess.execSync(cmd, {cwd: path}).toString();
  },
})
