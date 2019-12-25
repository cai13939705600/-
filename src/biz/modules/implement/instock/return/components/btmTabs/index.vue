<template>
    <el-tabs
        v-model="active"
        type="card"
        class="suite-btm-tabs">
        <el-tab-pane label="入库单明细" name="first">
            <stock-list 
                :checktechParam="checktechParam"
            />
        </el-tab-pane>
        <el-tab-pane label="收货明细" name="second">
            <receive-list
                :checktechParam="checktechParam"
            />
        </el-tab-pane>
        <el-tab-pane label="待上架明细" name="third">
            <putaway-list
                :checktechParam="checktechParam"
            />
        </el-tab-pane>
        <el-tab-pane label="入库操作日志" name="fourth">
            <deal-list/>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import stockList from './stock'
import receiveList from './receive'
import putawayList from './putaway'
import dealList from './deal'

export default {
    data () {
        return {
            active: 'first'
        }
    },
    props: {
        lastDataId: String,
        lastDataCode: String,
        checktechParam: Function
    },
    components: {
        stockList,
        receiveList,
        putawayList,
        dealList
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
