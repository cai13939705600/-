<template>
    <el-tabs
        v-model="active"
        type="card"
        class="suite-btm-tabs total_page">
        <el-tab-pane label="出库通知单明细" name="first">
            <detail-list
                :checktechParam="checktechParam"
            />
        </el-tab-pane>
        <el-tab-pane label="分配明细信息" name="second">
            <warp-list/>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
// import DetailList from './detailList'
import WarpList from './warp'

import DetailList from './detail'

export default {
    data () {
        return {
            active: 'first'
        }
    },
    props: {
        lastDataId: String,
        checktechParam: Function,
    },
    components: {
        DetailList,
        WarpList
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
.suite-btm-tabs {
    margin-top: 20px;

    /deep/ .basic-list {
        padding-top: 0;
    }
}
.total_page /deep/ .el-tabs__header.is-top {
    margin-bottom: 0;
}
</style>
