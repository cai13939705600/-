/* eslint-disable no-multi-spaces */
import qs from 'qs'
import axios from 'axios'
import Cookies from 'js-cookie'
import Vue from 'vue'
/**
 * @interface Download 下载接口
 * @property {string} url 接口地址
 * @property {object} data 请求参数 
 */
/**
 * @param {Download}
 */
export const download = function ({ url, data }) {
    let that = this
    let jwt = Cookies.get('jwt');
    let tenantId = Cookies.get('tenantId');
    let qpId = Cookies.get('qpId');
    let t = new Date().getTime() 
    if (!jwt || !tenantId || !qpId) {
        return Vue.prototype.$alert('请重新登录', '登录失效', {
            confirmButtonText: '确定',
        });
    }
    Object.assign(data, {
        jwt,
        tenantId,
        qpId,
        t
    })
    const params = qs.stringify(data)
    axios.get(`${url.slice(4)}?${params}`)
        .then(function (response) {
            if (response&&response.data&&response.data.head&&response.data.head.code ==201) {
                return  Vue.prototype.$message.success(response.data.head.subMessage)
            }
            const body = document.body;
            const a = document.createElement('a')
            a.href = `${url}?${params}`
            a.target = '_blank'
            // a.download = `${(Math.random() * 10000000000000000).toString()}.xsls`
            body.appendChild(a);
            a.click()
            let timer = setTimeout(() => {
                body.removeChild(a);
                clearTimeout(timer);
                timer = null;
            }, 100);
        })
       .catch(function (error) {
        return  Vue.prototype.$message.success(error.data.head.subMessage)
    });
    
}
/**
 * @interface options 下载接口
 * @property {string} path [预览路径]  
 */
/**
 * @function preview
 * @description 预览 打印
 * @param {options}
 */
export const preview = function ({ url, data }) {
    let jwt = Cookies.get('jwt');
    let tenantId = Cookies.get('tenantId');
    let qpId = Cookies.get('qpId');
    if (!jwt || !tenantId || !qpId) {
        return Vue.prototype.$alert('请重新登录', '登录失效', {
            confirmButtonText: '确定',
        });
    }
    if (url) {
        window.open(url + '?' + qs.stringify(
            Object.assign({
                jwt,
                tenantId,
                qpId
            }, data),
            {
                indices: false
            }
        ));
    } else {
        console.warn('预览 路径不存在')
    }
}
