<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="1060"
        :show-ft="showFt"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="100px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="供应商编号" prop="code" :rules="itemRule">
                                <el-input v-model="dto.code" :disabled="isDisabled('code')||SUPPLIER_CODE_RULE==2" ref="code"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="供应商名称" prop="name">
                                <el-input v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人" prop="leader">
                                <el-input v-model="dto.leader"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="联系电话" prop="tel">
                                <el-input v-model.number="dto.tel"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系地址" prop="dist">
                                <dist-picker :level="4" v-model="dto.dist"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="详细地址" prop="address">
                                <el-input v-model="dto.address"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button class="ml-20" size="small" type="primary" @click="onSaveAndGoOn" v-if="this.action === 'add'">保存并继续</el-button>
            <el-button class="ml-20" size="small" type="primary" @click="onSave">保存</el-button>
            <el-button class="ml-20" size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import DistPicker from 'biz/components/distPicker'
import EntityDialog from 'biz/mixins/entityDialog'
import saveGoOn from 'biz/mixins/saveGoOn'
export default {
    components: {
        DistPicker
    },
    mixins: [ EntityDialog , saveGoOn],
    data () {
        return {
            rules: {
                // code: [
                //     { required: true, message: '请输入供应商编号', trigger: 'blur' }
                // ],
                name: [
                    { required: true, message: '请输入供应商名称', trigger: 'blur' }
                ],
                tel: [
                    { required: false } ,{ pattern: CNST.REG_EXP.TEL_MOBILE, message: '手机号必须为数字' }
                ],
                address: [
                    { pattern: /^.{1,100}$/, message: '最多输入100个字符', trigger: 'blur' }
                ],
            },
            SUPPLIER_CODE_RULE: 1,
            itemRule:[
                { required: true, message: '请输入供应商编码' }
            ]
        }
    },
    watch:{
       visible: function (n) {
           if (n) {
                this.queryItemYn()
           }
        },
    },
    beforeCreate () {
        this.allFields = [ 'vendId', 'code', 'name', 'leader', 'tel', 'dist', 'address' ]
        this.disFields = [ 'code' ]
    },
    methods: {
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
            if (res.provinceName && res.cityName && res.townName && res.streetName) {
                res.dist = [ res.provinceName, res.cityName, res.townName, res.streetName ]
            }
            const delFields = [ 'provinceName', 'cityName', 'townName', 'streetName' ]
            delFields.forEach(item => {
                delete res[item]
            })
            if (res.tel) {
                res.tel = Number( res.tel )
            }
            return res
        },
        queryItemYn(){
            api.base.getParameters({
                    code:'SUPPLIER_CODE_RULE'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        if(body.parameterValue==2){
                            this.SUPPLIER_CODE_RULE = 2
                            this.itemRule = []
                        }else{
                            this.SUPPLIER_CODE_RULE = 1
                            this.itemRule = [
                                { required: true, message: '请输入供应商编码' }
                            ]
                        }
                    }
                })
        },
        toEnd () {
            const res = _.pick(this.dto, this.allFields)
            if (!_.isEmpty(res.dist)) {
                res.provinceName = res.dist[0]
                res.cityName = res.dist[1]
                res.townName = res.dist[2]
                res.streetName = res.dist[3]
            }
            /* if (res.name) {
                res.abbreviation = res.name
            } */
            const delFields = ['dist']
            delFields.forEach(item => {
                delete res[item]
            })
            return res
        },
        onSave () {
            this.handleOk()
        },
        onSaveAndGoOn () {
            this.saveAndGoOn(() => {})
            this.$refs.code.focus()
        }
    }
}
</script>




