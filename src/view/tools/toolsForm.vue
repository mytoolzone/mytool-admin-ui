<template>
  <div>

    <h3> 工具属性</h3>
    <div class="gva-form-box">
      <el-form :model="formData" ref="elFormRef" label-position="right" :rules="rule" label-width="80px">
        <!-- <el-form-item label="开发者:" prop="userId">
          <el-input v-model.number="formData.userId" :clearable="true" placeholder="请输入" />
        </el-form-item> -->

        <el-row :gutter="0">
          <el-col :span="16">
             <el-form-item label="名称:" prop="name">
               <el-input v-model="formData.name" :clearable="true" placeholder="请输入" />
            </el-form-item>

             <el-form-item label="价格:" prop="price">
              <el-input v-model.number="formData.price" :clearable="true" placeholder="请输入" />
             </el-form-item>
          </el-col>
         <el-col :span="8">
          <el-form-item label="工具图标" label-width="120px" style="float:right">
            <div style="display:inline-block" @click="openHeaderChange">
              <img v-if="formData.icon" alt="图标" class="header-img-box" :src="(formData.icon && formData.icon.slice(0, 4) !== 'http')?path+formData.icon:formData.icon">
              <div v-else class="header-img-box">从媒体库选择</div>
            </div>
          </el-form-item>
        </el-col>
      </el-row> 

        <el-row :gutter="0">
          <el-col :span="8">
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
          </el-col>

          <el-col :span="8">
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
          </el-col>

          <el-col :span="8">
            <el-form-item label="标签:"  prop="tags" >
              <!-- <el-select v-model="formData.tags" placeholder="请选择" style="width:100%">
                <el-option 
                  v-for="item in tool_tagOptions"
                  :key="item.value"
                  :label="`${item.label}(${item.value})`"
                  :value="item.value"
                />
              </el-select> -->

              <el-select multiple v-model="formDataUi" placeholder="请选择" style="width:100%">
                <el-option 
                  v-for="item in tool_tagOptions"
                  :key="item.value"
                  :label="`${item.label}(${item.value})`"
                  :value="item.value"
                />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="简介:" prop="desc">
          <el-input type="textarea" :rows="10" v-model="formData.desc" :clearable="true" placeholder="请输入" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

    <h3> 工具详情 </h3>
    <div>
        <ToolPackageForm :tool="formData"> </ToolPackageForm>
    </div>
    <ChooseImg ref="chooseImg" :target="formData" :target-key="`icon`" />
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
  updateTools,
  findTools
} from '@/api/tools'

// 自动获取字典
import { getDictFunc } from '@/utils/format'
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import ToolPackageForm from '@/view/toolPackage/toolPackageForm.vue'
import ChooseImg from '@/components/chooseImg/index.vue'

const route = useRoute()
const router = useRouter()

const type = ref('')
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

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}


// 初始化方法
const init = async () => {
 // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
    if (route.query.id) {
      const res = await findTools({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data.retools
        formDataUi.value  = formData.value.tags.split(',')
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    tool_typeOptions.value = await getDictFunc('tool_type')
    tool_attrOptions.value = await getDictFunc('tool_attr')
    tool_tagOptions.value = await getDictFunc('tool_tag')
}

init()
// 保存按钮
const save = async() => {
      formData.value.tags = formDataUi.value.join(',')

      elFormRef.value?.validate( async (valid) => {
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
           }
       })
}

// 返回按钮
const back = () => {
    router.go(-1)
}

</script>

<style lang="scss">

.header-img-box {
  width: 80px;
  height: 80px;
  border: 1px dashed #ccc;
  border-radius: 20px;
  text-align: center;
  line-height: 80px;
  cursor: pointer;
  }
</style>