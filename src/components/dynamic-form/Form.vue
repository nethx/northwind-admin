<template>
  <el-form :model="value" v-bind="formConfig" style="overflow-x: hidden;" class="demo-ruleForm" size="small">
    <fieldset style="border: 1px solid #d8dce5;" v-for="(form,formIndex) in formConfig" :key="formIndex">
      <legend>{{form.groupTitle}}</legend>
      <template v-if="form.groupTitle==='房产信息'">
        <el-card v-for="(house,houseIndex) in value.houses" :key="houseIndex" class="box-card">
          <div slot="header" class="clearfix">
            <span>第{{houseIndex+1}}套房产</span>
            <el-button type="danger" style="float: right; padding: 3px 8px;margin-left: 10px;" @click="deleHouse(houseIndex)" :class="{'hide':houseIndex===0 }">删除房产</el-button>
            <el-button type="primary" style="float: right; padding: 3px 8px" @click="addHouse(houseIndex)" :class="{'hide':houseIndex+1!== value.houses.length}">添加房产</el-button>
          </div>
          <el-col v-for="(field,fieldIndex) in form.formItemList" :key="fieldIndex" :class="{'hide':field.hidder}" :span="field.rowValue?field.rowValue:8">
            <el-form-item :label-width="form.labelWidth" :rules="field.rules" :label="field.label" :prop="'houses.' + houseIndex +'.'+ field.key">
              <template v-for="item in field.inputs">
                <dynamic-form-item v-if="item.type=='cascader' || item.type=='date'" :key="item.key" :item="item" v-bind="item" v-model="value.houses[houseIndex][item.key]"></dynamic-form-item>
                <dynamic-form-item v-else :key="item.key" :item="item" v-bind="item" v-model.trim="value.houses[houseIndex][item.key]" :value="value.houses[houseIndex][item.key]"></dynamic-form-item>
              </template>
            </el-form-item>
          </el-col>
          <el-card class="box-card" v-for="(houseObligee,obligeeIndex) in house.houseObligeeArray" :key="'oblige'+obligeeIndex">
            <el-col v-for="(field,fieldIndex) in form.formItemList1" :key="fieldIndex" :class="{'hide':field.hidder}" :span="field.rowValue?field.rowValue:8">
              <el-form-item :label-width="form.labelWidth" :rules="field.rules" :label="field.label" :prop="'houses.' + houseIndex +'.houseObligeeArray.'+obligeeIndex+'.'+ field.key">
                <template v-for="item in field.inputs">
                  <dynamic-form-item :key="item.key" :item="item" v-bind="item" v-model="value.houses[houseIndex].houseObligeeArray[obligeeIndex][item.key]" :value="value.houses[houseIndex].houseObligeeArray[obligeeIndex][item.key]"></dynamic-form-item>
                </template>
              </el-form-item>
            </el-col>
          </el-card>
        </el-card>
      </template>
      <el-col v-else v-for="(field,fieldIndex) in form.formItemList" :key="fieldIndex" :class="{'hide':field.hidder}" :span="field.rowValue?field.rowValue:8">
        <el-form-item :label-width="form.labelWidth" :rules="field.rules" :label="field.label" :prop="field.domain?field.domain+'.'+field.key :field.key">
          <template v-for="item in field.inputs">
            <dynamic-form-item v-if="field.domain" :key="item.key" :item="item" v-bind="item" v-model="value[field.domain][item.key]" :value="value[field.domain][item.key]"></dynamic-form-item>
            <dynamic-form-item v-else :key="item.key" :item="item" v-bind="item" v-model="value[item.key]" :value="value[item.key]"></dynamic-form-item>
          </template>
        </el-form-item>
      </el-col>
    </fieldset>
  </el-form>
</template>

<script>
// import house from '@/components/dynamic-form/House'
import { Message } from 'element-ui'
import dynamicFormItem from '@/components/dynamic-form/item'
export default {
  components: {
    dynamicFormItem
    // house
  },
  props: {
    formConfig: {
      type: Array,
      required: true
    },
    houses: {
      type: Array
    },
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    addHouse(index) {
      let isAdd = false
      for (const key in this.value.houses[index]) {
        if (this.value.houses[index][key]) {
          isAdd = true
        }
      }
      if (isAdd) {
        this.value.houses.push({ houseObligeeArray: [{}] })
      } else {
        Message.error('请您录入现有房产信息才能添加新房产')
      }
    },
    deleHouse(index) {
      this.value.houses.splice(index, 1)
    }
  }
}
</script>
<style scoped>
  .hide {
    display: none;
  }
</style>
