/* Show a message box */
import {app, BrowserWindow, dialog, ipcMain, session, shell} from "electron";
import appStoreFs from "fs";
import {debug, error, log} from "electron-log";
import {appConf} from "../configuration";
import {closeLoginWindow, closeMainWindow, createLoginWindow, createMainWindow, showMainWindow} from "../index";
import _ from "lodash";
import Cookie = Electron.Cookie;
import IpcMainEvent = Electron.IpcMainEvent;
import {GlobalConfig} from "../config";

function msg(str: string) {
    const options =
        {
            type: 'info',
            title: '提示',
            message: str,
            buttons: ['好的']
        }
    dialog.showMessageBox(options);
}

/* Received a message */
ipcMain.on('asynchronous-message', (event, arg) => {
    msg(arg);
})

ipcMain.on('open-browser-message', (event, arg) => {
    shell.openExternal(arg)
})

ipcMain.on('get-config', (event, arg) => {
    let profile = {}
    if (appStoreFs == null) return
    appStoreFs.readFile(`config-${arg.username}.json`, 'utf-8', function (err, data) {
        if (err) {
            debug("读取json配置文件失败")
        } else {
            debug("read config json:" + data)
            profile = JSON.parse(data);
            event.reply("reply-config", profile)
        }
    });
})

ipcMain.on('save-config', (event, arg) => {
    if (appStoreFs == null) {
        debug("fs 载入失败")
        return;
    }
    GlobalConfig.sessionNameSpace = `persist:namespace-${arg.username}`
    appStoreFs.writeFile(`config-${arg.username}.json`, JSON.stringify(arg, null, "  "), function (err) {
        if (err) {
            debug(err);
        } else {
            debug("配置保存成功")
        }
    })
    session.fromPartition(GlobalConfig.sessionNameSpace).webRequest.onBeforeSendHeaders((details, callback) => {
        if (details.url.indexOf('/v2/chat/im/shop/logo') !== -1) {
            setTimeout(()=>{
                onCookieBySession()
            }, 800)
        }

        if (details.uploadData) {
            const buffer = Array.from(details.uploadData)[0]?.bytes;
            if (!buffer) return
            if (buffer.toString().indexOf(encodeURIComponent('登录出错,请刷新页面后重新登录')) !== -1){
                error("refreshMtLoginWindow")
                //console.log('Request body: ', decodeURIComponent(buffer.toString()));
                refreshMtLoginWindow()
            }
            //log('Request body: ', decodeURIComponent(buffer.toString().trim()).trim());
        }
        callback(details);
    })
})

export let oaInfo:any = {
    name: '',
    code: ''
}

ipcMain.on('get-oa-config', (event, arg) => {
    let profile = {}
    if (appStoreFs == null) return
    appStoreFs.readFile('oa-config.json', 'utf-8', function (err, data) {
        if (err) {
            debug("读取OA json配置文件失败")
        } else {
            debug("read config json:" + data)
            profile = JSON.parse(data);
            oaInfo = profile
            event.reply("reply-oa-config", profile)
        }
    });
})

ipcMain.on('save-oa-config', (event, arg) => {
    if (appStoreFs == null) {
        debug("fs 载入失败")
        return;
    }
    oaInfo = arg
    appStoreFs.writeFile("oa-config.json", JSON.stringify(arg, null, "  "), function (err) {
        if (err) {
            debug(err);
        } else {
            debug("OA配置保存成功")
        }
    })
})

// new window example arg: new windows url
ipcMain.on('open-win', (event, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload: appConf.preload,
            nodeIntegration: true,
        },
    })

    if (app.isPackaged) {
        childWindow.loadFile(appConf.indexHtml, {hash: arg})
    } else {
        childWindow.loadURL(`${appConf.url}/#${arg}`)
        // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
    }
    childWindow.on('ready-to-show', function () {
        childWindow?.show()
    })
})

let mtLoginWindow: BrowserWindow | null = null

ipcMain.on('openMeiTuanLogin', (event, arg) => {
    console.log((GlobalConfig.sessionNameSpace))
    mtLoginWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            session: session.fromPartition(GlobalConfig.sessionNameSpace)
            //preload: appConf.mtloginWrapper
        },
    })
    mtLoginWindow.loadFile(`${appConf.meituanHtml}`, {search: GlobalConfig.sessionNameSpace})
    mtLoginWindow.webContents.openDevTools({ mode: "undocked", activate: true })
    mtLoginWindow?.on('ready-to-show', function () {
        mtLoginWindow?.webContents?.send('receiveCookie', arg);
        mtLoginWindow?.show()
    })
})

export const refreshMtLoginWindow = () => {
    mtLoginWindow?.webContents.send('refreshWebview')
}

export const onCookieBySession = () => {
    mtLoginWindow?.webContents.send('onCookieBySession')
}

ipcMain.on('closeMeiTuanLogin', (event, arg) => {
    mtLoginWindow?.close()
})

ipcMain.on('hideMeiTuanLogin', () => {
    mtLoginWindow?.hide()
})

ipcMain.on('closeLogin', (event, arg) => {
    closeLoginWindow()
})

ipcMain.on('showLoginWindow', (event, arg) => {
    createLoginWindow()
})

ipcMain.on('showMainWindow', (event, arg) => {
    createMainWindow()
})

ipcMain.on('closeMainWindow', (event, arg) => {
    closeMainWindow()
})

ipcMain.on('terminalLog', (event, arg) => {
    log(arg)
})

export let cookiesRawKV: Cookie[] = []
export let cookieJar: string = ""

ipcMain.on('getCookieBySession', (event, arg) => {
    session.fromPartition(GlobalConfig.sessionNameSpace).cookies.get({})
        .then((cookies: Cookie[]) => {
            cookiesRawKV = cookies
            cookies.forEach(cookie => {
                cookieJar += `${cookie.name}=${cookie.value}; `
            })
            console.log(cookieJar);
            //event.reply("onCookieBySession")
        }).catch((error) => {
        console.log(error)
    })
})

function stringifyKV(obj: any) {
    let str: string = ''
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
            str += `${key}=${encodeURIComponent(JSON.stringify(obj[key]))}&`
        }
        str += `${key}=${obj[key]}&`
    })
    return str.slice(0, -1)
}

function getOrderList(payload: any, cb: any) {
    const request = require("request")
    console.log(payload)
    payload.region_id = cookiesRawKV.find(c => c.name === 'region_id')?.value
    payload.region_version = cookiesRawKV.find(c => c.name === 'region_version')?.value
    let header = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Cookie": cookieJar,
        "Host": "e.waimai.meituan.com",
        "Referer": "https://e.waimai.meituan.com/new_fe/business_gw",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
        "sec-ch-ua": '" Not;A Brand";v="99", "Microsoft Edge";v="103", "Chromium";v="103"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows"
    }
    request({
        url: 'https://e.waimai.meituan.com/gw/v2/order/common/history/all/r/list/common?' + stringifyKV(payload),
        method: 'get',
        headers: header,
        jar: request.jar()
    }, function (error: any, response: any, body: any) {
        cb(JSON.parse(body))
    });
}

ipcMain.on('getOrderList', (event: IpcMainEvent, arg: any) => {
    getOrderList(arg, (body: any) => {
        let _body = _.cloneDeep(body)
        if (!_body.data) {
            console.log("###", JSON.stringify(_body))
            event.reply("onOrderListSend", 'fuck')
            return
        }
        let _wmOrderList: any = _.cloneDeep(_body.data.wmOrderList)
        _body.data.wmOrderList = []
        _wmOrderList.forEach((order: any) => {
            let _order = _.cloneDeep(order)
            _order.commonInfo = JSON.parse(order.commonInfo)
            _order.orderInfo = JSON.parse(order.orderInfo)
            _body.data.wmOrderList.push(_order)
        })
        event.reply("onOrderListSend", _body)
    })
})

export let poiInfo:any = {
    name: '',
    logo: ''
}

ipcMain.on('sendPoiInfo', (event: IpcMainEvent, arg: any) => {
    poiInfo = arg
    console.log('sendPoiInfo', poiInfo)
})

ipcMain.on('getPoiInfo', async (event: IpcMainEvent, arg: any) => {
    let bundle: any = {
        poiInfo: poiInfo,
        oaInfo: oaInfo
    }
    event.reply("onPoiInfoSend", bundle)
})

export const clearAllData = () => {
    session.fromPartition(GlobalConfig.sessionNameSpace).clearStorageData({
        storages: [
            'indexdb'
        ]
    });
    session.fromPartition(GlobalConfig.sessionNameSpace).cookies.get({})
        .then((cookies: Cookie[]) => {
            cookies.forEach(cookie => {
                let url = '';
                // get prefix, like https://www.
                url += cookie?.secure ? 'https://' : 'http://';
                url += cookie?.domain?.charAt(0) === '.' ? 'www' : '';
                // append domain and path
                url += cookie?.domain ?? '';
                url += cookie?.path ?? '';
                session?.defaultSession?.cookies?.remove(url, cookie.name);
            })
            console.log("已清除Cookie")
        }).catch((error) => {
        console.log(error)
    })
}

ipcMain.on('clearAllCookie', (event: IpcMainEvent, arg: any) => {
    clearAllData()
})


