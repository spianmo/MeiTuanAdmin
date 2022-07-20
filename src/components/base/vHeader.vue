<template>
  <div class='header'>
    <!-- 折叠按钮 -->
    <div class='collapse-btn' @click='collapseChange'>
      <i v-if='!collapse' class='el-icon-s-fold'></i>
      <i v-else class='el-icon-s-unfold'></i>
    </div>
    <div class='logo'>{{ state.currentLabel }}</div>
    <div style="height: 100%;width: 100%;display: flex;justify-content: flex-end;align-items: center">
      <el-select style="width: 220px" class="m-r-20" v-model="state.device" value-key="value" placeholder="请选择连接的设备"
                 @change="onDevicesChange">
        <template #prefix>
          <el-icon class="el-input__icon">
            <Iphone/>
          </el-icon>
          <div v-if="Object.keys(state.device).length!==0" class="m-l-5" :style="{
          'border-radius': '6px',
          'background-color': state.device.type==='offline' ? '#fd563c' : '#09f175',
          'width': '10px',
          'height': '10px'
          }"></div>
        </template>
        <el-option
            v-for="item in state.options"
            :key="item.value"
            :label="item.label"
            :value="item">
          <template #default>
            <el-tag v-if="item.type==='device'">设备</el-tag>
            <el-tag v-if="item.type==='emulator'" type="success">模拟器</el-tag>
            <el-tag v-if="item.type==='offline'" type="danger">离线</el-tag>
            {{ item.label }}
          </template>
        </el-option>
      </el-select>
      <el-tooltip content="当前设备通话状态">
        <el-button style="cursor: default" type="primary" text bg>{{ state.callState }}
        </el-button>
      </el-tooltip>
      <el-button class="m-r-20" type="danger" @click="hangUp" text bg>挂断电话</el-button>
    </div>
  </div>
</template>
<script setup>
import {computed, onMounted, reactive} from 'vue'
import {useStore} from 'vuex'
import {onBeforeRouteUpdate} from "vue-router";
import {ipcRenderer} from "electron";
import currentDevice, {checkConnectionTask, getCallState, hangUpCall} from "../../utils/device";
import {ElNotification} from "element-plus";

const store = useStore()
let state = reactive({
  currentLabel: '美团外卖订单',
  options: [],
  device: {},
  callState: '通话未知',
})

const collapse = computed(() => store.state.collapse)
// 侧边栏折叠
const collapseChange = () => {
  store.commit('handleCollapse', !collapse.value)
}

const discoverDevice = () => {
  checkConnectionTask((result) => {
    let list = [];
    for (let i = 0; i < result.length; i++) {
      list.push({
        value: result[i].id,
        label: result[i].id,
        type: result[i].type
      });
    }

    if (list.length === 0) {
      state.device = {};
      currentDevice.deviceId = ''
      currentDevice.type = ''
    } else {
      state.device = list[0];
      onDevicesChange(list[0])
    }
    state.options = list;
  })
}

const onDevicesChange = (device) => {
  currentDevice.deviceId = device.value
  currentDevice.type = device.type
}

ipcRenderer.on("onPoiInfoSend", async (event, args) => {
  console.log("onPoiInfoSend", args)
  state.currentLabel = args.name ?? '美团外卖订单'
})

const hangUp = async () => {
  if (!currentDevice.type) {
    ElNotification({
      title: '设备未连接',
      message: '请先连接设备！',
      type: 'error',
      position: 'bottom-right',
    })
    return
  }
  if (currentDevice.type === 'offline') {
    ElNotification({
      title: '挂断失败',
      message: '设备已离线！',
      type: 'error',
      position: 'bottom-right',
    })
    return
  }
  await hangUpCall()
  ElNotification({
    title: '已挂断',
    message: '已发送挂断指令！',
    type: 'success',
    position: 'bottom-right',
  })
}

onMounted(() => {
  discoverDevice()
  setInterval(async () => {
    state.callState = await getCallState()
  }, 600)
  ipcRenderer.send("getPoiInfo")
  if (document.body.clientWidth < 1500) {
    collapseChange()
  }
})

onBeforeRouteUpdate((to) => {
  state.currentLabel.value = to.meta.title;
});

</script>
<style scoped>
.header {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  font-size: 22px;
  color: #fff;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 50px;
  color: #000;
}

.header .logo {
  float: left;
  width: 250px;
  line-height: 50px;
  color: #000000;
  font-size: 16px;
  font-weight: bold;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 50px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #000000;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
