<template>
    <el-form class="login-form" ref="form" :model="model" :rules="rules" @submit.native.prevent>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">是否审核自动分配</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item prop="IF_CHECK_AUTO_ALLOCATE">
                <el-radio-group v-model="model.IF_CHECK_AUTO_ALLOCATE" @change="chooseValue1($event,'IF_CHECK_AUTO_ALLOCATE')">
                    <el-radio  v-for="item in IF_CHECK_AUTO_ALLOCATE"
                              :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">发运</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item prop="SEND_OUT_RULE">
                <el-radio-group v-model="model.SEND_OUT_RULE" @change="chooseValue2($event,'SEND_OUT_RULE')">
                    <el-radio v-for="item in SEND_OUT_RULE" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">拣货单生成策略</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item  prop="PICK_STRATEGY">
                <el-radio-group v-model="model.PICK_STRATEGY" @change="chooseValue3($event,'PICK_STRATEGY')">
                    <el-radio v-for="item in PICK_STRATEGY" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">是否缺量拣货自动分配</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item  prop="IF_LACK_PICK_AUTO_ALLOCATE">
                <el-radio-group v-model="model.IF_LACK_PICK_AUTO_ALLOCATE" @change="chooseValue4($event,'IF_LACK_PICK_AUTO_ALLOCATE')">
                    <el-radio v-for="item in IF_LACK_PICK_AUTO_ALLOCATE" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">是否审核单据</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item  prop="IF_CHECK_BILL">
                <el-radio-group v-model="model.IF_CHECK_BILL" @change="chooseValue5($event,'IF_CHECK_BILL')">
                    <el-radio v-for="item in IF_CHECK_BILL" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">物料编码生成</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item  prop="SKU_CODE_PRODUCE_RULE">
                <el-radio-group v-model="model.SKU_CODE_PRODUCE_RULE" @change="chooseValue6($event,'SKU_CODE_PRODUCE_RULE')">
                    <el-radio v-for="item in SKU_CODE_PRODUCE_RULE" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">是否手工触发自动盘点</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item  prop="MANUAL_TRIGGER_AUTO_COUNT">
                <el-radio-group v-model="model.MANUAL_TRIGGER_AUTO_COUNT" @change="chooseValue7($event,'MANUAL_TRIGGER_AUTO_COUNT')">
                    <el-radio v-for="item in MANUAL_TRIGGER_AUTO_COUNT" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">供应商编码生成规则</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item  prop="SUPPLIER_CODE_RULE">
                <el-radio-group v-model="model.SUPPLIER_CODE_RULE" @change="chooseValue8($event,'SUPPLIER_CODE_RULE')">
                    <el-radio v-for="item in SUPPLIER_CODE_RULE" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">项目名称是否必填</span>
        </div>
        <div class="entity-dlg__block-bd">
            <el-form-item  prop="WI_ASN_ITEM">
                <el-radio-group v-model="model.WI_ASN_ITEM" @change="chooseValue9($event,'WI_ASN_ITEM')">
                    <el-radio v-for="item in WI_ASN_ITEM" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
       <!-- <el-button type="primary" size="mini" @click="saveForm">保存</el-button>-->
    </el-form>
</template>

<script>
    export default {
        data() {
            return {
                model:{
                    IF_CHECK_AUTO_ALLOCATE:'',
                    SEND_OUT_RULE:'',
                    PICK_STRATEGY:'',
                    IF_LACK_PICK_AUTO_ALLOCATE:'',
                    IF_CHECK_BILL:'0',
                    SKU_CODE_PRODUCE_RULE:'1',
                    MANUAL_TRIGGER_AUTO_COUNT:'',
                    SUPPLIER_CODE_RULE:'',
                    WI_ASN_ITEM:'0'
                },
                rules: {
                    IF_CHECK_AUTO_ALLOCATE: [
                        {validator: this.validUname, trigger: 'change'}
                    ],
                    SEND_OUT_RULE: [
                        {validator: this.validPwd, trigger: 'change'}
                    ]
                },
                //是否审核自动分配
                IF_CHECK_AUTO_ALLOCATE:[
                    {label:'是',value:'1'},
                    {label:'否',value:'0'},
                ],
                //是否缺量拣货自动分配
                IF_LACK_PICK_AUTO_ALLOCATE:[
                    {label:'是',value:'1'},
                    {label:'否',value:'0'},
                ],
                //发运
                SEND_OUT_RULE:[
                    {label:'复核自动发运',value:'1'},
                    {label:'拣货自动发运',value:'2'},
                ],
                //拣货单生成策略
                PICK_STRATEGY:[
                    {label:'一对一生成',value:'1'},
                    {label:'按需选出库单',value:'2'},
                   // {label:'拣货单生成策略规则',value:'3'},
                ],
                //是否审核单据
                IF_CHECK_BILL:[
                    {label:'是',value:'1'},
                    {label:'否',value:'0'},
                ],
                //物料编码生成规则
                SKU_CODE_PRODUCE_RULE:[
                    {label:'用户自定义',value:'1'},
                    {label:'系统自动生成',value:'2'},
                ],
                //是否自动盘点
                MANUAL_TRIGGER_AUTO_COUNT:[
                    {label:'是',value:'1'},
                    {label:'否',value:'0'},
                ],
                //供应商编码生成规则：
                SUPPLIER_CODE_RULE:[
                    {label:'用户自定义',value:'1'},
                    {label:'系统自动生成',value:'2'},
                ],
                //项目名称是否必填
                WI_ASN_ITEM:[
                    {label:'是',value:'1'},
                    {label:'否',value:'0'},
                ]
            }
        },
        created () {
            this.loadView()
        },
        methods: {
            //选中radio事件
            chooseValue1(value,code){
                this.handleRadio(value,code)
            },
            chooseValue2(value,code){
                this.handleRadio(value,code)
            },
            chooseValue3(value,code){
                this.handleRadio(value,code)
            },
            chooseValue4(value,code){
                this.handleRadio(value,code)
            },
            chooseValue5(value,code){
                this.handleRadio(value,code)
            },
            chooseValue6(value,code){
                this.handleRadio(value,code)
            },
            chooseValue7(value,code){
                this.handleRadio(value,code)
            },
            chooseValue8(value,code){
                this.handleRadio(value,code)
            },
            chooseValue9(value,code){
                this.handleRadio(value,code)
            },
            //切换radio 更新数据接口
            handleRadio(value,code) {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return
                    }
                    api.base.sysparameter({
                        "code":code,
                        "parameterValue":value
                    }).then(({ head, body }) => {
                        if (head.code== '200') {
                           // console.log(head.subMessage)
                            this.$message.success(head.subMessage)
                        } else {
                            this.$message.error(head.subMessage)
                        }
                    })
                })
            },
            //页面加载回显数据
            loadView(){
                api.base.getParameters({
                    code:'IF_CHECK_AUTO_ALLOCATE'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.IF_CHECK_AUTO_ALLOCATE=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })

                api.base.getParameters({
                    code:'SEND_OUT_RULE'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.SEND_OUT_RULE=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })

                api.base.getParameters({
                    code:'PICK_STRATEGY'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.PICK_STRATEGY=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })

                api.base.getParameters({
                    code:'IF_LACK_PICK_AUTO_ALLOCATE'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.IF_LACK_PICK_AUTO_ALLOCATE=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })
                api.base.getParameters({
                    code:'IF_CHECK_BILL'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.IF_CHECK_BILL=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })
                api.base.getParameters({
                    code:'SKU_CODE_PRODUCE_RULE'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.SKU_CODE_PRODUCE_RULE=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })
                api.base.getParameters({
                    code:'MANUAL_TRIGGER_AUTO_COUNT'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.MANUAL_TRIGGER_AUTO_COUNT=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })
                 api.base.getParameters({
                    code:'SUPPLIER_CODE_RULE'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.SUPPLIER_CODE_RULE=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })
                api.base.getParameters({
                    code:'WI_ASN_ITEM'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        this.model.WI_ASN_ITEM=body.parameterValue
                        // this.$message.success(head.subMessage)
                    } else {
                        this.$message.error(head.subMessage)
                    }
                })
            },
            //保存按钮
            saveForm(){

            },
        },

    }
</script>

<style lang="scss" scoped>
    .entity-dlg__hd-line {
        display: inline-block;
        margin-right: 10px;
        width: 3px;
        height: 16px;
        vertical-align: middle;
        border-radius: 3px;
        background: #4186f6;
    }
     .entity-dlg__hd-title {
        vertical-align: middle;
        color: #3f4656;
    }
</style>
