<template>
    <total-list/>
</template>

<script>
import totalList from './total'

export default {
    data () {
        return {
        }
    },
    props: {
        lastDataId: String
    },
    components: {
        totalList
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
