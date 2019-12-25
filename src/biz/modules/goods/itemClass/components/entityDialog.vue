<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="960"
        :show-ft="showFt"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="80px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="分类编码" prop="code">
                                <el-input v-model="dto.code"
                                    :disabled="isDisabled('code')"
                                    >
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="分类名称" prop="name">
                                <el-input v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="分类级别" prop="level">
                                <el-input disabled v-model="dto.level"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="简码" prop="simpleCode">
                                <el-input  oninput = "value=value.replace(/[^\d]/g,'')" maxlength="2" v-model="dto.simpleCode"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="描述" prop="remark">
                                <el-input v-model="dto.remark"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <div slot="ft" class="basic-dialog-ft" v-if="showFt">
            <el-button size="small" type="primary" v-if="action=='add'" @click="handleOk(action,1)" :loading="saving">保存并继续</el-button>
            <el-button size="small" type="primary" @click="handleOk(action,2)" :loading="saving">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </div>
    </basic-dialog>
</template>

<script>
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import EntityDialog from 'biz/mixins/entityDialog'
export default {
    components: {
        GoodsSelDlg
    },
    mixins: [ EntityDialog ],
    props: {
        saving: Boolean,
        confirm: Function,
        YES_FLAG:Object,
        ATTR_FORMAT:Object,
        level:Number,
        levelId:String
    },
    data () {
        return {
            goodsSelDlgVis: false,
            rules: {
                code: [
                    { required: true, message: '请输入物料编号', trigger: 'change' }
                ],
                name: [
                    {  required: true, message: '请输入批次属性',trigger: 'change' }
                ],
                level: [
                    {  required: true, message: '请输入分类级别',trigger: 'change' }
                ],
                simpleCode: [
                    {  required: true, message: '请输入简码',trigger: 'change' }
                ],
            },
            tableData: [
                
            ]
        }
    },
    beforeCreate () {
        this.allFields = [ 'id', 'code', 'name', 'remark','simpleCode'
        ]
        this.disFields = [ 'code' ]
    },
    mounted(){
    },
    watch:{
        'visible'(val){
            if(val&&this.level&&this.action=='add'){
               this.dto.level = this.level  
            }
           
        }
    },
    methods: {
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        validateBarcode (rule, value, callback) {
            const action = this.action
            if (!value) {
                return callback(new Error('请输入物料条码'))
            }
            if (value.indexOf('，') !== -1) {
                return callback(new Error('请使用英文逗号分隔'))
            }
            if (action === 'add') {
                const count = value.split(',').length
                if (count > 20) {
                    return callback(new Error('新增时最多输入20个条码'))
                }
            } else {
                if (value.indexOf(',') !== -1) {
                    return callback(new Error('编辑时只能输入一个条码'))
                }
            }
            callback()
        },
        handleEnterKeyUp () {
            this.updateGoodsSelDlgVis(true)
        },
        handleSelectGoods (row) {
            Object.assign(this.dto, {
                ..._.pick(row, [ 'code', 'name', 'shortName', 'skuNo1', 'brandName', 'spec' ]),
                skuId: row.id
            })
        },
        handleCodeBlur () {
            if (this.dto.code && this.dto.code !== this.actGoods.code) {
                api.sku.queryDetlByCode({ skuCode: this.dto.code }).then(({ head, body }) => {
                    if (head.code === '200') {
                        Object.assign(this.dto, {
                            ..._.pick(body, ['code', 'name', 'shortName', 'skuNo1', 'brandName', 'spec' ]),
                            skuId: body.id
                        })
                    }
                })
            }
        },
        doSave () {
            const params = _.pick(this.dto, ['id', 'skuId', 'barcode'])
            this.handleSave(params, () => {
                this.handleClose()
                this.queryList()
            }, this.action)
        },
        async handleOk (act,num) {
            debugger
            var params ={}
            const valid = await this.$refs.form.validate().catch(() => {})
            if (!valid) {
                return
            }
            if(this.levelId){
                params={
                    "parentId":this.levelId,
                    "code":this.dto.code,
                    "name":this.dto.name,
                    "remark":this.dto.remark,
                    "simpleCode":this.dto.simpleCode
                }
            }else{
                params={
                    "code":this.dto.code,
                    "name":this.dto.name,
                    "remark":this.dto.remark,
                    "simpleCode":this.dto.simpleCode
                }
            }
            if(act =='add'){
                debugger
                if(this.levelId){
                    api.goods.addNextItemClassList(params).then(({head,body})=>{
                        if(head.code == '200'){
                            this.$message.success(head.subMessage)
                            if(num==2){
                                this.handleClose()
                                this.queryList()
                            }
                        }else{
                            this.$message.error(head.subMessage)
                        }
                    })
                }else{
                    api.sku.addItemClass(params).then(({head,body})=>{
                    if(head.code == '200'){
                        this.$message.success(head.subMessage)
                        if(num==2){
                            this.handleClose()
                            this.queryList()
                        }
                    }else{
                        this.$message.error(head.subMessage)
                    }
                })
                }
                
            }
            if(act =='edit'){
                 api.sku.eidtItemClass({
                     'id':this.dto.id,
                    "code":this.dto.code,
                    "name":this.dto.name,
                    "remark":this.dto.remark,
                    "simpleCode":this.dto.simpleCode||''
                }).then(({head,body})=>{
                    if(head.code == '200'){
                        this.$message.success(head.subMessage)
                        this.handleClose()
                        this.queryList()
                    }else{
                        this.$message.error(head.subMessage)
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-icon-more {
        cursor: pointer;
    }
}
</style>



