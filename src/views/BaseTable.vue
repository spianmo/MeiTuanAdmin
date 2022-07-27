<template>
  <div class='container'>
    <div class='handle-box'>
      <div style="flex: 1;" class="flex-prue">
        <div>
          <el-date-picker
              v-model="query.time"
              type="daterange"
              unlink-panels
              @change="getData"
              :editable="false"
              :clearable="false"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :disabled-date="disabledDate"
          />
        </div>
        <el-form-item class="m-l-20" label="只看新客">
          <el-switch v-model="query.onlyNew" @change="getData"/>
        </el-form-item>
      </div>
      <div>
        <el-button type='primary' icon="KnifeFork" @click='startSpider' plain>爬取订单数据</el-button>
        <el-button type="primary" icon="Coin" @click="getData">查询本地数据</el-button>
        <el-button type="info" icon="TakeawayBox" @click="exportData" round>导出</el-button>
      </div>
    </div>
    <el-table v-loading="state.loading" ref='multipleTable' :data='tableData' border class='table'
              height="470px" size="small"
              header-cell-class-name='table-header'>
      <el-table-column fixed sortable align="center" label='序号' prop='info.orderInfo.num'>
        <template #default='scope'>
          #{{ scope.row.info.orderInfo.num }}
        </template>
      </el-table-column>
      <el-table-column sortable show-overflow-tooltip label='订单号' prop='key'/>
      <el-table-column width="100" sortable align="center" label='姓名' prop='info.orderInfo.recipient_name'>
        <template #default='scope'>
          <el-tooltip :content="scope.row.info.orderInfo.orderCopyContent">
            {{ scope.row.info.orderInfo.recipient_name }}
          </el-tooltip>
          <br v-if="scope.row.info.orderInfo.is_poi_first_order" />
          <el-tag size="small" v-if="scope.row.info.orderInfo.is_poi_first_order" effect="light" round type="danger">门店新客</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable label='订单时间' width="160" show-overflow-tooltip
                       prop='info.orderInfo.order_time_fmt'></el-table-column>
      <el-table-column align='center' label='隐私号码' prop='info.orderInfo.privacy_phone' show-overflow-tooltip>
        <template #default='scope'>
          {{
            scope.row.info.orderInfo.privacy_phone?.split(',')[1] ?? ''
          }}
        </template>
      </el-table-column>
      <el-table-column align='center' label='备用号码' prop='info.orderInfo.recipient_bindedPhone'>
        <template #default='scope'>
          {{
            scope.row.info.orderInfo.recipient_bindedPhone ? scope.row.info.orderInfo.recipient_bindedPhone.replace('手机尾号', '') : '无'
          }}
        </template>
      </el-table-column>
      <el-table-column align='center' label='手机尾号' prop='info.orderInfo.recipient_phone'>
        <template #default='scope'>
          {{ scope.row.info.orderInfo.recipient_phone.replace('手机尾号', '') }}
        </template>
      </el-table-column>
      <el-table-column width="200" align='center' label='回访备注' prop='info.remark'>
        <template #default='scope'>
          <el-input
              v-model="scope.row.remark"
              :rows="2"
              @change="updateRemark(scope.row)"
              type="textarea"
              placeholder="回访备注"
          />
        </template>
      </el-table-column>
      <el-table-column sortable align='center' label='状态'>
        <template #default='scope'>
          <el-tag @click="updateOrderStatus(scope.row)"
                  :type="scope.row.status === '已回访' ? 'success': scope.row.status === '未接听'? 'danger': ''">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align='center' label='操作' width='120'>
        <template #default='scope'>
          <el-link text='一键拨号' type='primary' @click='callPhoneNumber(scope.$index, scope.row)'>一键拨号</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class='pagination flex justify-between align-items'>
      <el-pagination :current-page='query.page' :page-size='query.size' :total='pageTotal'
                     background layout='total, prev, pager, next'
                     @current-change='handlePageChange'></el-pagination>
      <div>
        总回访数量: {{ state.totalBackOrder }} 成功回访数量: {{ state.successBackOrder }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {ipcRenderer} from "electron";
import {db} from "../plugins/database";
import {ElNotification} from "element-plus";
import device, {callPhone} from "../utils/device";
import localConfig from "../utils/memoryConfig";
import * as XLSX from "xlsx";

const query = reactive({
  time: [new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(0, 0, 0, 0))],
  page: 1,
  size: 7,
  onlyNew: false
})

const tableData = ref([])
const pageTotal = ref(0)
let state = reactive({
  loading: false,
  totalBackOrder: 0,
  successBackOrder: 0
})

// 获取表格数据
const getData = async () => {
  state.loading = true
  await pageOrderCount(query).then(count => {
    pageTotal.value = count
    pageQueryOrders(query).then(async data => {
      tableData.value = data
      await getOrderSumNum()
      state.loading = false
    })
  })
}

const dataByGroup = async (workbook) => {
  const result = {}
  let dataByGroup = await db.collection('orders').reverse().toArray()
  dataByGroup.forEach(item=>{
    if (!item.remarkDay) return
    if (!result[item.remarkDay]) {
      result[item.remarkDay] = [item]
    } else {
      result[item.remarkDay].push(item)
    }
  })
  console.log("group", result)
  //业绩表行
  let rowsPerformance = []
  Object.keys(result).forEach(key=>{
    let rows = []
    rows.push({})
    console.log(result[key])
    rowsPerformance.push({
      a: key,
      b: key,
      c: result[key]?.filter(item=>item.status !== '未回访')?.length ?? 0,
      d: result[key]?.filter(item=>item.status === '已回访')?.length ?? 0,
      e: '',
      f: localConfig.info.oaInfo.name
    })
    result[key].forEach((item, index)=>{
      if (item.status === '未回访') return;
      rows.push({
        id: index + 1,
        //recipient_name: item.info.orderInfo.recipient_name,
        orderTime: item.info.orderInfo.order_time_fmt,
        callTime: item.remarkTime,
        privacyPhone: item.info.orderInfo.privacy_phone?.split(',')[1] ?? '',
        recipient_bindedPhone: item.info.orderInfo.recipient_bindedPhone,
        recipient_phone: item.info.orderInfo.recipient_phone.replace('手机尾号', ''),
        status: item.status,
        remark: item.remark,
        staff: localConfig.info.oaInfo.name
      })
    })

    //业绩表生成
    const worksheetPerformance = XLSX.utils.json_to_sheet(rowsPerformance);
    XLSX.utils.sheet_add_aoa(worksheetPerformance, [["回访时间", "好评时间", "回访电话数", "电话接通数", "成功好评数", "回访客服"]], {origin: "A1"});
    XLSX.utils.book_append_sheet(workbook, worksheetPerformance, "业绩表");
    worksheetPerformance["!cols"] = [{wch: 20},{wch: 20},{wch: 20},{wch: 20},{wch: 20}];

    //每日表生成
    console.log(rows)
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!merges'] = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 9}}
    ];
    let title = localConfig.mainTitle+ ' ' + key + '成功回访数量: ' + (result[key]?.filter(item=>item.status === '已回访')?.length ?? 0 ?? 0)
    XLSX.utils.sheet_add_aoa(worksheet, [[title], ["序号", /**"顾客姓名",**/ "订单时间", "回访时间", "隐私号码", "备用号码", "手机尾号", "回访状态", "回访备注", "回访客服"]],
        {origin: "A1"});
    XLSX.utils.book_append_sheet(workbook, worksheet, key);
    worksheet["!cols"] = [{wch: 10},{wch: 10},{wch: 26},{wch: 26},{wch: 20},{wch: 15},{wch: 10},{wch: 10},{wch: 10},{wch: 10}];
  })
}

const exportData = async () => {
  let raw = await db.collection('orders').reverse().toArray()
  let rows = []
  rows.push({})
  raw.forEach((item, index)=>{
    rows.push({
      id: index + 1,
      //recipient_name: item.info.orderInfo.recipient_name,
      orderTime: item.info.orderInfo.order_time_fmt,
      callTime: item.remarkTime,
      privacyPhone: item.info.orderInfo.privacy_phone?.split(',')[1] ?? '',
      recipient_bindedPhone: item.info.orderInfo.recipient_bindedPhone,
      recipient_phone: item.info.orderInfo.recipient_phone.replace('手机尾号', ''),
      status: item.status,
      remark: item.remark,
      staff: localConfig.info.oaInfo.name
    })
  })
  console.log(rows)
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  worksheet['!merges'] = [
    {s: {r: 0, c: 0}, e: {r: 0, c: 9}}
  ];

  let title = localConfig.mainTitle+ '总回访数量:' + state.totalBackOrder + '成功回访数量' + state.successBackOrder
  XLSX.utils.sheet_add_aoa(worksheet, [[title], ["序号", /**"顾客姓名",**/ "订单时间", "回访时间", "隐私号码", "备用号码", "手机尾号", "回访状态", "回访备注", "回访客服"]],
      {origin: "A1"});
  XLSX.utils.book_append_sheet(workbook, worksheet, "总表");
  worksheet["!cols"] = [{wch: 10},{wch: 10},{wch: 26},{wch: 26},{wch: 20},{wch: 15},{wch: 10},{wch: 10},{wch: 10},{wch: 10}];
  await dataByGroup(workbook)
  XLSX.writeFile(workbook, `【美团】${localConfig.info.poiInfo.name}-${localConfig.info.oaInfo.name}.xlsx`);
}

const handlePageChange = (val) => {
  query.page = val
  getData()
}

const disabledDate = (time) => {
  if (time.getTime() > new Date().getTime()) {
    return time.getTime() >= new Date().getTime(); //时间范围必须是时间戳
  } else {
    return time.getTime() < Date.now() - 7 * 8.64e7; //8.64e7就是一天的时间戳 24*60*60*1000   两天之内 根据自己需求来定
  }
}


const nowFormatTime = () => {
  return formatTime(new Date())
}

const formatTime = (data) => {
  let year = data.getFullYear()
  let month = data.getMonth()
  let _date = data.getDate()
  month = month + 1
  if (month < 10) month = "0" + month
  if (_date < 10) _date = "0" + _date
  return year + "-" + month + "-" + _date
}

const formatTimeDate = (time) => {
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  let hour = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds()
  if (month < 10) month = "0" + month
  if (day < 10) day = "0" + day
  if (hour < 10) hour = "0" + hour
  if (minute < 10) minute = "0" + minute
  if (second < 10) second = "0" + second
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
}

const formatTimeDay = (time) => {
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  if (month < 10) month = "0" + month
  if (day < 10) day = "0" + day
  return year + "-" + month + "-" + day
}

let fetchPayload = {
  tag: "complete",
  startDate: "",
  endDate: "",
  nextLabel: '',
  lastLabel: ''
}

const startSpider = () => {
  if (!Array.isArray(query.time) || query.time.length !== 2) {
    ElNotification({
      title: '错误',
      message: '请先选择起始时间和终止时间，美团接口限制只开放近七天订单数据！',
      type: 'error',
      position: 'bottom-right',
    })
    return
  }
  fetchPayload = {
    tag: "complete",
    startDate: formatTime(query.time[0]),
    endDate: formatTime(query.time[1]),
    nextLabel: '',
    lastLabel: ''
  }
  fetchOrderData()
}

const fetchOrderData = () => {
  console.log("发送的数据", fetchPayload)
  ipcRenderer.send("getOrderList", fetchPayload)
}

const stateMachine = ['未回访', '已回访', '未接听']

const updateOrderStatus = async (order) => {
  order.status = stateMachine[(stateMachine.findIndex(t => t === order.status) + 1) % 3]
  console.log(order)
  await updateOrder(order)
  await db.collection('orders')
      .update({key: order.key}, {
        remarkTime: formatTimeDate(new Date()),
        remarkDay: formatTimeDay(new Date()),
      })
  await getData()
}

const updateOrder = async (order) => {
  return await db.collection('orders')
      .update({key: order.key}, {status: order.status})
}

const updateRemark = async (order) => {
  console.log(order)
  await db.collection('orders')
      .update({key: order.key}, {remark: order.remark})
}

const insertOrder = async (orderId, order) => {
  await db.collection('orders')
      .insert({
        key: orderId,
        info: order,
        status: '未回访',
        remark: '',
        orderTime: order.commonInfo.order_time,
        remarkTime: '',
        remarkDay: '',
        is_poi_first_order: order.orderInfo.is_poi_first_order ? "true" : "false"
      })
      .catch(e => {
        //console.log(e)
      })
}

ipcRenderer.on("onOrderListSend", async (event, args) => {
  console.log("接收的数据", args)
  if (args === 'fuck') {
    ElNotification({
      title: '数据爬取',
      message: '爬取失败！接口访问频繁',
      type: 'error',
      position: 'bottom-right',
    })
    //return
  }
  ElNotification({
    title: '数据爬取',
    message: '接收到' + args.data.wmOrderList.length + '条数据',
    type: 'success',
    position: 'bottom-right',
  })
  fetchPayload.nextLabel = args.data.nextLabel
  //fetchPayload.lastLabel = args.data.lastLabel
  for (const order of args.data.wmOrderList) {
    await insertOrder(order.orderInfo.wm_order_id_view_str, order)
  }
  await getData()
  if (args.data.nextLabel) {
    setTimeout(() => {
      fetchOrderData()
    }, randomTime() + 1000)
  }
})

const randomTime = () => {
  return Math.random() * 3000
}

onMounted(() => {
  fetchPayload.startDate = nowFormatTime()
  fetchPayload.endDate = nowFormatTime()
  fetchOrderData()
  getData()
})

function pageOrderCount(query) {
  let orderTime = {}
  if (query.time.length === 2) {
    let startDate = Math.round(query.time[0].getTime() / 1000)
    let endDate = Math.round(query.time[1].getTime() / 1000)

    endDate += 24 * 3600

    orderTime = {
      startDate,
      endDate
    }
  }
  console.log(orderTime)
  return query.onlyNew ? db.collection('orders')
      .where(['is_poi_first_order', 'orderTime'])
      .between(["true", orderTime.startDate], ["true", orderTime.endDate], true, true)
      .count() :db.collection('orders')
      .where('orderTime').between(orderTime.startDate, orderTime.endDate)
      .count()
}

const getOrderSumNum = async () => {
  let faildBackOrder = await db.collection('orders')
      .find({status: '未接听'})
      .count()
  state.successBackOrder = await db.collection('orders')
      .find({status: '已回访'})
      .count()
  state.totalBackOrder = state.successBackOrder + faildBackOrder
  document.title  = localConfig.mainTitle + ' 总回访：' + state.totalBackOrder + ' 已回访：' + state.successBackOrder
}

const pageQueryOrders = async () => {
  let orderTime = {}
  if (query.time.length === 2) {
    let startDate = Math.round(query.time[0].getTime() / 1000)
    let endDate = Math.round(query.time[1].getTime() / 1000)

    endDate += 24 * 3600

    orderTime = {
      startDate,
      endDate
    }
  }

  return query.onlyNew ? await db.collection('orders')
      .where(['is_poi_first_order', 'orderTime'])
      .between(["true", orderTime.startDate], ["true", orderTime.endDate], true, true)
      .reverse()
      .offset((query.page - 1) * query.size)
      .limit(query.size).toArray() : await db.collection('orders')
      .where('orderTime')
      .between(orderTime.startDate, orderTime.endDate)
      .reverse()
      .offset((query.page - 1) * query.size)
      .limit(query.size).toArray()
}

const callPhoneNumber = async (index, row) => {
  if (!device.type) {
    ElNotification({
      title: '拨打失败',
      message: '拨号设备未连接！',
      type: 'error',
      position: 'bottom-right',
    })
    return
  }
  if (device.type === 'offline') {
    ElNotification({
      title: '拨打失败',
      message: '拨号设备已离线！',
      type: 'error',
      position: 'bottom-right',
    })
    return
  }
  let phone = row.info.orderInfo.privacy_phone
  await callPhone(phone)
  row.status = "已回访"
  await updateOrder(row)
  await db.collection('orders')
      .update({key: order.key}, {
        remarkTime: formatTimeDate(new Date()),
        remarkDay: formatTimeDay(new Date()),
      })
}

</script>

<style lang="scss" scoped>
.container {
  :deep(.el-range__icon) {
    height: auto;
  }

  :deep(.el-range__close-icon) {
    height: auto;
  }
}

.handle-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 200px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.mr10 {
  margin-right: 10px;
}

.el-link {
  margin-right: 8px;
}

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
</style>
