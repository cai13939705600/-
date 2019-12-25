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
        YES_FLAG:Object,
        checktakereason: Function,
    },
    data () {
        return {
            fields: [
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间', width:180  },
                { key: 'skuName', name: '物料名称' ,width:180 },
                { key: 'skuSpec', name: '规格' ,width:180 },
                { key: 'whName', name: '仓库名称' },
                { key: 'zoneName', name: '库区' },
                { key: 'locationCode', name: '库位' },
                { key: 'takeReason', name: '领料原因',
                     render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktakereason(row.takeReason)}>查看</el-link>
                        )
                    } 
                },
                { key: 'state', name: '状态' ,
                    render: (h, { index, row, col }) => {
                        if (row.state==10) {
                            return <span>待处理</span>
                        } else if(row.state==20){
                            return <span>已处理</span>
                        }else{
                            return <span></span>
                        }
                    }
                },
            ]
        }
    },
    methods: {
    }
}
</script>


