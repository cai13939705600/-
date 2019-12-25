<template>
    <detail-list/>
</template>

<script>
// import DetailList from './detailList'
import DetailList from './detail'

export default {
    data () {
        return {
        }
    },
    props: {
        lastDataId: String
    },
    components: {
        DetailList
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
