/**
 * 基础服务接口
 */

const config_enum = {
    prefix: '/ba/rest/api/enum',
    items: [
        { key: 'getEnum', url: '/search' }
    ]
}
const auth = {
    prefix: '',
    items: [
        { key: 'login', url: '/wms/loginAuth', cType: 3 }
    ]
}
const importExl = {
    prefix: '/ba/sku',
    items: [
        { key: 'batchImport', url: '/skuFileUpload' }
    ]
}

const systemParam={
    prefix: '/ba/rest/api',
    items: [
        { key: 'sysparameter', url: '/sysparameter/modifyWithTenant' },
        { key: 'getParameters', url: '/sysparameter/getParameters' },
    ]
}

export default {
    ...req.generate(config_enum),
    ...req.generate(auth),
    ...req.generate(importExl),
    ...req.generate(systemParam),
}
