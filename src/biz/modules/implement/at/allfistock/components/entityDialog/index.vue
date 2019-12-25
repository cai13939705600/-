<template>
    <basic-dialog
        :visible="visible"
        :title="titles"
        :width="960"
        :show-ft="showFt"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handStock">
        <el-form
            label-position="right"
            label-width="80px"
            ref="form"
            size="small"
            :model="dto"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">基础信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                     <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="物料名称">
                                <el-input v-model="dto.skuName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格型号">
                                <el-input v-model="dto.skuSpec" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="供应商">
                                <el-input v-model="dto.supplireName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="原项目">
                                <el-input v-model="dto.itemName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存数量">
                                <el-input v-model="dto.qty" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单价">
                                <el-input v-model="dto.qty" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="金额">
                                <el-input v-model="dto.totalPrice" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="entity-dlg__block" v-if="type ===0">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">调整至</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="项目名称">
                                <el-input v-model="dto.toItemName" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="调整数量">
                                <el-input v-model="dto.toQty" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="调整原因">
                                <el-input v-model="dto.reason" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </basic-dialog>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from '../../store'
import EntityDialog from 'biz/mixins/entityDialog'
import { pick } from 'common/utils/lodash'
import { mapState, mapActions } from 'vuex'
export default {
    components: {
        
    },
    mixins: [ EntityDialog ],
    props: {
        type: Number, // 0 移库 1 批次 2 库存调整
        titles:String
    },
    data () {
        return {

        }
    },
    beforeCreate () {
        this.allFields = [
            'skuName',
            'skuSpec',
            'supplireName',
            'itemName',
            'qty',
            'totalPrice',
            'toItemName',
            'toQty',
            'reason',
        ]
        
    },
    created (){
        
    },
    mounted (){

    },
    watch: {
        title(newVal){
            this.title =newVal
        },
        
    },
    methods: {
        //调整数量必须为数字
        checkValue(val){
            switch (val) {
                case 'batchNumber':
                    this.dto.batchNumber = this.dto.batchNumber.replace(/[^\d]/g,'')
                    break;
                case 'adNumber':
                    this.dto.adNumber = this.dto.adNumber.replace(/[^\d]/g,'')
                    if(this.dto.adNumber>this.dto.avaliableQty&&this.dto.adjustType=='20'){
                        this.dto.adNumber = this.dto.avaliableQty
                    }
                    break;
                case 'uomNumber':
                this.dto.uomNumber = this.dto.uomNumber.replace(/[^\d]/g,'')
                if(this.dto.uomNumber>this.dto.avaliableQty){
                    this.dto.uomNumber = this.dto.avaliableQty
                }
                break;
                default:
                    break;
            }
            
        },
        async handStock(){
            const valid = await this.$refs.form.validate().catch(() => {})
            if (!valid) {
                return
            }
            if(this.type == 0){
                
            }
        },
       
      
    }
}
</script>
