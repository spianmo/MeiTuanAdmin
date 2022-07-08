import {join} from "path";
import {app} from "electron";

export const ROOT_PATH = {
    // /dist
    dist: join(__dirname, '../..'),
    // /dist or /public
    public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

export class Configuration {
    icon: string
    dock: string
    indexHtml: string
    loginHtml: string
    preload: string
    url: string

    constructor() {
        this.icon = join(ROOT_PATH.public, 'favicon.ico');
        this.dock = join(ROOT_PATH.public, 'dock.ico')
        this.indexHtml = join(ROOT_PATH.dist, 'index.html')
        this.loginHtml = join(ROOT_PATH.public, 'login.html')
        this.preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
        this.url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
    }
}

const appConf = new Configuration()

export {appConf}