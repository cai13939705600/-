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
                            <el-form-item label="库位编码" prop="code">
                                <el-input v-model="dto.code"/>
                            </el-form-item>
                        </el-col>
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
                                        v-for="item in LOCATION_USE.array"
                                        :key="item.enumCode + ''"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
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
                        <el-col :span="8">
                            <el-form-item label="区" prop="area">
                                <el-input v-model="dto.area"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="通道" prop="aisil">
                                <el-input v-model="dto.aisil"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="列" prop="bay">
                                <el-input v-model="dto.bay"/>
                            </el-form-item>
                        </el-col>
                        
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="层" prop="level">
                                <el-input v-model="dto.level"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
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
            // useful: [{
            //     enumCode: 10,
            //     enumName: "库位用途",
            //     enumType: "LOCATION_USE",
            //     enumValue: "",
            //     enumValueCn: "拣货库位",
            // }],
            rules: {
                code: [
                    {
                        required: true,
                        message: '请输入库位编码'
                    }
                ],
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
                area: [
                    {
                        required: true,
                        message: '请输入区',
                        trigger: 'blur'
                    }
                ],
                level: [
                    {
                        required: true,
                        message: '请输入层',
                        trigger: 'blur'
                    },
                    {
                        message: '只能输入纯数字，或者字母+数字',
                        trigger: 'blur',
                        validator:this.checkRules
                    }
                ],
                bay: [
                    {
                        required: true,
                        message: '请输入起始列',
                        trigger: 'blur'
                    },
                    {
                        message: '只能输入纯数字，或者字母+数字',
                        trigger: 'blur',
                        validator:this.checkRules
                    }
                ],
                aisil: [
                     {
                        required: true,
                        message: '请输入通道',
                        trigger: 'blur'
                    },
                    {
                        message: '只能输入纯数字，或者字母+数字',
                        trigger: 'blur',
                        validator:this.checkRules
                    }
                ],
            },
            // 新增库位总数
            total: 0,
            // 显示预览框
            previewDialogVis: false
        }
    },
    beforeCreate () {
        this.allFields = [
            'code',
            'zoneId',
            'locUse',
            'locTypeId ',
            'area ',
            'aisil ',
            'level',
            'bay '
        ]
        this.disFields = [
        ]
    },
    watch: {
        
    },
    methods: {
        //验证通道
        checkRules(rule, value, callback) { 
            console.log('abcd',value)
            var reg = /([a-zA-Z]*\d+[a-zA-Z]*)+/;
            console.log('abcd',reg.test(value))
            if(!reg.test(value)){
                return callback(new Error('只能输入纯数字，或者字母+数字'));
            }
	    },
        changeZone (data) {
            console.log(data);
        },
        handleOk(){
            if(this.action == 'add'){
                api.library.addLocation(this.dto).then(({head, body})=>{
                    if(head.code == 200){
                        this.$message.success(head.subMessage)
                        this.updateVis(false)
                        this.queryList()
                    }else{
                        this.$message.error(head.subMessage)
                    }
                })
            }else if(this.action == 'edit'){
                api.library.editLocation(this.dto).then(({head, body})=>{
                    if(head.code == 200){
                        this.$message.success(head.subMessage)
                        this.updateVis(false)
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



