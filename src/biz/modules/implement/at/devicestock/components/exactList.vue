<template>
    <basic-list
        :show-select-col="false"
        :show-action-col="false"
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChanges">
        <template slot="hd-col--l">
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        selectionChanges: Function,
        proxyActions: Function,
        handleExport: Function,
        YES_FLAG:Object
    },
    data () {
        return {
            fields: [
                { key: 'locationNo', name: '库位' },
                { key: 'skuCode', name: '物料编码' },
                { key: 'skuName', name: '物料名称' ,width:180 },
                { key: 'skuSpec', name: '规格' ,width:180 },
                { key: 'stockQty', name: '库存数量' },
                { key: 'deviceQty', name: '设备数量' },
                { key: 'diffFlag', name: '是否差异' ,
                    render: (h, { index, row, col }) => {
                        const en = this.YES_FLAG[
                            Number( row.diffFlag )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.diffFlag
                        }
                    } 
                },
                { key: 'createTime', name: '操作时间' ,width:180 },
                { key: 'remarks', name: '备注' ,width:180 },
            ]
        }
    },
    methods: {
    }
}
</script>


