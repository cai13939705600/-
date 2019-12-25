<template>
    <basic-list
        :show-select-col="true"
        :show-action-col="false"
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange">
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        exportUrl: String,
        handleImport: Function,
        handleStart: Function,
        handleStop: Function,
        VALID_FLAG:Object
    },
    data () {
        return {
            fields: [
                { key: 'code', name: 'RDID编码' },
                { key: 'locationCode', name: '库位编码', width: 180 },
                { key: 'skuCode', name: '物料编码', minWidth: 180 },
                { key: 'skuName', name: '物料名称', minWidth: 180 },
                { key: 'skuSpec', name: '规格', minWidth: 150 },
                { key: 'validFlag', name: '状态', minWidth: 180 ,
                    render: (h, { index, row, col }) => {
                        const en = this.VALID_FLAG.map[
                            Number( row.validFlag )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.validFlag
                        }
                    }
                },
                { key: 'creator', name: '创建人', width: 160 },
                { key: 'createTime', name: '创建时间', width: 160 },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间', width: 180 }
            ]
        }
    },
    methods: {
        onEdit () {
            debugger
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要编辑的批次规则！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个批次规则进行编辑！')
                return
            }
            if(rows[0].validFlag != 1){
                this.$message.error('请选择启用状态的批次规则进行编辑！')
                return
            }
            this.handleEdit(rows[0])
        },
        onStart () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的批次规则！')
                return
            }
            const goodsIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 0) {
                    goodsIds.push(rows[i].id)
                }
            }
            if (goodsIds.length) {
                this.handleStart(goodsIds,1)
            } else {
                this.$message.error('所选批次规则已启用！')
            }
        },
        onStop () {
            debugger
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的批次规则！')
                return
            }
            const goodsIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 1) {
                    goodsIds.push(rows[i].id)
                }
            }
            if (goodsIds.length) {
                this.handleStop(goodsIds,0)
            } else {
                this.$message.error('所选批次规则已停用！')
            }
        },
    }
}
</script>


