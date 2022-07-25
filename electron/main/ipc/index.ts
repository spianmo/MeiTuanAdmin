import {ipcMain} from "electron";
import {
    closeLoginWindow,
    closeMainWindow,
    createLoginWindow,
    createMainWindow,
    hideMainWindow,
    minMainWindow
} from "../index";
import './local'
import './serialport'
import './sqlite3'

import axios from "axios";
import {clearAllData} from "./local";
import {refreshMtLoginWindow} from "./local"
import {onCookieBySession} from "./local";

export {
    clearAllData,
    refreshMtLoginWindow,
    onCookieBySession
}

ipcMain.on('close-message', (event, arg) => {
    closeLoginWindow()
})

ipcMain.on('login-success-message', async (event, arg) => {
    createMainWindow()
    closeLoginWindow()
})

ipcMain.on('re-login', async (event, arg) => {
    closeMainWindow()
    createLoginWindow()
})

ipcMain.on('min-main-window', async (event, arg) => {
    minMainWindow()
})

ipcMain.on('hide-main-window', async (event, arg) => {
    hideMainWindow()
})

export function mtLogin() {
    axios.post("https://epassport.meituan.com/api/account/login?service=waimai&bg_source=3&loginContinue=https://e.waimai.meituan.com/new_fe/login#/login/continue&loginType=account",
        {
            "login": "wmlxxm2381471",
            "part_key": "",
            "password": "d057506",
            "error": "",
            "success": "",
            "isFetching": false,
            "loginType": "account",
            "verifyRequestCode": "",
            "verifyResponseCode": "",
            "captchaCode": "",
            "verifyType": null,
            "rohrToken": "eJydlGtvmzAUhv+LpeQTCsZgLpGiKU1Hy9qkWZeuW6sKEeoQEsAUTLK26n/fcRLcfNhFm4TgOVfeYxteURU8ov4rWmRRgvoGxtgy3zS0YRXqI6OHezbSkKghZFOH2JZDHc8jGoqPfY6DDaqhefX1FPXvXYw1G+MH6bgG+97wCNYM7IKrZZM8aMSCS2YFkISWQpR1X9dZGdV1ySvRy1kqmqjoxTzXozjmTSH0pkhFumEZT9LiwzwJa95UMRuY3ZpVmxRoG6V5lHbLLBILXuUD0o15IdKiYQP1ht4+6fgFHeIXbBsuGMCueYeY7+i3PboZW4hwzoXgeZilxXoAwYM2oIO6Ok2KpuyYvhLYMU+hnX0QCdZeAbhaoeAjYLIfYrSMioJlKont3aHsGjZlGP8i3uoD527KjjkEOXD9ZtYNkbF2pYFl85uyW6XJ8u/zVSzmcP+vAf9RKX3fF6q2g8q9OTb9gyI4qn/aZH3fSt/VITh5+UyePMuimuE6UGxZtiJHkQskvwKLGkB0R5YiqkhWWJJsrIgAmTuiimxFjiKvJUdVOJYilecailQ/T1V4bWeKDUVuSwZRRBU5it7zWi1UfqkHMnYTwZKt5ZLBMzpeOu3kZja7mkCmqblEO5+NLyWDMrCCyfRmJktFWzqGXwvE5ZkDYp+24tn9eJGMhuPh5EQfsxV3+FkxXX85e1m+8NPJ02d9ZfNZo+Nv/mp+5a9IEJepf1E9sVs8pKPH52s9erwdmn7p+SfR+G7kBk429ALdeD4Xq3wZJTjPt+vLu+n3pgrM9QC9/QQGP3H+"
        }).then(function(response) {
        let d = response.data;
        if (d.success) {

        }
    })
}
