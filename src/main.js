import Vue from 'vue'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import 'biz/libs/element'
import router from 'biz/router'
import store from 'biz/store'
import EditCell from 'biz/components/editCell'
import App from './App'
import { chooseUniqueSelect } from 'common/directives/choose-unique-select'
import { printService } from 'biz/utils/printService'
import 'common/styles/index.scss'
import cookie from 'js-cookie'
import { times } from 'common/filters/times'

// cookie.set('jwt', 'eyJhbGciOiJIUzUxMiIsInppcCI6IkRFRiJ9.eNoki0EKwjAQRe8y6wbMjNOkvYHHSNMRIraWJIWCeAIvILj0bnoNE918eI_3r3DKAXroPHsjTivn6aj2iKQGJlLcoRfDlkgjNJDWocSaGDWZslRcSKm49-v-eT4qugy95pZby7bdNSDb8hfGIFYRL2epFzdOYS6PReJUORbbwJokHkboa5lldnP-0e0LAAD__w.HECAEB4phW0HQyvWDISIBTlxpSSjNk1bf68CWdCm2QSIDZ-leOkW5zXooijhrrcm7nrCFeRyBXuZAmxqcIqXpg')
// cookie.set('qpId', 'b38eoi400m4ppa0')
// cookie.set('tenantId', '6')

Vue.config.productionTip = false
// window.printService = printService

Vue.config.productionTip = false

Vue.directive('clickoutside', Clickoutside)
Vue.directive('choose-unique-select', chooseUniqueSelect)
Vue.filter('timesFilter', times)

Vue.component('edit-cell', EditCell)

// TODO
const jsPrefix = process.env.VUE_APP_PUBLIC_PATH + (process.env.NODE_ENV === 'production' ? '/' : '') + 'print/js/'
const scripts1 = [
    jsPrefix + 'jquery.min.js'
]
const scripts2 = [
    jsPrefix + 'jcloud-dataTable.Template.js',
]
jt.loader.loadScripts(scripts1, () => {
    jt.loader.loadScripts(scripts2)
})
Vue.prototype.$hasAuth = function (code) {
    const rcMap = this.$store.state.app.rcMap
    return rcMap[code]
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
