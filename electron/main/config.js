import appStoreFs from "fs";
import {debug} from "electron-log";

export let GlobalConfig = {
    sessionNameSpace: 'persist:namespace-default',
    oaInfo: {
        name: '',
        code: ''
    },
    poiInfo: {
        name: '',
        logo: ''
    },
    wmInfo: {
        username: '',
        password: ''
    }
}

export const saveConfig = async (arg) => {
    if (appStoreFs == null) {
        debug("fs 载入失败")
        return;
    }
    GlobalConfig.sessionNameSpace = `persist:namespace-${arg.username}`

    let config = await _getConfig()
    config[arg.username] = arg
    GlobalConfig.wmInfo = config[arg.username]

    appStoreFs.writeFile(`config.json`, JSON.stringify(config, null, "  "), function (err) {
        if (err) {
            debug(err);
        } else {
            debug("配置保存成功")
        }
    })
}

const _getConfig = () => {
    if (appStoreFs == null) return
    return new Promise((resolve, reject)=>{
        appStoreFs.readFile(`config.json`, 'utf-8', (err, data) => {
            if (err) {
                debug("读取json配置文件失败")
                resolve({})
            } else {
                debug("read config json:" + data)
                resolve(JSON.parse(data))
            }
        });
    })
}

export const getConfig = async (username) => {
    let config = await _getConfig()
    GlobalConfig.wmInfo = config[username]
    return config[username]
}

export const saveOAConfig = (arg) => {
    if (appStoreFs == null) {
        debug("fs 载入失败")
        return;
    }
    GlobalConfig.oaInfo = arg
    appStoreFs.writeFile("oa-config.json", JSON.stringify(arg, null, "  "), function (err) {
        if (err) {
            debug(err);
        } else {
            debug("OA配置保存成功")
        }
    })
}

export const getOAConfig = (callback) => {
    if (appStoreFs == null) return
    appStoreFs.readFile('oa-config.json', 'utf-8', callback);
}
