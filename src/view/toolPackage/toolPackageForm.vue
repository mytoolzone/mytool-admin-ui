<template>
  <div>
    <div class="gva-form-box">
      <el-form
        ref="elFormRef"
        :model="formData"
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

        <el-form-item v-if="editor" prop="uiData">
          <slot name="form-item">
            <div>功能详情 &nbsp;(工具详细介绍)--</div>
          </slot>

          <div class="el-textarea__inner">
            <button :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
              加粗
            </button>
            <button :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
              斜体
            </button>
            <button :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
              删除线
            </button>
            <button :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" @click="editor.chain().focus().toggleCode().run()">
              代码
            </button>
            <button @click="editor.chain().focus().unsetAllMarks().run()">
              clear marks
            </button>
            <button @click="editor.chain().focus().clearNodes().run()">
              clear nodes
            </button>
            <button :class="{ 'is-active': editor.isActive('paragraph') }" @click="editor.chain().focus().setParagraph().run()">
              paragraph
            </button>
            <button :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
              h1
            </button>
            <button :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
              h2
            </button>
            <button :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
              bullet list
            </button>
            <button :class="{ 'is-active': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">
              ordered list
            </button>
            <button :class="{ 'is-active': editor.isActive('codeBlock') }" @click="editor.chain().focus().toggleCodeBlock().run()">
              代码快
            </button>
            <button :class="{ 'is-active': editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()">
              blockquote
            </button>
            <button @click="editor.chain().focus().setHorizontalRule().run()">
              水平线
            </button>
            <button @click="openHeaderChange">
              图片
            </button>

            <button @click="editor.chain().focus().setHardBreak().run()">
              hard break
            </button>
            <button :disabled="!editor.can().chain().focus().undo().run()" @click="editor.chain().focus().undo().run()">
              undo
            </button>
            <button :disabled="!editor.can().chain().focus().redo().run()" @click="editor.chain().focus().redo().run()">
              redo
            </button>
            <editor-content :editor="editor" class="ProseMirror" />
          </div>
        </el-form-item>

        <el-form-item v-show="tool.attr == 'iframe' || tool.attr == 'innnerComponent' " prop="uiData">
          <slot name="form-item">
            功能表单 -- &nbsp;
            <el-link
              type="success"
              href="http://tools.mytool.zone/form-generator/index.html#/"
              target="blank"
            >创建表单<i class="el-icon-view el-icon--right" />
            </el-link>
            <el-button size="small" @click="preview('uiData', formData.uiData)">
              查看效果</el-button>
          </slot>
          <el-input
            v-model="formData.uiData"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 21 }"
            :clearable="true"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item v-show="tool.attr == 'iframe'" prop="config">
          <slot name="form-item">
            配置表单 -- &nbsp;
            <el-link
              type="success"
              href="http://tools.mytool.zone/form-generator/index.html#/"
              target="blank"
            >创建表单<i class="el-icon-view el-icon--right" />
            </el-link>
            <el-button size="small" @click="preview('config', formData.config)">
              查看效果</el-button>
          </slot>
          <el-input
            v-model="formData.config"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 21 }"
            :clearable="true"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="back">返回{{ toolType }}</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        v-model="previewDialogVisible"
        title="提示"
        width="80%"
        :before-close="handleClose"
      >
        <fc-designer ref="designer" />
        <div slot="footer">
          <el-button @click="previewDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="getFormDesignerJson">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
  <choose-img ref="chooseImg" @enterImg="insertImgToEditor" />
</template>

<script>
export default {
  name: 'ToolPackage',
}
</script>

<script setup>
import {
  createToolPackage,
  updateToolPackage,
  findToolPackage,
} from '@/api/toolPackage'

// 自动获取字典
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { getCurrentInstance } from '@vue/runtime-core'
import { toRefs } from 'vue'

import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import ChooseImg from '@/components/chooseImg/index.vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '' +
    '<h2>功能亮点</h2>' +
    '<p> 功能1: xxxx</p>' +
    '<img src="https://tools.mytool.zone/logo.png"/>' +
    '<h2>学习资料</h2>' +
    '<p>快速学习sd: https://zhuanlan.zhihu.com </p>' +
    '<h2>视频教程</h2>' +
    '<p>手把手学习sd: https://www.bilibili.com</p>',
  extensions: [
    StarterKit,
    Document,
    Paragraph,
    Text,
    Image,
    Dropcursor,
  ],
})

const route = useRoute()
const router = useRouter()

const type = ref('')
const formData = ref({
  toolId: 0,
  name: '',
  uiData: '[]',
  config: '[]',
  apiUrl: '',
  packageUrl: '',
  binaryUrl: '',
})
// 验证规则
const rule = reactive({})

const elFormRef = ref()
const previewDialogVisible = ref(false)
const previewDialogContent = ref(null)
const previewPosition = ref('')

const currentInstance = getCurrentInstance()
const designer = ref(null)

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}

const props = defineProps({
  tool: { attr: 'external' }
})

const { tool } = toRefs(props)

// 初始化方法
const init = async() => {
  // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
  if (route.query.id) {
    formData.value.toolId = parseInt(route.query.id)
    const res = await findToolPackage({ ID: route.query.id })
    if (res.code === 0) {
      formData.value = res.data.retoolPackage
      type.value = 'update'
    }

    if (formData.value.readme) {
      editor.value.commands.setContent(formData.value.readme)
    }
  } else {
    type.value = 'create'
  }
}

init()
// 保存按钮
const save = async() => {
  elFormRef.value?.validate(async(valid) => {
    if (!valid) return

    formData.value.readme = editor.value?.getHTML()

    let res
    switch (type.value) {
      case 'create':
        res = await createToolPackage(formData.value)
        type.value = 'update'
        break
      case 'update':
        res = await updateToolPackage(formData.value)
        break
      default:
        res = await createToolPackage(formData.value)
        break
    }
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '创建/更改成功',
      })
    }
  })
}

// 返回按钮
const back = () => {
  router.go(-1)
}

// prewview
const preview = (position, data) => {
  previewDialogContent.value = JSON.parse(data)
  console.log('previewDialogContent.value', previewDialogContent.value)
  previewDialogVisible.value = true
  previewPosition.value = position
  const FcDesignerRule1Demo = '[{"type":"input","field":"cuk5qqdw3umc","title":"输入框","info":"","_fc_drag_tag":"input","hidden":false,"display":true}]'
  // element-UI 组件 dialog 中 ref 获取不到 dom 的问题解决方案setTimeout
  setTimeout(() => {
    currentInstance.refs.designer.setRule(previewDialogContent.value)
  }, 100)
}
const getFormDesignerJson = (data) => {
  console.log('sumbitForm1提交数据：', data)
  const json = currentInstance.refs.designer.getJson()
  // alert(json)
  switch (previewPosition.value) {
    case 'uiData':
      formData.value.uiData = json
      break
    case 'config':
      formData.value.config = json
      break
  }
  previewDialogVisible.value = false
}
// insertImgToEditor
const insertImgToEditor = (imgUrl) => {
  console.log('imgUrl', imgUrl)
  editor.value.chain().focus().setImage({ src: imgUrl }).run()
}
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  min-height: 200px;
  padding: 8px;
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
</style>
