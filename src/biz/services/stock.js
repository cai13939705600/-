/**
 * 出库模块请求
 */
const notice = {
    prefix: '/wo/rest/api',
    items: [
        // 获取出库通知单列表
        { key: 'getOutStockNoticeList', url: '/do/searchByPage' },
        // 创建出库单
        { key: 'createStockNotice', url: '/do/insert' },
        // 更新出库单
        { key: 'updateStockNotice', url: '/do/update' },
        // 取消出库
        { key: 'cancelStockNotice', url: '/do/cancel' },
        // 自动分配 
        { key: 'autoAllocate', url: '/do/autoAllocate' },
        // 审核
        { key: 'checkStockNotice', url: '/do/check' },
        // 反审核
        { key: 'checkBackStockNotice', url: '/do/checkBack' },
        // 出库通知单明细查询
        { key: 'getDoDetailList', url: '/dodetail/getDoDetailList' },
        // 分配明细信息查询
        { key: 'getAllocatedetail', url: '/allocatedetail/searchByPage' },
        // 根据出库单ID查询出库单和明细信息
        { key: 'getDoInfoById', url: '/do/getDoInfoById' },
        // 手工分配
        { key: 'manualAllocate', url: '/do/manualAllocate' },
        //出库单明细查询
        { key: 'queryDoDetail', url: '/dodetail/searchByPage' },
        //设备异常出库查询列表
        { key: 'exOutSearchByPage', url: '/rfdo/exOutSearchByPage' },
    ]
}

const picking = {
    prefix: '/wo',
    items: [
        // 查询
        { key: 'getPickTicketList', url: '/pickTicket/getPickTicketList' },
        // 整单确认收货
        { key: 'confirmPicking', url: '/pickTicket/wholeFinishPicking' },
        // 拣货任务查询
        { key: 'getPickingDetailTaskList', url: '/pickingTask/queryPickingTaskList' },
        //拣货任务分页查询
        { key: 'queryPickingTask', url: '/pickingTask/searchByPage' },
    ]
}
// 分配明细
const allocation = {
    prefix: '/wo/rest/api/allocatedetail',
    items: [
        // 分配明细信息查询
        { key: 'allocateDetail', url: '/searchByPage' },
        // 明细确认拣货
        { key: 'confirmPick', url: '/detailPickConfirm' },
        // 分配回退
        { key: 'allocateBack', url: '/allocateBack' },
        // 拣货回退
        { key: 'pickBack', url: '/pickBack' },
        // 缺量拣货
        { key: 'shortagePicking', url: '/lackDetailPickConfirm' }
    ]
}
// 分配明细
const allocation_1 = {
    prefix: '/wi/rest/api',
    items: [
        // 根据物料查询库存
        { key: 'getStocksBySku', url: '/wmsstock/getStocksBySku' },
        //+出库--新建库存查询弹窗
        { key: 'getCollectStocksBySku', url: '/wmsstock/getCollectStocksBySku' },
        //账务库存分页查询
        { key: 'getListByPage', url: '/stockFinance/listByPage' },
        //账务库存项目调整
        { key: 'adjustByItemName', url: '/stockFinance/adjustByItemName' },
        //金额调整
        { key: 'adjustByPrice', url: '/stockFinance/adjustByPrice' },
        //全量账务库存查询
        { key: 'querylistAll', url: '/stockFinance/listAll' },
    ]
}

const billType = {
    prefix: '/wo/rest/api/do',
    items: [
        // 获取单据类型
        { key: 'getBillTypeList', url: '/getBillTypes' },
        //出库单查询接口
        { key: 'queryOutStockList', url: '/searchByPage' },
    ]
}

const at = {
    prefix: '/inventory',
    items: [
        // 查询库存
        //{ key: 'quertStockList', url: '/queryStockReport.do' },
        // 移库
        // { key: 'moveStock', url: '/oneStepMove.do' },
        // 批次调整
        // { key: 'batchChangeStock', url: '/oneStepTransfer.do' },
        // 盈亏调整
        { key: 'profitChangeStock', url: '/oneStepAdjust.do' },
        // 冻结
        // { key: 'freezeStock', url: '/oneStepFrozen.do' },
        // 释放
        // { key: 'releaseStock', url: '/oneStepRelease.do' },
        // 库存报表查询
        // { key: 'queryStockExcel', url: '/queryStockReport.do' },
        // 库存事务查询
        // { key: 'queryStockTransaction', url: '/queryStockTransactionReport.do' },
        // 库存汇总查询
        // { key: 'querySummary', url: '/queryGroupStockReport.do' },
         // 打印
        { key: 'printStock', url: '/printStock.do' }
    ]
}

/**
 * 入库模块请求
 */
const inStock= {
    prefix: '/wi',
    items: [
        /* 入库通知单 */
        // 根据条件查询入库单列表（分页）
        { key: 'getInStockNoticeList', url: '/asn/searchAsnHeaderListWithPg' },
        // 根据入库单ID查找入库单明细（分页）
        { key: 'getInStockDetailList', url: '/asn/searchAsnDetailListWithPage'},
        //查询收货明细列表(分页)
        { key: 'getReceivingDetailList', url: '/receiving/searchReceivingRecordDetailListWithPage' },
        //根据入库单ID查找待上架明细(分页)
        { key: 'waitingPut', url: '/putaway/searchPutawayTaskDetailLisWithPage' },
        // 入库操作日志（分页）
        { key: 'receivingTrading', url: '/asn/searchTransaction'},
        // 新建 
        { key: 'createStock', url: '/asn/createAsn' },
        // 修改
        { key: 'updateStock', url: '/asn/modifyAsn' },
        // 修改详情展示
        { key: 'getInstockById', url: '/asn/getAsnByIdForUpdate' , method:'get'  },
        // 审核 
        { key: 'examine', url: '/asn/confirmAsn'},
        // 反审核 
        { key: 'reject', url: '/asn/unconfirmAsn'},
        // 取消订单 
        { key: 'cancelAsn', url: '/asn/cancelAsn' },
        //收货弹窗---表头请求
        { key: 'receivingGoodsDlgHeader', url: '/asn/getAsnById', method:'get' ,cType: 3 },
        // 收货---弹出框列表请求
        { key: 'receivingGoodsDlgList', url: '/receiving/searchReceivingRecordDetailList', method:'get' , cType:3 },
        //收货----保存收货弹窗
        { key: 'saveReceivingGoodsDlg', url: '/receiving/saveReceivingDetails'},
        //一键收货
        { key: 'oneKeyReceiving', url: '/receiving/saveReceivingByAsnIds' },
        //上架---弹窗列表数据请求
        { key: 'putDlgList', url: '/putaway/searchWaiteTaskDetailList', method:'get' ,cType:3 },
        // 上架---保存
        { key: 'savePutDlg', url: '/putaway/savePutawayDetails' },
        //一键上架
        { key: 'oneKeyRack', url: '/putaway/savePutawayByAsnId' },
        // 强制完成
        { key: 'coerceFinish', url: '/asn/coerceFinish' },
        // 导入电力入库单
        { key: 'importEl', url: '/asn/import/elAsnFileUpload' },


        // 根据入库单ID查找上架任务明细
        { key: 'searchPutawayTaskDetailList', url: '/putawayController/searchPutawayTaskDetailList' },

        // 打印
        //打印---入库清单
        { key: 'printStockList', url: '/printController/printAsnList' },
        //打印--入库清单打印标识  checkPrintFlag
        { key: 'checkPrintFlag', url: '/asnController/printFlag' },
        //打印--入库验收单
        { key: 'printCheckList', url: '/printController/printReceivingList' },
        //打印---上架单
        { key: 'printPutawayList', url: '/printController/printPutawayTaskList' },


        { key: 'getBillTypes', url: '/billTypeController/getBillTypes' },
        //盘点单查询
        { key: 'queryInvStock', url: '/stocktaking/invStockCouHeaderPage' },
        //盘点单明细查询
        { key: 'queryInvStockDetail', url: '/stocktaking/invStockCouDetailGatherPage' },
        //获取盘点单号
        { key: 'getCountNo', url: '/stocktaking/getCountNo' ,method:'get'},

        /* 取消收货 */

        //获取取消收货列表
        { key: 'getCancleGoodsList', url: '/receiving/findCanCancelRecordList' },
        //选择列表--取消收货按钮
        { key: 'cancleGoods', url: '/receiving/cancelReceivingRecordDetailByIds' },
        //盘点单创建前校验接口
        { key: 'addInventerBeforeCheck', url: '/stocktaking/checkAddInvStockCouHeader' },
        //盘点单创建
        { key: 'addInventer', url: '/stocktaking/addInvStockCouHeader' },
        //盘点单修改
        { key: 'editInventer', url: '/stocktaking/editInvStockCouHeader' },
        //盘点单详情单条明细查询
        { key: 'getPanDianDoInfoById', url: '/stocktaking/getInvStockCouHeader' },
        //盘点单明细列表查询
        { key: 'getInvAllDetail', url: '/stocktaking/invStockCouDetailGatherPage' },
        //盘点单明细删除
        { key: 'deleteInvDetail', url: '/stocktaking/delInvStockCouDetail' },
        //盘点单发布前校验接口
        { key: 'checkPublish', url: '/stocktaking/checkPublishInvStockCouHeader' },
        //盘点单发布
        { key: 'publishInvStock', url: '/stocktaking/publishInvStockCouHeader' },
        //盘点单取消发布
        { key: 'canclePublishInvStock', url: '/stocktaking/cancelPublishInvStockCouHeader' },
        //盘点取消
        { key: 'cancelStockInv', url: '/stocktaking/cancelInvStockCouHeader' },
        //盘点完成
        { key: 'finishedStockInv', url: '/stocktaking/checkFinishInvStockCouHeader' },
        //盘点完成后续接口
        { key: 'finishedStockInvNest', url: '/stocktaking/finishInvStockCouHeader' },
        //盘点明细添加
        { key: 'addInvStockCouDetail', url: '/stocktaking/addInvStockCouDetail' },
        //盘点库存查询
        { key: 'queryStockPage', url: '/stocktaking/queryStockPage' },
        //盘点单增补
        { key: 'augmentInvStockCouDetail', url: '/stocktaking/augmentInvStockCouDetail' },
        //盘点单登记
        { key: 'recordInvStockCouDetail', url: '/stocktaking/recordInvStockCouDetail' },
        //库存调整
        { key: 'profitChangeStock', url: '/inventory/oneStepAdjust' },

        //物料获取 批次规则
        { key: 'queryLotRulesBySku', url: '/inventory/querySkuLotAttrRule', method: 'get' },
        //批次属性显示
        { key: 'queryLotAttrs', url: '/inventory/querySkuLotAttrRule' },
        //设备库存结果查询
        { key: 'queryInvStockDevice', url: '/stockDeviceDiff/invStockDeviceDiffPage' },
        //自动盘点
        { key: 'autoPandian', url: '/stockDiff/manualCount' },
        //账务差异审核 详情
        { key: 'stockFinanceDiff', url: '/stockFinanceDiff/detailAudit' },
        //账务差异审核 保存
        { key: 'auditDiff', url: '/stockFinanceDiff/auditDiff' },
    ]
}
     /* 入库报表模块请求 */
    const report = {
        prefix: 'wms/in/reportController',
        items:[
        //获取入库单查询报表
        { key: 'getInStockQueryReport', url: '/asnReportWithPage' },
        //获取入库单明细查询报表
        { key: 'getInStockDetailQueryReport', url: '/asnDetailReportWithPage' },
        //获取收货汇总报表
        { key: 'getReceivingSummaryReport', url: '/receivingSummaryListWithPage' },
        ]
    }
    const type = {
        prefix: '/ba',
        items:[
        //单据类型接口
        { key: 'getBillTypes', url: '/billTypeController/getBillTypes' },
        ]
    }
    const types = {
        prefix: '/ba/rest/api',
        items:[
        //单据类型接口
        { key: 'getInventoryTypes', url: '/inventoryType/getAvailableInventoryTypes' },
        //库位模糊查询
        { key: 'queryToLocations', url: '/location/getLocationCode'},
        // 仓库下拉列表 (出入库新建仓库下拉列表)
        { key: 'getStoreList', url: '/warehouse/searchByPage'},
        // 货主下拉列表 
        { key: 'getOwnerList', url: '/storer/getStorerList'},
        // 报表查询条件仓库下拉列表(只可查账户绑定的仓库) 
        { key: 'getWareHouseList', url: '/warehouse/selectCurrentUserWarehouseList'},
        // 库存状态 
        { key: 'stockState', url: '/inventoryType/getAvailableInventoryTypes'},
        // 上架库位校验 
        { key: 'checkLocation', url: '/location/locationCodeValidCheck'},
        ]
    }

    const StockReports = {
        prefix: '/wi',
        items:[
            // 库存报表查询
            { key: 'queryStockExcel', url: '/inventory/queryStockReport' },
            //全量库存查询
            { key: 'queryAllStockExcel', url: '/inventory/queryTotalStock' },
            // 查询库存
            // { key: 'quertStockList', url: '/inventory/queryStockReport' },
            // 库存汇总查询
            { key: 'querySummary', url: '/inventory/queryGroupStockReport' },
             // 库存事务查询
            { key: 'queryStockTransaction', url: '/inventory/queryStockTransactionReport' },
            //到处库存报表
            { key: 'exportStock', url: '/inventory/exportStockTransactionReportExcel',method:'get' },
            // 移库
            { key: 'moveStock', url: '/inventory/oneStepMove' },
            // 批次调整
            { key: 'batchChangeStock', url: '/inventory/oneStepTransfer' },
            // 冻结
            { key: 'freezeStock', url: '/inventory/oneStepFrozen' },
            // 释放
            { key: 'releaseStock', url: '/inventory/oneStepRelease' },
            // 差异中心分页查询列表
            { key: 'queryDifference', url: '/stockDiff/invStockDiffPage' },
            //差异审核
            { key: 'diffEdit', url: '/stockDiff/auditInvStockDiff' },
            //库存管理列表
            { key: 'quertStockList', url: '/inventory/queryInventoryList' }
        ]
    }
    const print = {
        prefix: 'wms/in',
        items:[
            // 入库打印上架单
            { key: 'printPutawayTaskList', url: '/printController/printPutawayTaskList' ,method:'get' }
        ]
    }
    
export default {
    ...req.generate(notice),
    ...req.generate(picking),
    ...req.generate(allocation),
    ...req.generate(allocation_1),
    ...req.generate(billType),
    ...req.generate(at),
    ...req.generate(inStock),
    ...req.generate(type),
    ...req.generate(types),
    ...req.generate(StockReports),
    ...req.generate(report),
    ...req.generate(print)
}
