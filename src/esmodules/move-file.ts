import path from 'path'
import { moveFile } from 'move-file'
import { lstat } from 'fs/promises'
import { cwd } from 'process'
import { ipcRenderer } from 'electron'

(async () => {
  console.log(path)
  const source = path.join(__dirname, 'index.js')
  const dist = path.join(__dirname, 'index.js')

  await moveFile(source, dist)

  console.log('The file has been moved')
})()

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats)
}).catch(err => {
  console.error(err)
})
