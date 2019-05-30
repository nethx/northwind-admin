<template>
  <div class="mainform" style="padding-bottom: 20px">
    <div style="border-bottom: 1px solid #ededed">
      <p style="margin: 10px 30px 10px">
        <span style="color:#f56c6c;margin: 0px 10px 0px">表单测试</span>
      </p>
    </div>
    <dynamic-form v-if="formConfig" :form-config="formConfig" v-model="formValue" ref="formValue"></dynamic-form>
    <el-row style="margin-top: 10px;">
      <el-button size="small" type="primary" id="enteringSubmit" style="margin-left: 3%;width: 98px" @click="onSubmit" class="btn">保存</el-button>
      <el-button size="small" type="primary" style="margin-left: 3%;width: 98px" class="btn">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import dynamicForm from '@/components/dynamic-form/Form'
export default {
  components: {
    dynamicForm
  },
  data() {
    return {
      formConfig: require('../../static/formConfig.json'),
      formValue: {
        customer: {},
        houses: [{ houseObligeeArray: [{}] }]
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('formValue:' + JSON.stringify(this.formValue))
      this.$refs['formValue'].$children[0].validate((valid, fields) => {
        if (valid) {
        } else {
        }
      })
    }
  }
}
</script>

<style scoped>
  .mainform >>> .el-input-group__append {
    padding: 0 6px !important;
  }
  .mainform >>> .el-input-group__prepend {
    padding: 0 6px !important;
  }
  .mainform >>> .el-form-item__label {
    padding: 5px 0px !important;
  }
  .mainform >>> fieldset {
    margin: 0.7rem 1.5rem 0.5rem 1.5rem;
  }
</style>