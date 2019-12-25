<template>
    <el-tabs
        v-model="active"
        type="card"
        class="suite-btm-tabs">
        <el-tab-pane label="盘点明细" name="first">
            <detail-list/>
        </el-tab-pane>
        <!-- <el-tab-pane label="分配明细信息" name="second">
            <warp-list/>
        </el-tab-pane> -->
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
        lastDataId: String
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
</style>
