import Dexie from 'dexie'
import 'dexie-mongoify'

const dbName = 'electron-init'

const db = new Dexie(dbName)
const dbVersion = 5

function initDb() {
    db.version(dbVersion).stores({
        orders: 'key, info, status, remark, orderTime',
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
