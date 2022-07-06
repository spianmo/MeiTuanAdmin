import Dexie from 'dexie'
import mongoify from 'dexie-mongoify'

const dbName = 'electron-init'

const db = new Dexie(dbName)
const dbVersion = 1

function initDb() {
    db.version(dbVersion).stores({
        dict: 'key, value',
        logs: '++id, name, money, state, date',
    })
    db.open().then(r => {
        console.log('db opened')
    }).catch(error => {
        console.log('open db error:', error)
    })
}

function close() {
    db.close()
}

export {
    initDb,
    close,
    db
}
