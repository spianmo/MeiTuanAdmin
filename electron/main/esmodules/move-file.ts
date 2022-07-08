import path from 'path'
import { moveFile } from 'move-file'

(async () => {
  const source = path.join(__dirname, 'index.js')
  const dist = path.join(__dirname, 'index.js')

  await moveFile(source, dist)

  // console.log('The file has been moved')
})()
