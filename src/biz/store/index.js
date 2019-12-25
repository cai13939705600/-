import Vue from 'vue'
import Vuex from 'vuex'

// 全局状态
import app from 'biz/store/modules/app'
// 枚举
import enums from 'biz/store/modules/enums'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        enums
    }
})

export default store
