<template>
  <basic-search
    ref="basicSearch"
    class="warehouse-search"
    :query="query"
    :handle-search="onSearch"
    :handle-reset="handleReset"
  >
    <el-form-item label="出库通知单号" label-width="102px">
      <el-input v-model="query.doCode" :value="query.doCode" placeholder="多条以英文逗号,分隔"></el-input>
    </el-form-item>
    <el-form-item label="业务单号" label-width="102px">
      <el-input v-model="query.billCode1" :value="query.billCode1" placeholder="多条以英文逗号,分隔"></el-input>
    </el-form-item>
    <el-form-item label="作业状态" label-width="102px">
      <el-select clearable v-model="query.status" multiple collapse-tags placeholder="请选择">
        <el-option
          v-for="item in PICK_STATE"
          :key="item.enumCode"
          :label="item.enumValueCn"
          :value="item.enumCode"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      class="w50p"
      label="创建时间"
      label-width="102px"
      prop="createTime"
      ref="createTime"
    >
      <el-date-picker
        v-model="query.createTime"
        type="datetimerange"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
    </el-form-item>
  </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import commaInput from 'biz/components/commaInput'
import CarrierSelect from 'biz/components/carrierSelect'
export default {
  mixins: [ExactSearch],
  components: {
    commaInput,
    CarrierSelect
  },
  props: {
    // 拣货单状态
    PICK_STATE: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      pickerOptions: {
          ...CNST.OPTIONS.pickerOptions
      }
    }
  },
  beforeCreate () {
    this.fields = [
      'doCode',
      'billCode1',
      'status',
      {
          key: 'createTime',
          default: [jt.date.getTodayZero(), jt.date.getTodayLast()]
      },
    ]
  },
  created () {
  },
  methods: {
    onClickProductCode (e) {
      // TODO 打开物料弹出框
      console.log(e);
    },
    onFocus () {
    },
    onSearch () {
      this.$refs.basicSearch.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.handleSearch(this.query)
      })
    }
  }
}
</script>
<style scoped>
</style>


