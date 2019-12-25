<template>
    <basic-search :label-width="100" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="名称">
            <el-input clearable v-model="query.name"/>
        </el-form-item>
        <el-form-item label="联系人">
            <el-input clearable v-model="query.contact"/>
        </el-form-item>
        <el-form-item label="所属货主" prop="storerId"
            label-width="102px">
            <el-input :readonly="true" @focus="shipperSelDlgVis = true" v-model="query.storerName"></el-input>
            <el-input v-show="false" v-model="query.storerId"></el-input>
        </el-form-item>
        <el-form-item label="状态">
            <el-select clearable filterable v-model="query.validFlag">
                <el-option v-for="(item, key) of startStop" :key="key" :label="item" :value="+key"/>
            </el-select>
        </el-form-item>
        <shipper-sel-dlg
            :visible="shipperSelDlgVis"
            :handle-save="chooseShipper"
            :update-vis="updateShipperSelDlgVis"/>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import ShipperSelDlg from 'biz/components/shipperSelDlg'
export default {
    mixins: [ ExactSearch ],
    props: {
        startStop: Object
    },
    components: {
        ShipperSelDlg
    },
    data(){
        return{
            //货主弹窗是否显示
            shipperSelDlgVis: false,
        }
    },
    beforeCreate () {
        this.fields = [ 'name', 'contact', 'storerId', 'storerName', 'validFlag']
    },
    methods: {
        // 货主弹框隐藏方法
        updateShipperSelDlgVis (vis) {
            this.shipperSelDlgVis = vis
        },
        // 选择货主返回
        chooseShipper (data) {
            this.query.storerId = data.id
            this.query.storerName = data.name
        }
    }
}
</script>
