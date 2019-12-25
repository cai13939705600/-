<template>
    <basic-dialog
        :visible="visible"
        title="提示"
        :append-to-body="true"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <div class="entity-dlg__block">
            <div class="entity-dlg__block-bd">
                111
            </div>
        </div>
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'

export default {
    components: {
        BasicDialog
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        updateVis: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
    },
    data () {
        return {
        }
    },
    beforeCreate () {
        this.allFields = [ ]
    },
    mounted () {
    },
    methods: {
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            /*this.$emit('designDlgClosed')
            this.$nextTick(() => {
                this.$refs.form.resetFields()
            })*/
        },
        handleOk () {
        }
    }
}
</script>
