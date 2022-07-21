const ipcRenderer = require('electron').ipcRenderer

const $ = (id) => document.getElementById(id)
const $$ = (className) => document.getElementsByClassName(className)

ipcRenderer.on('sendAccount', (event, args) => {
    console.log("sendAccount", args)
    $('login').setAttribute("value", args.username);
    $('login').dispatchEvent(new Event('input', {"bubbles": true, "cancelable": true}));
    $('password').setAttribute("value", args.password);
    $('password').dispatchEvent(new Event('input', {"bubbles": true, "cancelable": true}));
    $$('login__submit')[0].click()
})
