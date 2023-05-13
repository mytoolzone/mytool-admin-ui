<template>
  <div>
    <div class="gva-form-box">
      <el-form
        :model="formData"
        ref="elFormRef"
        label-position="top"
        :rules="rule"
        label-width="120px"
      >
        <el-form-item v-show="tool.attr!='innnerComponent'" :label="tool.attr=='external' ?'外链网址:':'接口地址:' " prop="apiUrl">
          <el-input
            v-model="formData.apiUrl"
            :clearable="true"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item prop="uiData" v-show="tool.attr == 'iframe' || tool.attr == 'innnerComponent'   ">
          <slot name="form-item">
            功能表单 -- &nbsp;
            <el-link
              type="success"
              href="http://tools.mytool.zone/form-generator/index.html#/"
              target="blank"
              >创建表单<i class="el-icon-view el-icon--right"></i>
            </el-link>
            <el-button size="small" @click="preview('uiData', formData.uiData)">
              查看效果</el-button
            >
          </slot>
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 21 }"
            v-model="formData.uiData"
            :clearable="true"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item prop="config" v-show="tool.attr == 'iframe'">
          <slot name="form-item">
            配置表单 -- &nbsp;
            <el-link
              type="success"
              href="http://tools.mytool.zone/form-generator/index.html#/"
              target="blank"
              >创建表单<i class="el-icon-view el-icon--right"></i>
            </el-link>
            <el-button size="small" @click="preview('config', formData.config)">
              查看效果</el-button
            >
          </slot>
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 21 }"
            v-model="formData.config"
            :clearable="true"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="back">返回{{toolType}}</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        title="提示"
         v-model="previewDialogVisible"
        width="80%"
        :before-close="handleClose"
      >
      <fc-designer ref="designer"/>
      <div slot="footer">
         <el-button @click="previewDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="getFormDesignerJson">确 定</el-button>
      </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolPackage",
};
</script>

<script setup>
import {
  createToolPackage,
  updateToolPackage,
  findToolPackage,
} from "@/api/toolPackage";

// 自动获取字典
import { getDictFunc } from "@/utils/format";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { getCurrentInstance, onMounted } from '@vue/runtime-core'
import { toRefs } from 'vue'

const route = useRoute();
const router = useRouter();

const type = ref("");
const formData = ref({
  toolId: 0,
  name: "",
  uiData: "[]",
  config: "[]",
  apiUrl: "",
  packageUrl: "",
  binaryUrl: "",
});
// 验证规则
const rule = reactive({});

const elFormRef = ref();
const previewDialogVisible = ref(false);
const previewDialogContent = ref(null);
const previewPosition = ref('')

const FcDesignerRule = '[{"type":"input","field":"cuk5qqdw3umc","title":"输入框","info":"","_fc_drag_tag":"input","hidden":false,"display":true}]';

const currentInstance = getCurrentInstance()
const designer = ref(null)


const props = defineProps({
    tool: {attr:'external'}
})

const {tool} = toRefs(props)

// 初始化方法
const init = async () => {
  // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
  if (route.query.id) {
    formData.value.toolId = parseInt(route.query.id) 
    const res = await findToolPackage({ ID: route.query.id });
    if (res.code === 0) {
      formData.value = res.data.retoolPackage;
      type.value = "update";
    }
  } else {
    type.value = "create";
  }
};

init();
// 保存按钮
const save = async () => {
  elFormRef.value?.validate(async (valid) => {
    if (!valid) return;
    let res;
    switch (type.value) {
      case "create":
        res = await createToolPackage(formData.value);
        type.value = "update";
        break;
      case "update":
        res = await updateToolPackage(formData.value);
        break;
      default:
        res = await createToolPackage(formData.value);
        break;
    }
    if (res.code === 0) {
      ElMessage({
        type: "success",
        message: "创建/更改成功",
      });
    }
  });
};

// 返回按钮
const back = () => {
  router.go(-1);
};

// // prewview
const preview = (position ,data) => {
   previewDialogContent.value = JSON.parse(data)
   console.log('previewDialogContent.value',previewDialogContent.value)
   previewDialogVisible.value = true
   previewPosition.value = position
   const FcDesignerRule1Demo = '[{"type":"input","field":"cuk5qqdw3umc","title":"输入框","info":"","_fc_drag_tag":"input","hidden":false,"display":true}]';
   // element-UI 组件 dialog 中 ref 获取不到 dom 的问题解决方案setTimeout
    setTimeout(()=>{ 
      currentInstance.refs.designer.setRule(previewDialogContent.value)
    },100)
}

const getFormDesignerJson = (data) => {
  console.log('sumbitForm1提交数据：', data)
  const json = currentInstance.refs.designer.getJson()
  // alert(json)
  switch(previewPosition.value) {
    case 'uiData':
      formData.value.uiData = json
      break;
    case 'config':
      formData.value.config = json
      break;
  }
  previewDialogVisible.value = false
}

</script>

<style>
</style>
