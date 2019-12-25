<template>
    <basic-dialog
        class="goods-sel-dlg"
        title="物料筛选"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form class="search-form" size="small" label-width="80px" :model="query">
            <div class="col-l">
                <el-form-item label="物料编号">
                    <el-input v-model="query.code"/>
                </el-form-item>
                <el-form-item label="物料名称">
                    <el-input v-model="query.name"/>
                </el-form-item>
                <el-form-item label="物料条码">
                    <el-input v-model="query.barcode"/>
                </el-form-item>
                <!-- <el-form-item label="规格">
                    <el-input v-model="query.spec"/>
                </el-form-item>
                <el-form-item label="技术参数">
                    <el-input v-model="query.techParam"/>
                </el-form-item>
                <el-form-item label="供应商">
                    <el-input v-model="query.supplierName"/>
                </el-form-item> -->
                <!-- <el-form-item label="货号">
                    <el-input v-model="query.skuNo1"/>
                </el-form-item> -->
            </div>
            <div class="col-r">
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
            </div>
        </el-form>
        <basic-list
            ref="basicList"
            select-type="single"
            :show-select-col="true"
            :show-action-col="false"
            :setClmnsFlg="false"
            :fields="fields"
            :list="list"
            :loading="loading"
            :total="total"
            :page-index="pageIndex"
            :page-size="pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-change="selectionChange"/>
        <tech-param-dialog
        :visibles="techDlgVis"
        :techParam="techParam"
        :closeTechDig="closeTechDig"
        />
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
import techParamDialog from 'biz/components/techParamDialog'

const DEFAULTS = {
    query: {
        code: undefined,
        name: undefined,
        barcode: undefined,
        // spec:undefined,
        // techParam:undefined,
        // supplierName:undefined,
        validFlag:1
    },
    loading: false,
    total: 0,
    pageIndex: 1,
    pageSize: 20,
    list: [],
    selRows: []
}

export default {
    components: {
        BasicDialog,
        BasicList,
        techParamDialog
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        appendToBody: {
            type: Boolean,
            default: true
        },
        params: {
            type: Object,
            default () {
                return {}
            }
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        handleSave: {
            type: Function,
            default: () => {}
        },
        storerId: {
            type: String | Number
        },
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            techDlgVis:false,
            techParam:'',
            fields: [
                { key: 'storerName', name: '货主名称' },
                { key: 'code', name: '物料编码' },
                { key: 'name', name: '物料名称' },
                { key: 'shortName', name: '物料简称' },
                { key: 'barcode', name: '物料条码' },
                {
                    key: 'validFlag',
                    name: '启停状态',
                    formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    }
                },
                { key: 'uom', name: '基本单位' },
                { key: 'spec', name: '规格' },
                { key: 'techParam', name: '技术参数' , 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.techParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'supplierName', name: '供应商' },
                { key: 'brandName', name: '品牌' },
                { key: 'costPrice', name: '价格' },
                { key: 'skuNo1', name: '货号' },
                { key: 'lotAttrRuleName', name: '批次规则' },
                { key: 'imgUrl', name: '物料图片' ,
                    render: (h, { index, row, col }) => {
                        if(row.imgUrl){
                        //     return  <img src={'/api/ba/sku/showImageByte?imgUrl='+row.imgUrl}  min-width="70" height="70" />
                            return <span on-click={(e)=>{
                                e.stopPropagation()
                                this.$alert("<img width=100% src=/api/ba/sku/showImageByte?jwt="+cookie.get('jwt')+"&tenantId="+cookie.get('tenantId')+"&qpId="+cookie.get('qpId')+"&imgUrl="+row.imgUrl +"  />", '物料图片', {
                                    dangerouslyUseHTMLString: true
                                });
                                }} style="color:blue;cursor:pointer">图片预览</span>
                            }
                        }
                },
                { key: 'guaranteePeriodDays', name: '保质期天数' },
                { key: 'length', name: '长(cm)' },
                { key: 'width', name: '宽(cm)' },
                { key: 'height', name: '高(cm)' },
                {
                    key: 'volume',
                    name: '体积(L)'
                },
                { key: 'grossWeight', name: '重量(kg)' },
                { key: 'creator', name: '创建人' },
                {
                    key: 'createTime',
                    name: '创建时间',
                    width: 180,
                    // formatter: function (row, column, cellValue, index) {
                    //     return jt.date.format(cellValue)
                    // }
                },
                { key: 'modifier', name: '修改人' },
                {
                    key: 'modifiedTime',
                    name: '修改时间',
                    width: 180,
                    // formatter: function (row, column, cellValue, index) {
                    //     return jt.date.format(cellValue)
                    // }
                }
            ]
        }
    },
    watch: {
        visible (newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params)}
                this.queryList()
            }
        }
    },
    methods: {
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            const defaults = _.cloneDeep(_.get(DEFAULTS, ['selRows', 'query']))
            for (let key in defaults) {
                this[key] = defaults[key]
            }
            this.$refs.basicList.resetData()
        },
        handleOk () {
            console.log(this.selRows)
            if (!this.selRows.length) {
                this.$message.error('请选择物料')
                return
            }
            this.handleSave(this.selRows[0])
            this.updateVis(false)
        },
        pageIndexChange (index) {
            debugger
            this.pageIndex = index
            this.queryList()
        },
        pageSizeChange (size) {
            debugger
            this.pageIndex = 1
            this.pageSize = size
            this.queryList()
        },
        //技术参数查看
        checktechParam(param){
            this.techParam = param
            this.techDlgVis = true
        },
        //关闭技术参数页面
        closeTechDig(vis){
            this.techDlgVis = vis
        },
        selectionChange (rows) {
            this.selRows = rows
        },
        handleSearch () {
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        handleReset () {
            this.query = _.cloneDeep(DEFAULTS.query)
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        queryList () {
            const query = _.cloneDeep(this.query)
            if (this.storerId) {
                query.storerId = this.storerId
            }
            jt.object.removeEmptyAttr(query)
            api.goods.queryGoodsList({
                ...query,
                page: {
                    current: this.pageIndex,
                    size: this.pageSize
                }
            }).then(({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    this.list = _.get(body, 'records') || []
                    this.total = _.get(body, 'total') || 0
                }
                this.$refs.basicList.resetData('radioIndex')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.search-form {
    display: flex;
    .col-l {
        display: flex;
        flex: 1;
        .el-form-item {
            width: 25%;
            padding-right: 20px;
        }
    }
    .col-r {
        width: 140px;
    }
}
.basic-list {
    padding-top: 0;
}
</style>


