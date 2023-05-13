<template>
  <fc-designer ref="designer" />

   <form-create
      v-model="fapi"
      :rule="rule"
      :option="option"
      @submit="onSubmit"
  ></form-create>
</template>

<script>
import formCreate from "@form-create/element-ui";
import { getCurrentInstance, onMounted } from '@vue/runtime-core'

//FcDesigner 生成的`JSON`
const FcDesignerRule = '[{"type":"input","field":"cuk5qqdw3umc","title":"输入框","info":"","_fc_drag_tag":"input","hidden":false,"display":true}]';

//FcDesigner 生成的`options`
const FcDesignerOptions = '{"form":{"labelPosition":"right","size":"mini","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false}}';

onMounted(() => {
    const FcDesignerRule1 = '[{"type":"input","field":"cuk5qqdw3umc","title":"输入框","info":"","_fc_drag_tag":"input","hidden":false,"display":true}]';

    //FcDesigner 生成的`options`
    const FcDesignerOptions1 = '{"form":{"labelPosition":"right","size":"mini","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false}}';
    console.log('this.$refs.designer', currentInstance.refs.designer)
    currentInstance.refs.designer.setRule(formCreate.parseJson(FcDesignerRule1));
})

export default {
  data () {
    return {
      fapi: null,
      rule: formCreate.parseJson(FcDesignerRule),
      option: formCreate.parseJson(FcDesignerOptions)
    }
  },
  onMounted(){
    //FcDesigner 生成的`JSON`

    //console.log('this.$refs.designer', this.$refs.designer)
    // currentInstance.refs.designer.setOption(FcDesignerOption1);
  },
  methods: {
    onSubmit (formData) {
        console.log(formData)
            const FcDesignerRule1 = '[{"type":"input","field":"cuk5qqdw3umc","title":"输入框","info":"","_fc_drag_tag":"input","hidden":false,"display":true}]';
    const currentInstance = getCurrentInstance()
    //FcDesigner 生成的`options`
    const FcDesignerOptions1 = '{"form":{"labelPosition":"right","size":"mini","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false}}';
    console.log('this.$refs.designer', this.$refs)
    this.$refs.designer.setRule(FcDesignerRule1);
      //todo 提交表单
    }
  }
}
</script>