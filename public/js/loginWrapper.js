const ipcRenderer = require('electron').ipcRenderer

const $ = (id) => document.getElementById(id)
const $$ = (className) => document.getElementsByClassName(className)

function main() {
    console.log("fuvk")
    // 延迟时间等dom渲染
    setTimeout(() => {
        $('login').setAttribute("value", "wmlxxm2381471");
        $('login').dispatchEvent(new Event('input', {"bubbles": true, "cancelable": true}));
        $('password').setAttribute("value", "d057506");
        $('password').dispatchEvent(new Event('input', {"bubbles": true, "cancelable": true}));
        $$('login__submit')[0].click()

    }, 100)
    ipcRenderer.on('getCookie', () => {
        ipcRenderer.sendToHost('receiveCookie', document.cookie)
    })
}

main()
