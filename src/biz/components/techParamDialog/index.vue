<template>
    <el-dialog
    title="技术参数"
    :visible="visibles"
    :append-to-body="true"
    :show-close="false"
    width="30%"
    center>
    <span>{{techParam}}</span>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeTech">关闭</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    components: {

    },
    props: {
        techParam: String,
        visibles:Boolean,
        closeTechDig:Function
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
        closeTech(){
            this.closeTechDig(false)
        }
    }
}

</script>