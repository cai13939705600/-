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
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">库位属性</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="库区名称" prop="zoneId">
                                <el-select
                                    v-model="dto.zoneId"
                                    filterable
                                    clearable
                                    placeholder="请输入库区名称">
                                    <el-option
                                        v-for="item in libraries"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <input v-model="dto.zoneCode" type="hidden" prop="zoneCode"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库位类型" prop="locTypeId">
                                <el-select
                                    v-model="dto.locTypeId"
                                    required
                                    placeholder="请选择">
                                    <el-option
                                        v-choose-unique-select="state.locationType.length === 1 && !dto.locTypeId"
                                        v-for="item in state.locationType"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="库位用途"
                                prop="locUse">
                                <el-select
                                    v-model="dto.locUse"
                                    placeholder="请选择">
                                    <el-option
                                        v-choose-unique-select="LOCATION_USE.array.length === 1"
                                        v-for="item in LOCATION_USE.array"
                                        :key="item.enumCode + ''"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item
                                label="库位限制"
                                prop="constraintType">
                                <el-select
                                    v-model="dto.constraintType"
                                    placeholder="请选择">
                                    <el-option
                                        v-choose-unique-select="LOCATION_CONSTRAINT.array.length === 1"
                                        v-for="item in LOCATION_CONSTRAINT.array"
                                        :key="item.enumCode + ''"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="ABC分类"
                                props="cycleClass">
                                <el-select
                                    v-model="dto.cycleClass"
                                    placeholder="请选择">
                                    <el-option
                                    v-for="item in LOCATION_CYCLE_CLASS.array"
                                    :key="item.enumCode + ''"
                                    :label="item.enumValueCn"
                                    :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="dto.remark"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">目标数据&emsp;</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="2">&emsp;</el-col>
                        <el-col :span="5">
                            <el-checkbox class="passageway_checkbox" v-model="dto.isCheck"></el-checkbox>
                            <el-form-item label="起始通道" prop="startAisil">
                                <span v-show="dto.isCheck" class="required-badge">*</span>
                                <el-input-number
                                    :disabled="!dto.isCheck"
                                    :rules="dto.isCheck && {
                                        required: true, message: '起始通道不能为空', trigger: 'blur'
                                    }"
                                    :controls="false"
                                    v-model="dto.startAisil"
                                    :min="1" :max="99 - dto.aisilNum"
                                    :required="dto.isCheck"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="增加通道数" prop="aisilNum">
                                <span v-show="dto.isCheck" class="required-badge required-badge-5">*</span>
                                <el-input-number :disabled="!dto.isCheck" :controls="false" v-model="dto.aisilNum" :min="1" :max="99 - dto.startAisil" :required="dto.attr07"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="2">&emsp;</el-col>
                        <el-col :span="5">
                            <el-form-item label="起始层" prop="startLevel">
                                <el-input-number :controls="false" v-model="dto.startLevel" :min="1" :max="20 - dto.levelNum" required/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="增加层数" prop="levelNum">
                                <el-input-number :controls="false" v-model="dto.levelNum" :min="1" :max="20 - dto.startLevel" required/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="2">&emsp;</el-col>
                        <el-col :span="5">
                            <el-form-item label="起始列" prop="startBay">
                                <el-input-number :controls="false" v-model="dto.startBay" :min="1" :max="99 - dto.bayNum" required/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="增加列数" prop="bayNum">
                                <el-input-number :controls="false" v-model="dto.bayNum" :min="1" :max="99 - dto.startBay" required/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="">
                                <h5 class="result_count">预计新增库位{{  total || 0  }}个</h5>
                                <h5 v-show="total > 2000" class="required-color result_count">超过单次新增库位数量上限2000，请修改新增数量</h5>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button class="ml-20" size="small" type="primary" @click="previewDialogVisChange(true)">预览</el-button>
            <!-- <el-button v-show="active === 'edit'" class="ml-20" size="small" type="primary" @click="validator(true)">保存并继续</el-button> -->
            <el-button class="ml-20" size="small" type="primary" @click="validator(false)">保存</el-button>
            <el-button class="ml-20" size="small" @click="handleClose">取消</el-button>
            <sub class="tips-sub">
                <img src="@/biz/imgs/warning.png" alt="">
                单次新增上限：2000个
            </sub>
        </template>
        <!-- 预览弹框 -->
        <preview-dialog
            ref="previewDialog"
            :visible="previewDialogVis"
            :perviewDialogClose="previewDialogVisChange"
        />
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import SearchSelect from '../../mixin/searchSelect'
import PreviewDialog from './previewDialog'
import saveGoOn from 'biz/mixins/saveGoOn'
import { find } from 'common/utils/lodash'


export default {
    mixins: [ EntityDialog, SearchSelect, saveGoOn ],
    components: {
        PreviewDialog
    },
    props: {
        libraries: {
            type: Array,
            default: () => ([])
        },
        changeValue: {
            type: Function,
            default: () => {}
        },
        LOCATION_CYCLE_CLASS: {
            type: Object,
            default: () => {}
        },
        LOCATION_USE: {
            type: Object,
            default: () => {}
        },
        LOCATION_CONSTRAINT: {
            type: Object,
            default: () => {}
        },
        state: Object
    },
    data () {
        return {
            useful: [{
                enumCode: 10,
                enumName: "库位用途",
                enumType: "LOCATION_USE",
                enumValue: "",
                enumValueCn: "拣货库位",
            }],
            rules: {
                zoneId: [
                    {
                        required: true,
                        message: '请选择所属库区'
                    }
                ],
                locTypeId: [
                    {
                        required: true,
                        message: '请选择库位类型',
                        trigger: 'blur'
                    }
                ],
                locUse: [
                    {
                        required: true,
                        message: '请选择库位用途',
                        trigger: 'blur'
                    }
                ],
                constraintType: [
                    {
                        required: true,
                        message: '请选择库位限制',
                        trigger: 'blur'
                    }
                ],
                startLevel: [
                    {
                        required: true,
                        message: '请输入起始层',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 20,
                        message: '数字范围1-20',
                        trigger: 'blur',
                        type: 'number'
                    }
                ],
                levelNum: [
                    {
                        required: true,
                        message: '请输入增加层数',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 20,
                        message: '数字范围1-20',
                        trigger: 'blur',
                        type: 'number'
                    }
                ],
                startBay: [
                    {
                        required: true,
                        message: '请输入起始列',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 99,
                        message: '数字范围1-99',
                        trigger: 'blur',
                        type: 'number'
                    }
                ],
                bayNum: [
                    {
                        required: true,
                        message: '请输入增加列数',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 99,
                        message: '数字范围1-99',
                        trigger: 'blur',
                        type: 'number'
                    }
                ],
                aisilNum: [
                    {
                        min: 1,
                        max: 99,
                        message: '数字范围1-99',
                        trigger: 'blur',
                        type: 'number'
                    }
                ],
                startAisil: [
                    {
                        min: 1,
                        max: 99,
                        message: '数字范围1-99',
                        trigger: 'blur',
                        type: 'number'
                    }
                ]
            },
            // 新增库位总数
            total: 0,
            // 显示预览框
            previewDialogVis: false
        }
    },
    beforeCreate () {
        this.allFields = [
            'zoneCode',
            'zoneId',
            'locCategory',
            'locUse',
            'constraintType',
            'cycleClass',
            'remark',
            'startAisil',
            'aisilNum',
            'startLevel',
            'levelNum',
            'startBay',
            'bayNum',
            'locTypeId'
        ]
        this.disFields = [
        ]
    },
    watch: {
        dto: {
            // 监听数据变化 重新计算总库位数量
            handler (n) {
                this.total = (n.aisilNum || 1) * n.levelNum * n.bayNum || 0
                return n
            },
            deep: true
        },
        'dto.zoneId': function (n) {
            if (n) {
                this.dto.zoneCode = find(this.libraries, {id: n}).code
            } else {
                this.dto.zoneCode = ''
            }
            return n
        },
        'dto.isCheck': function (n) {
            if (!n) {
                this.dto.aisilNum = undefined
                this.dto.startAisil = undefined
            }
            return n
        },
    },
    methods: {
        // 显示预览弹出框
        previewDialogVisChange (visible) {
            // TODO this.$refs.form.validator
            this.$refs.previewDialog.generatorData(this.dto)
            this.previewDialogVis = !!visible
        },
        // 表单验证
        validator (isGoOn) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    isGoOn ? this.saveAndGoOn() : this.handleOk()
                } else {
                    this.$message.error('请填写起始通道和增加通道数量')
                    return false;
                }
            });
        },
        changeZone (data) {
            console.log(data);
        }
    }
}
</script>
<style lang="scss">
    .passageway_checkbox {
        position: absolute;
        top: 7px;
        left: 83px;
        .el-checkbox__input{
            .el-checkbox__inner {
                &::after {
                    opacity: 0;
                }
            }
            &.is-checked {
                .el-checkbox__inner {
                    &::after {
                        transform: rotate(0deg) scale(1.5);
                        border-color: black;
                        border-radius: 50%;
                        background-color: black;
                        width: 3px;
                        height: 3px;
                        left: 4px;
                        top: 4px;
                        opacity: 1;
                    }
                }
            }
            .el-checkbox__inner {
                border-radius: 50%;
                border-color: black;
                background-color: transparent;
            }
        }
    }
</style>
<style lang="scss" scoped>
    @import '@/biz/styles/public.scss';
    .result_count {
        line-height: 32px;
    }
    .ml-20 {
        margin-left: 20px;
    }
    .el-checkbox__inner {
        border-color: black !important;
    }
    .required-color {
        color: #FF5B5B;
    }
    .required-badge {
        position: absolute;
        left: -71px;
        top: 0;
        z-index: 99;
        color: #FF5B5B;
        line-height: 32px;
    }
    .required-badge-3 {
        left: -59px;
    }
    .required-badge-5 {
        left: -83px;
    }
</style>



