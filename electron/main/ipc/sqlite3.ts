import { app, ipcMain } from 'electron'
import path from 'path'
import sqlite3 from 'sqlite3'

const dbpath = path.join(app.getPath('userData'), 'sqlite3.db')
const db: Promise<sqlite3.Database> = new Promise((resolve, reject) => {
    const _db = new sqlite3.Database(
        dbpath,
        error => {
            if (error) {
                reject(error)
                return;
            }
            resolve(_db)
        }
    )
})

ipcMain.handle('sqlite3', async event => {
    try {
        return JSON.stringify([null, await db])
    } catch (error: any) {
        return JSON.stringify([error.message, null])
    }
})
