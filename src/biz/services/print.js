/**
 * 出库模块请求
 */

const print = {
    prefix: '/ba/printTemplate',
    items: [
        // 打印模板查询 分页
        { key: 'queryPrintTemplateByPage', url: '/queryPrintTemplateByPage' },
        // 打印模板查询
        { key: 'queryPrintTemplate', url: '/queryPrintTemplate' },
        // 新增打印模板
        { key: 'addPrintTemplate', url: '/addPrintTemplate' },
        // 修改打印模板
        { key: 'updatePrintTemplate', url: '/updatePrintTemplate' },
        // 删除打印模板
        { key: 'deletePrintTemplate', url: '/deletePrintTemplate' },
        // 上传
        { key: 'uploadTemplateFile', url: '/uploadTemplateFile.do' },
        // 下载
        { key: 'exportPrintTemplateContent', url: '/exportPrintTemplateContent' },
        // 获取模板内容
        { key: 'getPrintTemplateContent', url: '/queryPrintTemplateContent' },
    ]
}

const config = {
    prefix: '/ba/printConfig',
    items: [
        // 查找打印机设置 分页
        { key: 'queryPrintConfigByPage', url: '/queryPrintConfigByPage' },
        //查找打印机设置
        { key: 'queryPrintConfig', url: '/queryPrintConfig' },
        // 新建打印机设置
        { key: 'addPrintConfig', url: '/addPrintConfig' },
        // 修改打印机设置
        { key: 'editPrintConfig', url: '/modifyPrintConfig' },
        // 删除打印机设置
        { key: 'deletePrintConfig', url: '/deletePrintConfig' },
        
    ]
}

export default {
    ...req.generate(print),
    ...req.generate(config),
}
