import adbkit from 'adbkit'
import schedule from "node-schedule";
import {reject} from "lodash";

const currentDevice = {
    deviceId: '',
    type: ''
}

export const client = adbkit.createClient()

export const Uint8ArrayToString = (fileData) => {
    let dataString = "";
    for (let i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i]);
    }
    return dataString

}

export const adbShell = (deviceId, shell) => {
    return new Promise((success) => {
        client.shell(deviceId, shell)
            .then(adbkit.util.readAll)
            .then(function (output) {
                success(Uint8ArrayToString(output))
            })
    })
}

export const checkConnectionTask = (callback) => {
    let rule = new schedule.RecurrenceRule();
    let times = [];
    for (let i = 1; i < 60; i++) {
        times.push(i);
    }
    rule.second = times;
    schedule.scheduleJob(rule, async () => {
        let result = await client.listDevices();
        if (result !== null && result !== undefined) {
            callback(result);
        }
    });
}

export const callPhone = async (phone) => {
    console.log('phone', phone)
    let result = await adbShell(currentDevice.deviceId, `am start -a android.intent.action.CALL tel:${phone}`)
    console.log(result)
}

export const getCallState = async () => {
    let mCallState = await adbShell(currentDevice.deviceId, `dumpsys telephony.registry | grep "mCallState"`)
    let result = mCallState.split('\n')[0].split('=')[1].trim()
    let callStateMap = ['未通话', '响铃中', '通话中', '未知']
    return callStateMap[result ?? 3]
}

export const hangUpCall = async () => {
    await adbShell(currentDevice.deviceId, `input keyevent 6`)
    console.log("已挂断")
}

export default currentDevice
