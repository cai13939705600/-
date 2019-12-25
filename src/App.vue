<template>
    <div id="app">
        <router-view v-if="$route.meta.isGlobal"/>
        <layout v-else-if="logined"/>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Layout from 'biz/modules/layout'
import 'biz/styles/index.scss'
export default {
    name: 'App',
    components: {
        Layout
    },
    computed: {
        ...mapState('app', [ 'logined' ])
    },
    mounted(){
        var subMessages = sessionStorage.getItem("subMessage");
        if(subMessages){
            this.$message.success(subMessages)
            sessionStorage.removeItem('subMessage')
        }
    }
}
</script>

