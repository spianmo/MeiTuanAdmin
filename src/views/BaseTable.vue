<template>
  <div>
    <div class='container'>
      <div class='handle-box'>
        <el-select v-model='query.address' placeholder='地址' class='handle-select mr10'>
          <el-option key='1' label='广东省' value='广东省'></el-option>
          <el-option key='2' label='湖南省' value='湖南省'></el-option>
        </el-select>
        <el-input v-model='query.name' placeholder='用户名' class='handle-input mr10'></el-input>
        <el-button type='primary' @click='handleSearch'>搜索</el-button>
        <el-button type='' @click='handleClear'>清空</el-button>
      </div>
      <el-table :data='tableData' border class='table' ref='multipleTable' header-cell-class-name='table-header'>
        <el-table-column prop='name' label='用户名'></el-table-column>
        <el-table-column label='账户余额'>
          <template #default='scope'>￥{{ scope.row.money }}</template>
        </el-table-column>
        <el-table-column prop='address' label='地址'></el-table-column>
        <el-table-column label='状态' align='center'>
          <template #default='scope'>
            <el-tag :type="scope.row.state === '成功' ? 'success': scope.row.state === '失败'? 'danger': ''">
              {{ scope.row.state }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop='date' label='注册时间'></el-table-column>
        <el-table-column label='操作' width='180' align='center'>
          <template #default='scope'>
            <el-link type='primary' text='编辑' @click='handleEdit(scope.$index, scope.row)'>编辑</el-link>
            <el-link type='danger' text='删除' @click='handleDelete(scope.row.id)'>删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class='pagination'>
        <el-pagination background layout='total, prev, pager, next' :current-page='query.page'
                       :page-size='query.size' :total='pageTotal'
                       @current-change='handlePageChange'></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title='编辑' v-model='editVisible' width='30%'>
      <el-form label-width='70px'>
        <el-form-item label='用户名'>
          <el-input v-model='form.name'></el-input>
        </el-form-item>
        <el-form-item label='账户余额'>
          <el-input v-model='form.money'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class='dialog-footer'>
                    <el-button @click='editVisible = false'>取 消</el-button>
                    <el-button type='primary' @click='saveEdit'>确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {initLog, updateLog, deleteLog, pageLogCount, pageLogData} from '@/api'

const query = reactive({
  address: '',
  name: '',
  page: 1,
  size: 10
})
const tableData = ref([])
const pageTotal = ref(0)
// 获取表格数据
const getData = async () => {
  await pageLogCount(query).then(count => {
    pageTotal.value = count
    pageLogData(query).then(data => {
      tableData.value = data
    })
  })
}

// 表格编辑时弹窗和保存
const editVisible = ref(false)
const form = reactive({
  id: '',
  name: '',
  money: ''
})

onMounted(() => {
  initLog()
  getData()
})

// 查询操作
const handleSearch = () => {
  query.page = 1
  getData()
}

// 查询操作
const handleClear = () => {
  query.page = 1
  query.address = ''
  query.name = ''
  query.size = 10
  getData()
}

// 分页导航
const handlePageChange = (val) => {
  query.page = val
  getData()
}

// 删除操作
const handleDelete = (id) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteLog(id).then(res => {
      getData()
      ElMessage.success('删除成功！')
    })
  }).catch(() => {
  })
}

const handleEdit = (index, row) => {
  Object.keys(form).forEach((item) => {
    form[item] = row[item]
  })
  editVisible.value = true
}

const saveEdit = () => {
  updateLog(form).then(() => {
    ElMessage.success('保存成功')
    editVisible.value = false
    getData()
  })
}

</script>

<style scoped>
.handle-box {
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
