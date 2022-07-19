<template>
  <div class='container'>
      <div class='handle-box'>
        <div style="flex: 1;">
          <el-date-picker
              v-model="query.time"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :disabled-date="disabledDate"
          />
        </div>
        <div>
          <el-button type='primary' icon="KnifeFork" @click='startSpider' plain>爬取订单数据</el-button>
          <el-button type="primary" icon="Coin">查询本地数据</el-button>
          <el-button type="info" icon="TakeawayBox" round>导出</el-button>
          <el-button icon="Refresh" circle @click="getData"/>
        </div>
      </div>
      <el-table v-loading="state.loading" ref='multipleTable' :data='tableData' border class='table'
                height="350px" size="small"
                header-cell-class-name='table-header'>
        <el-table-column fixed sortable label='序号' prop='info.orderInfo.num'>
          <template #default='scope'>
            #{{scope.row.info.orderInfo.num}}
          </template>
        </el-table-column>
        <el-table-column sortable label='姓名' prop='info.orderInfo.recipient_name'>
          <template #default='scope'>
            <el-tooltip :content="scope.row.info.orderInfo.orderCopyContent">
              {{scope.row.info.orderInfo.recipient_name}}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable label='订单时间' width="160" show-overflow-tooltip prop='info.orderInfo.order_time_fmt'></el-table-column>
        <el-table-column label='隐私号码' prop='info.orderInfo.privacy_phone'></el-table-column>
        <el-table-column align='center' label='备用号码' prop='info.orderInfo.recipient_bindedPhone'>
          <template #default='scope'>
            {{scope.row.info.orderInfo.recipient_bindedPhone ? scope.row.info.orderInfo.recipient_bindedPhone.replace('手机尾号','') : '无'}}
          </template>
        </el-table-column>
        <el-table-column align='center' label='手机尾号' prop='info.orderInfo.recipient_phone'>
          <template #default='scope'>
            {{scope.row.info.orderInfo.recipient_phone.replace('手机尾号','')}}
          </template>
        </el-table-column>
        <el-table-column sortable align='center' label='状态'>
          <template #default='scope'>
            <el-tag :type="scope.row.status === '已回访' ? 'success': scope.row.status === '未接听'? 'danger': ''">
              {{ scope.row.status  }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align='center' label='操作' width='120'>
          <template #default='scope'>
            <el-link text='一键拨号' type='primary' @click='callPhone(scope.$index, scope.row)'>一键拨号</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class='pagination'>
        <el-pagination :current-page='query.page' :page-size='query.size' :total='pageTotal'
                       background layout='total, prev, pager, next'
                       @current-change='handlePageChange'></el-pagination>
      </div>
    </div>
</template>

<script setup>
import {onMounted, reactive, ref, unref} from 'vue'
import {ipcRenderer} from "electron";
import {db} from "../plugins/database";
import {ElNotification} from "element-plus";

const query = reactive({
  time: [new Date(), new Date()],
  page: 1,
  size: 6
})

const tableData = ref([])
const pageTotal = ref(0)
let state = defineReactive({
  loading: false
})

// 获取表格数据
const getData = async () => {
  state.loading = true
  await pageOrderCount(query).then(count => {
    pageTotal.value = count
    pageQueryOrders(query).then(data => {
      tableData.value = data
      setTimeout(()=>{
        state.loading = false
      }, 200)
    })
  })
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

let fetchPayload ={
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
  fetchPayload ={
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

const insertOrder = async (orderId, order) => {
  await db.collection('orders')
      .insert({
        key: orderId,
        info: order,
        status: '未回访',
        orderTime: order.commonInfo.order_time
      })
      .catch(e => {
        //console.log(e)
      })
}

ipcRenderer.on("onOrderListSend", async (event, args) => {
  console.log("接收的数据",args)
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
  if (args.data.nextLabel) {
    setTimeout(()=>{
      getData()
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
  return db.collection('orders').count()
}

const pageQueryOrders = async () => {
  console.log(db.collection('orders'))
  let array = await db.collection('orders')
      .offset((query.page - 1) * query.size)
      .limit(query.size)
      .reverse()
      .sortBy('orderTime')
  console.log(array)
  return array
}

const callPhone = (index, row) => {

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
