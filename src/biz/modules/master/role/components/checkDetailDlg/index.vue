<template>
    <basic-dialog
        class="checkDetail-dlg"
        title="角色/查看明细"
        :width="1000"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed">
        <!-- 以下左右分角色组件 -->
        <Look
            :state="state"
            :ROLE_TYPE="ROLE_TYPE"
            :entity="state.entity"
            :update-vis="updateVis"/>
        <template slot="ft">&emsp;</template>
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
import Look from '../look'
import EntityDialog from 'biz/mixins/entityDialog'

export default {
    components: {
        BasicDialog,
        BasicList,
        Look
    },
    mixins: [ EntityDialog ],
    props: {
        state: Object,
        visible: {
            type: Boolean,
            default: false
        },
        appendToBody: {
            type: Boolean,
            default: true
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        handleSave: {
            type: Function,
            default: () => {}
        },
        ROLE_TYPE: Object
    },
    data () {
        return {
            //..._.cloneDeep(DEFAULTS),
        }
    },
    watch: {
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
.search-form {
    display: flex;
    .col-l {
        display: flex;
        flex: 1;
        .el-form-item {
            width: 25%;
            padding-right: 20px;
        }
    }
    .col-r {
        width: 140px;
    }
}
.basic-list {
    padding-top: 0;
}
</style>
