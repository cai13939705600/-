<template>
    <basic-dialog
        title="操作日志"
        width="80%"
        :visible="visible"
        :show-ft="false"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed">
        <basic-list
            :show-head="false"
            :show-action-col="false"
            :fields="fields"
            :loading="loading"
            :list="list"/>
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
export default {
    components: {
        BasicDialog,
        BasicList
    },
    props: {
        visible: Boolean,
        loading: Boolean,
        list: Array,
        updateVis: Function,
        updateState: Function
    },
    data () {
        return {
            fields: [
                { key: 'operator', name: '操作人' },
                {
                    key: 'gmtCreate',
                    name: '操作时间',
                    formatter: function (row, column, cellValue, index) {
                        return jt.date.format(cellValue)
                    }
                },
                { key: 'logMsgCn', name: '操作' }
            ]
        }
    },
    methods: {
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            this.updateState('logList')
        }
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .basic-list {
        padding: 0;
    }
}
</style>

