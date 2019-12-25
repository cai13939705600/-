<template>
    <basic-dialog
        :visible="visible"
        :title="'重力货架盘点'"
        :width="490"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            class="myForm"
            ref="form"
            size="small"
            label-position="right"
            label-width="80px"
            :model="dto"
            @submit.native.prevent>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item
                                label="仓库"
                                prop="warehouseId"
                                :rules="[{ required: true, message: '请选择仓库' }]"
                            >
                                <el-select
                                    clearable
                                    v-model="dto.warehouseId"
                                    placeholder="">
                                    <el-option
                                        v-for="item in wareHouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                            label="库区"
                            prop="zoneId"
                            :rules="[{ required: true, message: '请选择库区' }]"
                        >
                            <el-select
                                clearable
                                v-model="dto.zoneId"
                                placeholder="">
                                <el-option
                                    v-for="item in zoneList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                    </el-form-item>
                        </el-col>
                    </el-row>
            </el-form>
    </basic-dialog>
</template>
<script>
import EntityDialog from 'biz/mixins/entityDialog'
export default {
    components: {
        
    },
    mixins: [ EntityDialog ],
    props: {
        nCount: Function
    },
    data () {
        return {
            wareHouseList: [],
            zoneList:[],
            dto:{
                warehouseId:'',
                zoneId:''
            }
        }
    },
    watch: {
        'dto.warehouseId'(val){
           if(val){
               this.dto.zoneId=''
               this.queryZoneList(val)
           }else{
               this.dto.zoneId=''
               this.zoneList=[]
           }
              
       },
    },
    beforeCreate () {
        
        
    },
    created(){
        this.queryCurrentUserWarehouse()
        this.queryZoneList()
    },
    methods: {
        //查询当前用户绑定的仓库
       queryCurrentUserWarehouse(){
           api.stock.getWareHouseList({page: {current: 1, size: 1000}}).then(({head,body})=>{
               if(head.code==200){
                   this.wareHouseList = body
               }
           })
       },
       //查询库区
       queryZoneList(a){
           if(a){
               var  param = {warehouseId:a,page: {current: 1, size: 1000}}
           }else{
               var  param = {page: {current: 1, size: 1000}}
           }
           api.library.queryLibraryAreas(param).then(({head,body})=>{
               if(head.code==200){
                   this.zoneList = body.records
               }
           })
       },
       handleOk(){
           
           if (!this.$refs.form) {
                return
            }
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                this.nCount(this.dto)
            })
       }
    }
}
</script>

<style lang="scss" scoped>


</style>



