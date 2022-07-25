import {ipcRenderer} from "electron";

export const log = (object) => {
    ipcRenderer.send('terminalLog', JSON.stringify(object))
}
