<template>
  <el-input v-if="item.type==='input' " v-bind="$attrs" :type="item.subtype" v-on="$listeners" :clearable="true" :style="{'width':item.width?item.width:'100%'}">
    <template v-if="item.prepend" slot="prepend">{{ item.prepend }}</template>
    <template v-if="item.append" slot="append">{{ item.append }}</template>
  </el-input>
  <el-select v-else-if="item.type==='select' " v-bind="$attrs" v-on="$listeners" :clearable="true">
    <el-option v-for="(o,index) in (item.options||ajaxOptions)" :key="index" :label="o.itemLabel" :value="o.itemValue" :disabled="o.disabled"></el-option>
  </el-select>
  <el-cascader v-else-if="item.type==='cascader' " v-bind="$attrs" v-on="$listeners" :options="item.options||ajaxOptions" :clearable="true" :style="{'width':item.width?item.width:'100%'}"></el-cascader>
  <el-date-picker
    v-else-if="item.type==='date' "
    :style="{'width':item.width?item.width:'100%'}"
    :editable="false"
    :type="item.subtype"
    :format="item.viewFormat||item.valueFormat"
    v-bind="$attrs"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    v-on="$listeners"
    :clearable="true"
  ></el-date-picker>
  <el-time-picker v-else-if="item.type==='time'" :format="item.valueFormat" v-bind="$attrs" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" v-on="$listeners"></el-time-picker>
  <el-checkbox v-else-if="item.type==='switch' && item.appearance==='checkbox'" v-bind="$attrs" v-on="$listeners"></el-checkbox>
  <el-switch v-else-if="item.type==='switch'" v-bind="$attrs" v-on="$listeners"></el-switch>
  <el-rate v-else-if="item.type==='rate'" v-bind="$attrs" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" text-color="#ff9900" v-on="$listeners"></el-rate>
  <el-color-picker v-else-if="item.type==='color'" v-bind="$attrs" :color-format="item.format" v-on="$listeners"></el-color-picker>
  <el-slider v-else-if="item.type==='slider'" v-bind="$attrs" :range="item.isRange" v-on="$listeners"></el-slider>
  <el-radio-group v-else-if="item.type==='radio'" v-bind="$attrs" v-on="$listeners">
    <component v-for="o in item.options||ajaxOptions" :is="item.button?'el-radio-button':'el-radio'" :key="o.value" :label="o.value" :disabled="o.disabled" :border="item.border">{{ o.label }}</component>
  </el-radio-group>
  <el-checkbox-group v-else-if="item.type==='checkbox'" v-bind="$attrs" v-on="$listeners">
    <component v-for="o in item.options||ajaxOptions" :is="item.button?'el-checkbox-button':'el-checkbox'" :key="o.value" :disabled="o.disabled" :label="o.value" :border="item.border">{{ o.label }}</component>
  </el-checkbox-group>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      ajaxOptions: []
    }
  }
}
</script>