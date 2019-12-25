<template>
    <basic-search :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="物料编号">
            <el-input clearable v-model="query.code" />
        </el-form-item>
        <el-form-item label="物料名称">
            <el-input clearable v-model="query.name" />
        </el-form-item>
        <el-form-item label="规格">
            <el-input clearable  v-model="query.spec" />
        </el-form-item>
        <el-form-item label="状态">
            <el-select filterable v-model="query.validFlag" placeholder="">
                <el-option v-for="(item, key) of startStop" :key="key" :value="+key" :label="item"/>
            </el-select>
        </el-form-item>
        <el-form-item label="货主">
            <el-select
                v-model="query.storerId"
                clearable
                placeholder=""
                >
                <el-option
                    v-for="item in OwnerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="供应商" >
            <el-input clearable  v-model="query.supplierName"/>
        </el-form-item>
        <el-form-item
            label="是否rfid"
            >
            <el-select
                clearable
                v-model="query.rfidFlag"
                placeholder=""
                >
                <el-option :value="1" label="是"/>
                <el-option :value="0" label="否"/>
            </el-select>
        </el-form-item>
        <el-form-item
            label="是否Bom"
            >
            <el-select
                clearable
                v-model="query.bomFlag"
                placeholder=""
                >
                <el-option :value="1" label="是"/>
                <el-option :value="0" label="否"/>
            </el-select>
        </el-form-item>
        <el-form-item label="物料条码">
            <el-input clearable v-model="query.barcode" />
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
export default {
    mixins: [ ExactSearch ],
    data () {
        return {
            startStop: CNST.ENUMS.startStop,
            OwnerList:[]
        }
    },
    beforeCreate () {
        this.fields = [ 'code', 'name', 'spec', 'barcode', 'validFlag', 'storerId', 'rfidFlag', 'bomFlag' ]
    },
    created(){
        this.getOwnerList()
    },
    methods:{
        getOwnerList(){
             api.role.getStorerList({page: {
                    current: 1,
                    size: 10000
                }}).then(({ head = {}, body = [] })=>{  
                if(head.code==200){
                    this.OwnerList = body
                }
          }).catch((error)=>{  
            console.log(error);  
          });  
        },
    }
}
</script>

