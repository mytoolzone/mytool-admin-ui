<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline" @keyup.enter="onSubmit">
      <el-form-item label="创建时间">
      <el-date-picker v-model="searchInfo.startCreatedAt" type="datetime" placeholder="开始时间"></el-date-picker>
       —
      <el-date-picker v-model="searchInfo.endCreatedAt" type="datetime" placeholder="结束时间"></el-date-picker>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
        <div class="gva-btn-list">
            <el-button type="primary" icon="plus" @click="openDialog">新增</el-button>
            <el-popover v-model:visible="deleteVisible" placement="top" width="160">
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin-top: 8px;">
                <el-button type="primary" link @click="deleteVisible = false">取消</el-button>
                <el-button type="primary" @click="onDelete">确定</el-button>
            </div>
            <template #reference>
                <el-button icon="delete" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="deleteVisible = true">删除</el-button>
            </template>
            </el-popover>
        </div>
        <el-table
        ref="multipleTable"
        style="width: 100%"
        tooltip-effect="dark"
        :data="tableData"
        row-key="ID"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column align="left" label="日期" width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
        </el-table-column> -->
        <!-- <el-table-column align="left" label="开发者" prop="userId" width="120" /> -->
        <el-table-column align="left" label="名称" prop="name" width="120" />
        <!-- <el-table-column align="left" label="图标" prop="icon" width="120" /> -->
        <el-table-column align="left" label="标签" prop="tags" width="120">
            <template #default="scope">
            <!-- {{ filterDict(scope.row.tags,tool_tagOptions) }} -->
            {{ scope.row.tags }}
            </template>
        </el-table-column>
        <el-table-column align="left" label="类型" prop="type" width="120">
            <template #default="scope">
            {{ filterDict(scope.row.type,tool_typeOptions) }}
            </template>
        </el-table-column>
        <el-table-column align="left" label="属性" prop="attr" width="120">
            <template #default="scope">
            {{ filterDict(scope.row.attr,tool_attrOptions) }}
            </template>
        </el-table-column>
        <!-- <el-table-column align="left" label="描述信息" prop="desc" width="120" /> -->
        <el-table-column align="left" label="工具价格" prop="price" width="120" />
        <el-table-column align="left" label="操作" width="240">
            <template #default="scope">
            <el-button type="primary" link icon="edit" class="table-button" @click="updateToolsFunc(scope.row)">变更</el-button>
            <el-button type="primary" link icon="delete" @click="deleteRow(scope.row)">删除</el-button>
            <el-button
              icon="document"
              type="primary"
              link
              @click="toDetail(scope.row)"
            >详情</el-button>
            </template>
        </el-table-column>
        </el-table>
        <div class="gva-pagination">
            <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[10, 30, 50, 100]"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            />
        </div>
    </div>
    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" title="弹窗操作">
      <el-form :model="formData" label-position="right" ref="elFormRef" :rules="rule" label-width="80px">
        <el-form-item label="名称:"  prop="name" >
          <el-input v-model="formData.name" :clearable="true"  placeholder="请输入" />
        </el-form-item>
        <el-form-item label="图标:"  prop="icon" >
          <el-input v-model="formData.icon" :clearable="true"  placeholder="请输入" />
        </el-form-item>
        <el-form-item label="属性:"  prop="attr" >
          <!-- <el-input v-model="formData.attr" :clearable="true"  placeholder="请输入" /> -->
          <el-select v-model="formData.attr" placeholder="请选择" style="width:100%">
            <el-option 
              v-for="item in tool_attrOptions"
              :key="item.value"
              :label="`${item.label}(${item.value})`"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类型:"  prop="type" >
          <!-- <el-input v-model="formData.type" :clearable="true"  placeholder="请输入" /> -->
          <el-select v-model="formData.type" placeholder="请选择" style="width:100%">
            <el-option 
              v-for="item in tool_typeOptions"
              :key="item.value"
              :label="`${item.label}(${item.value})`"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签:"  prop="tags" >
          <el-select multiple v-model="formDataUi" placeholder="请选择" style="width:100%">
            <el-option 
              v-for="item in tool_tagOptions"
              :key="item.value"
              :label="`${item.label}(${item.value})`"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="简介:"  prop="desc" >
          <el-input type="textarea" v-model="formData.desc" :clearable="true"  placeholder="请输入" />
        </el-form-item>
        <el-form-item label="价格(元):"  prop="price" >
          <el-input-number v-model.number="formData.price" :clearable="true" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Tools'
}
</script>

<script setup>
import {
  createTools,
  deleteTools,
  deleteToolsByIds,
  updateTools,
  findTools,
  getToolsList
} from '@/api/tools'


// 全量引入格式化工具 请按需保留
import { getDictFunc, formatDate, formatBoolean, filterDict } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// 自动化生成的字典（可能为空）以及字段
const tool_typeOptions = ref([])
const tool_attrOptions = ref([])
const tool_tagOptions = ref([])
const formDataUi = ref({})

const formData = ref({
        userId: 0,
        name: '',
        icon: '',
        tags: '',
        type: '',
        attr: '',
        desc: '',
        price: 0,
        })

// 验证规则
const rule = reactive({
               name : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               icon : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               tags : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               type : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               attr : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               desc : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               price : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
})

const elFormRef = ref()

// =========== 表格控制部分 ===========
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})

// 重置
const onReset = () => {
  searchInfo.value = {}
  getTableData()
}

// 搜索
const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

// 修改页面容量
const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await getToolsList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

getTableData()

// ============== 表格控制部分结束 ===============

// 获取需要的字典 可能为空 按需保留
const setOptions = async () =>{
    tool_typeOptions.value = await getDictFunc('tool_type')
    tool_attrOptions.value = await getDictFunc('tool_attr')
    tool_tagOptions.value = await getDictFunc('tool_tag')

    console.log( tool_typeOptions.value )
    console.log( tool_attrOptions.value )
    console.log( tool_tagOptions.value )
}

// 获取需要的字典 可能为空 按需保留
setOptions()


// 多选数据
const multipleSelection = ref([])
// 多选
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}

// 删除行
const deleteRow = (row) => {
    ElMessageBox.confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
            deleteToolsFunc(row)
        })
    }


// 批量删除控制标记
const deleteVisible = ref(false)

// 多选删除
const onDelete = async() => {
      const ids = []
      if (multipleSelection.value.length === 0) {
        ElMessage({
          type: 'warning',
          message: '请选择要删除的数据'
        })
        return
      }
      multipleSelection.value &&
        multipleSelection.value.map(item => {
          ids.push(item.ID)
        })
      const res = await deleteToolsByIds({ ids })
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        if (tableData.value.length === ids.length && page.value > 1) {
          page.value--
        }
        deleteVisible.value = false
        getTableData()
      }
    }

// 行为控制标记（弹窗内部需要增还是改）
const type = ref('')

// 更新行
const updateToolsFunc = async(row) => {
    const res = await findTools({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
      //formData.value.tags = formDataUi.value.join(',')
      formData.value = res.data.retools
      formDataUi.value = formData.value.tags.split(',')
      dialogFormVisible.value = true
    }
}

// 删除行
const deleteToolsFunc = async (row) => {
    const res = await deleteTools({ ID: row.ID })
    if (res.code === 0) {
        ElMessage({
                type: 'success',
                message: '删除成功'
            })
            if (tableData.value.length === 1 && page.value > 1) {
            page.value--
        }
        getTableData()
    }
}

// 弹窗控制标记
const dialogFormVisible = ref(false)

// 打开弹窗
const openDialog = () => {
    type.value = 'create'
    dialogFormVisible.value = true
}

// 关闭弹窗
const closeDialog = () => {
    dialogFormVisible.value = false
    formData.value = {
        userId: 0,
        name: '',
        icon: '',
        tags: '',
        type: '',
        attr: '',
        desc: '',
        price: 0,
        }
}
// 弹窗确定
const enterDialog = async () => {
     elFormRef.value?.validate( async (valid) => {
             formData.value.tags = formDataUi.value.join(',')

             if (!valid) return
              let res
              switch (type.value) {
                case 'create':
                  res = await createTools(formData.value)
                  break
                case 'update':
                  res = await updateTools(formData.value)
                  break
                default:
                  res = await createTools(formData.value)
                  break
              }
              if (res.code === 0) {
                ElMessage({
                  type: 'success',
                  message: '创建/更改成功'
                })
                closeDialog()
                getTableData()
              }
      })
}


const toDetail = (row) => {
  console.log('row', row)
  router.push({
    name: 'toolsEdit',
    query: {
      id: row.ID,
    },
  })
}
</script>

<style>
</style>
