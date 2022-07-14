<script src="../../../../UserFolder/Desktop/美团外卖分析/index.ts"></script>
<template>
  <div>
    <div class="container">
      <el-button type='primary' @click='add'>Add</el-button>
      <el-button type='primary' @click='del'>Del</el-button>
      <el-button type='primary' @click='update'>Update</el-button>
      <el-button type='primary' @click='getAll'>GetAll</el-button>
      <el-button type='primary' @click='GetByKey'>GetByKey</el-button>
      <el-button type='primary' @click='GetByWhere'>GetByWhere</el-button>
      <el-divider/>
      <el-table :data='tableData' style='width: 100%'>
        <el-table-column label='key' prop='key'/>
        <el-table-column label='value' prop='value'/>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {db} from '../plugins/database'
import {onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {ipcRenderer} from "electron";

const tableData = ref([])

const add = async () => {
  for (let i = 1; i <= 5; i++) {
    await db.collection('dict').insert({key: 'key' + i, value: i}).catch(e => {
      console.log(e)
      ElMessage.error(e.message)
    })
  }
  tableData.value = await list()
}

const del = async () => {
  for (let i = 1; i <= 5; i++) {
    await db.collection('dict').remove({key: 'key' + i}).catch(e => {
      console.log(e)
      ElMessage.error(e.message)
    })
  }
  tableData.value = await list()
}

const update = async () => {
  for (let i = 1; i <= 5; i++) {
    await db.collection('dict').update({key: 'key' + i}, {value: 100 + i}).catch(e => {
      console.log(e)
      ElMessage.error(e.message)
    })
  }
  tableData.value = await list()
}

const getAll = async () => {
  tableData.value = await list()
}

const GetByKey = async () => {
  tableData.value = await db.collection('dict').find({key: 'key2'}).toArray()
}

const GetByWhere = async () => {
  tableData.value = await db.collection('dict').find({value: {$gte: 3}}).toArray()
}

ipcRenderer.on("onOrderListSend", (event, args) => {
  console.log(args)
})

onMounted(() => {
  getAll()
  ipcRenderer.send("getOrderList", {
    tag: "all",
    startDate: "2022-07-14",
    endDate: "2022-07-14",
    nextLabel: '{"day":20220714,"day_seq":8,"page":0}',
    userId: -1,
    pageNum: 1,
    pageSize: 10
  })
})

const list = () => {
  return db.collection('dict').orderBy('key').reverse().toArray()
}

</script>

<style scoped>

</style>
