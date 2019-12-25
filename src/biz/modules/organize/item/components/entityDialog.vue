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
            label-width="100px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="项目编号" prop="code">
                                <el-input  v-model="dto.code" :disabled="this.action==='edit'" ref="code"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目名称" prop="name">
                                <el-input clearable v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="地市(局)项目编号/名称" prop="cityProjectName" label-width="135px">
                                <el-input clearable v-model="dto.cityProjectName"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="项目类型" prop="type">
                                <el-select clearable filterable v-model="dto.type">
                                    <el-option v-for="item in PROJECT_TYPE"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目类别">
                                <el-select clearable filterable v-model="dto.category">
                                    <el-option v-for="item in PROJECT_CATEGORY"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目物资用途" label-width="135px">
                                <el-select clearable filterable v-model="dto.materialUsage">
                                    <el-option v-for="item in MATERIAL_USAGE"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="项目小类">
                                <el-select clearable filterable v-model="dto.smallType">
                                    <el-option v-for="item in SMALL_TYPE"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电压等级">
                                <el-select clearable filterable v-model="dto.voltageClasses">
                                    <el-option v-for="item in VOLTAGE_CLASSES"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="工程项目分类" label-width="135px">
                                <!-- <el-select clearable filterable v-model="dto.projectClassification">
                                    <el-option v-for="item in PROJECT_TYPE"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode"/>
                                </el-select> -->
                                <el-input clearable v-model="dto.projectClassification"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="申请单位" prop="applyCompany">
                                <el-select
                                    filterable clearable v-model="dto.applyCompany">
                                    <el-option
                                        v-for="item in APPLY_COMPANY"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="计划开工日期" prop="planStartDate">
                                <el-date-picker
                                    v-model="dto.planStartDate"
                                    type="date"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="计划完工日期" prop="planFinishDate" label-width="135px">
                                <el-date-picker
                                    v-model="dto.planFinishDate"
                                    type="date"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="是否抢修项目" prop="isRushRapair">
                                <el-select
                                    filterable clearable v-model="dto.isRushRapair">
                                    <el-option
                                        v-for="item in YES_FLAG"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否虚拟项目" prop="isVirtualRapair">
                                <el-select
                                    filterable clearable v-model="dto.isVirtualRapair">
                                    <el-option
                                        v-for="item in YES_FLAG"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="预算科目编码" prop="budgetAccountCode" label-width="135px">
                                <el-input  v-model="dto.budgetAccountCode"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="工程管理部门" prop="engineeringManageDept">
                                <el-input  v-model="dto.engineeringManageDept"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="建设单位" prop="constructCompany">
                                <el-select
                                    filterable clearable v-model="dto.constructCompany">
                                    <el-option
                                        v-for="item in APPLY_COMPANY"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目负责人" prop="projectPrincipal" label-width="135px">
                            <el-input  v-model="dto.projectPrincipal"/>
                        </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="项目负责单位" prop="projectCompany">
                                <el-input clearable v-model="dto.projectCompany"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人" prop="projectContacts">
                                <el-input clearable v-model="dto.projectContacts"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系方式" prop="projectContactWay" label-width="135px">
                                <el-input clearable v-model="dto.projectContactWay"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="建设性质" prop="constructionNature">
                                <el-select
                                    filterable clearable v-model="dto.constructionNature">
                                    <el-option
                                        v-for="item in CONSTRUCTION_NATURE"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="资金来源" prop="moneySource">
                                <el-select
                                    filterable clearable v-model="dto.moneySource">
                                    <el-option
                                        v-for="item in MONEY_SOURCE"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物资账" prop="suppliesAccount" label-width="135px">
                                <el-select
                                    filterable clearable v-model="dto.suppliesAccount">
                                    <el-option
                                        v-for="item in SUPPLIES_ACCOUNT"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="项目总额(万元)" prop="quantity">
                                <el-input  v-model="dto.quantity"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="实施单位" prop="implementationCompany">
                                <el-input clearable v-model="dto.implementationCompany"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="16">
                            <el-form-item label="内容" prop="content">
                                <el-input clearable v-model="dto.content"/>
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
import EntityDialog from 'biz/mixins/entityDialog'
import saveGoOn from 'biz/mixins/saveGoOn'
export default {
    mixins: [ EntityDialog ,saveGoOn],
    props: {
        //是否
        YES_FLAG: {
            type: Array,
            default: () => ([])
        },
        //项目类型
        PROJECT_TYPE: {
            type: Array,
            default: () => ([])
        },
        //项目类别
        PROJECT_CATEGORY: {
            type: Array,
            default: () => ([])
        },
        //项目物资用途
        MATERIAL_USAGE: {
            type: Array,
            default: () => ([])
        },
        //项目小类
        SMALL_TYPE: {
            type: Array,
            default: () => ([])
        },
        //电压等级
        VOLTAGE_CLASSES: {
            type: Array,
            default: () => ([])
        },
        //申请单位、建设单位
        APPLY_COMPANY: {
            type: Array,
            default: () => ([])
        },
        //建设性质
        CONSTRUCTION_NATURE: {
            type: Array,
            default: () => ([])
        },
        //物资账
        SUPPLIES_ACCOUNT: {
            type: Array,
            default: () => ([])
        },
        //资金来源
        MONEY_SOURCE: {
            type: Array,
            default: () => ([])
        },
    },
    data () {
        return {
            rules: {
                code: [
                    { required: true, message: '请输入项目编号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                content: [
                    { pattern: /^.{1,100}$/, message: '最多输入100个字符', trigger: 'blur' }
                ],
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'id', 
            'code', 
            'name', 
            'cityProjectName', 
            'type', 
            'category',
            'materialUsage',
            'smallType',
            'voltageClasses',
            'projectClassification',
            'applyCompany',
            'planStartDate',
            'planFinishDate',
            {
                key:'isRushRapair',
                default: 0
            },
            {
                key:'isVirtualRapair',
                default: 0
            },
            'budgetAccountCode',
            'engineeringManageDept',
            'constructCompany',
            'projectPrincipal',
            'projectCompany',
            'projectContacts',
            'projectContactWay',
            'constructionNature',
            'moneySource',
            'suppliesAccount',
            'implementationCompany',
            'content',
            'quantity'
            ]
    },
    methods: {
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
            if(res.category==0){
                delete res.category
            }
            if(res.materialUsage==0){
                delete res.materialUsage
            }
            if(res.smallType==0){
                delete res.smallType
            }
            if(res.voltageClasses==0){
                delete res.voltageClasses
            }
            if(res.applyCompany==0){
                delete res.applyCompany
            }
            if(res.constructCompany==0){
                delete res.constructCompany
            }
            if(res.constructionNature==0){
                delete res.constructionNature
            }
            if(res.moneySource==0){
                delete res.moneySource
            }
            if(res.suppliesAccount==0){
                delete res.suppliesAccount
            }
            if(res.quantity==0){
                delete res.quantity
            }
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



