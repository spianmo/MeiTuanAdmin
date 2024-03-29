import Dexie from 'dexie'
import 'dexie-mongoify'

const dbName = 'electron-init'

const db = new Dexie(dbName)
const dbVersion = 10

function initDb() {
    db.version(dbVersion).stores({
        orders: 'key, info, status, remark, remarkTime, remarkDay, orderTime, is_poi_first_order, [is_poi_first_order+orderTime]',
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
