
import axios from 'axios'
import cookie from 'js-cookie'
import qs from 'querystring'

const OAUTH_ENABLE = process.env.VUE_APP_OAUTH_ENABLE === 'true'

let login = function () {}

let logout = function () {}

let isAuthed = function () {
    return true
}

if (OAUTH_ENABLE) {
    login = function () {
        cookie.remove('jwt')
        cookie.remove('tenantId')
        cookie.remove('qpId')
        const location = window.location
        window.location.href = location.protocol + '//' + location.host + CNST.ROUTES.LOGIN.path
    }

    logout = function () {
        login()
    }

    isAuthed = function () {
        return !!cookie.get('jwt')
    }

    const isOauthReq = function (url) {
        return [
            '/wms/loginAuth'
        ].indexOf(url) !== -1
    }
    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
        if (!isOauthReq(config.url)) {
            if (!isAuthed()) {
                login()
            } else {
                config.headers.Authorization = cookie.get('jwt')
                config.headers.tenantId = cookie.get('tenantId')
                config.headers.qpId = cookie.get('qpId')
            }
        }
        return config
    })
    axios.interceptors.request.use(function (config) {
        config.headers.Authorization = cookie.get('jwt')
        config.headers.tenantId = cookie.get('tenantId')
        config.headers.qpId = cookie.get('qpId')
        return config
    })
    axios.interceptors.response.use(function (res) {
        return res
    }, function (error) {
        const res = error.response;
        if (res.status === 401) {
            login()
        }
        return Promise.reject(error)
    })
}

export {
    login,
    logout,
    isAuthed
}
