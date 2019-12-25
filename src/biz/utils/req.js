import axios from 'axios'
import qs from 'qs'
import 'biz/utils/oauth'

const CONTENT_TYPES = {
    1: 'application/json',
    2: 'multipart/form-data',
    3: 'application/x-www-form-urlencoded'
}

// 设置默认请求地址前缀
axios.defaults.baseURL = process.env.VUE_APP_API_PREFIX

/**
 * 异常捕获
 * @param {Object} error
 */
function catchFn (error) {
    const data = _.get(error, 'response.data.head') || {}
    if (data.subCode === 'auth:unauthorized') {
        oauth.login()
    }
    return {
        code: data.code || '-1',
        subCode: data.subCode || '-1',
        message: data.message || error.message,
        subMessage: data.subMessage || error.message
    }
}

export function get (url, options = {}) {
    const opts = {
        url,
        method: 'get',
        params: options.data
    }
    return axios(opts).then(function ({ data }) {
        return data
    }).catch(catchFn)
}

export function post (url, options = {}) {
    if (!options.cType) {
        options.cType = 1
    }
    const opts = Object.assign({
        url,
        method: 'post',
        data: options.data
    }, options)
    if (options.cType === 2) {
        opts.headers = { 'Content-Type': CONTENT_TYPES[options.cType] }
    } else if (options.cType === 3) {
        opts.data = qs.stringify(options.data)
        opts.headers = { 'Content-Type': CONTENT_TYPES[options.cType] }
    }
    return axios(opts).then(function ({ data }) {
        return data
    }).catch(catchFn)
}

export function ajax (method, url, options) {
    if (method === 'get') {
        return get(url, options)
    } else {
        return post(url, options)
    }
}

export function generate (config) {
    const map = {}
    const items = config.items
    for (let i = 0, len = items.length; i < len; i++) {
        map[items[i].key] = function (data, options) {
            return ajax(
                items[i].method || 'post',
                (items[i].prefix || config.prefix || '') + items[i].url,
                { data, ...(_.omit(items[i], ['key', 'url', 'method']) || {}), ...options }
            )
        }
    }
    return map
}
