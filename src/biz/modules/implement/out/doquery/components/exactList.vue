<template>
    <basic-list
        class="out-doquery-list"
        :show-select-col="false"
        :show-action-col="false"
        :fields="fields"
        :fieldLimit="9"
        :table-h="tableH"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange">
        <template slot="hd-col--l">
            <el-button v-if="rcMap['wo.outbound.doquery.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'

export default {
    mixins: [ ExactList ],
    props: {
        handleExport: Function,
        proxyActions: Function,
        DO_STATE: Object,
        YES_FLAG: Object,
        GET_METHOD: Object
        // changeCarrierData: Object|undefined
    },
    created () {
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '出库通知单号', width: 180 },
                { key: 'billCode1', name: '业务单号', width: 180 },
                {key:'billTypeName',name:"单据类型"},
                { key: 'state', name: '状态',
                    render: (h, { index, row, col }) => {
                        const en = this.DO_STATE[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:DO_STATE', row.state, typeof row.state, this.DO_STATE);
                            return row.state
                        }
                    }
                },
                { key: 'storerName', name: '货主' },
                { key: 'skuQty', name: '总品数' },
                { key: 'quantity', name: '总数量' },
                { key: 'outboundQty', name: '实发数量' },
                { key: 'totalWeight', name: '总重量(kg)'},
                { key: 'totalVolume', name: '总体积（cm³)' },
                { key: 'consignee', name: '收货人' },
                { key: 'address', name: '收货地址', width: 180 },
                { key: 'itemCode', name: '项目编号' },
                { key: 'itemName', name: '项目名称' },
                { key: 'getMethod', name: '领料方式' ,
                    render: (h, { index, row, col }) => {
                        const en = this.GET_METHOD[
                            Number( row.getMethod )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:GET_METHOD', row.getMethod, typeof row.getMethod, this.GET_METHOD);
                            return row.getMethod
                        }
                    }
                },
                { key: 'singleProject', name: '单项工程' },
                { key: 'ifInstallFee', name: '是否有安装费',
                    render: (h, { index, row, col }) => {
                        const en = this.YES_FLAG[
                            Number( row.ifInstallFee )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:YES_FLAG', row.ifInstallFee, typeof row.ifInstallFee, this.YES_FLAG);
                            return row.ifInstallFee
                        }
                    }
                },
                { key: 'ifUrgent', name: '是否紧急' ,
                    render: (h, { index, row, col }) => {
                        const en = this.YES_FLAG[
                            Number( row.ifUrgent )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:YES_FLAG', row.ifUrgent, typeof row.ifUrgent, this.YES_FLAG);
                            return row.ifUrgent
                        }
                    }
                },
                { key: 'constructionUnit', name: '施工单位' },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间', width: 180 },
                // { key: 'modifier', name: '修改人' },
                // { key: 'modifiedTime', name: '修改时间', width: 180 }
            ]
        }
    },
    methods: {
        
    }
}
</script>
<style lang="scss" scoped>
    .out-doquery-list {
        /deep/ .el-dropdown {
            margin-left: 10px;
        }
        /deep/ .el-dropdown__caret-button {
            .el-dropdown__icon.el-icon-arrow-down {
                transition: transform 0.5s;
            }
            .el-dropdown-menu.el-popper {
                width: 100%;
                text-align: center;
            }
            &:hover {
                &::before {
                    opacity: 0;
                }
                background-color: #3389E3;
                .el-dropdown__icon.el-icon-arrow-down {
                    transform: rotate(180deg);
                }
            }
        }
        .ml-10 {
            margin-left: 10px;
        }
    }
</style>


