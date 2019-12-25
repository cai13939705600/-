<template>
    <el-dialog
    title="领料原因"
    :visible="showReaDlg"
    :show-close="false"
    width="30%"
    center>
    <span>{{takeReason}}</span>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeReason">关闭</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    components: {

    },
    props: {
        takeReason: String,
        showReaDlg:Boolean,
        closeReaDlg:Function
    },
    data () {
        return {

        }
    },
    computed: {
        
    },
    watch: {
       
    },
    methods: {
        closeReason(){
            this.closeReaDlg(false)
        }
    }
}

</script>