import {app, Menu, Tray} from 'electron';
import {showMainWindow} from '../index';
import {appConf} from '../configuration';

let tray = null;

export function setTray() {
    tray = new Tray(appConf.dock);
    tray.setToolTip('TrackerDesktopManager');
    tray.on('click', () => {
        showMainWindow();
    });
    tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
            {label: '显示主页面', click: showMainWindow},
            {label: '退出', click: app.quit},
        ]);
        tray?.popUpContextMenu(contextMenu);
    });
}