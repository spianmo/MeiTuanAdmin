import {db} from '../plugins/database'

function initLog() {
    db.table('logs').clear()
    db.table('logs').bulkAdd([
        {name: 'David', money: 42, state: '成功', date: '2022-01-01', address: '广东省'},
        {name: 'Neil', money: 37, state: '成功', date: '2022-01-02', address: '广东省'},
        {name: 'Freddie', money: 36, state: '成功', date: '2022-01-03', address: '广东省'},
        {name: 'Elvis', money: 56, state: '失败', date: '2022-01-04', address: '湖南省'},
        {name: 'Calvin', money: 22, state: '成功', date: '2022-01-05', address: '湖南省'},
        {name: 'Tom', money: 156, state: '成功', date: '2022-01-06', address: '广东省'},
        {name: 'Cat', money: 12, state: '失败', date: '2022-01-07', address: '广东省'},
        {name: 'Jacky', money: 44, state: '成功', date: '2022-01-08', address: '湖南省'},
        {name: 'Kite', money: 62, state: '成功', date: '2022-01-09', address: '广东省'},
        {name: 'Janus', money: 33, state: '失败', date: '2022-01-10', address: '湖南省'},
        {name: 'Tim', money: 76, state: '成功', date: '2022-01-11', address: '广东省'}
    ])
}

function pageLogCount(query) {
    let condition = {}
    if (query.name) {
        condition.name = {$eq: query.name}
    }
    if (query.address) {
        condition.address = {$eq: query.address}
    }
    return db.collection('logs').find(condition).count()
}

function pageLogData(query) {
    let condition = {}
    if (query.name) {
        condition.name = {$eq: query.name}
    }
    if (query.address) {
        condition.address = {$eq: query.address}
    }
    return db.collection('logs')
        .find(condition)
        .offset((query.page - 1) * query.size)
        .limit(query.size)
        .reverse()
        .sortBy('date')
}

function addLog(log) {
    return db.collection('logs').add(log)
}

function updateLog(log) {
    return db.collection('logs').update({id: log.id}, log)
}

function deleteLog(id) {
    return db.collection('logs').remove({id: id})
}

export {
    initLog,
    addLog,
    deleteLog,
    updateLog,
    pageLogCount,
    pageLogData
}
