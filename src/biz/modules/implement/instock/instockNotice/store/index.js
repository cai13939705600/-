import { pageListMerge, generateActions } from 'biz/store/helper'
import { uniqBy } from 'common/utils/lodash'

// 默认状态
const DEFAULTS = {
    entity: {},
    // 收货和上架弹窗的表头数据
    tableHeaderDate:{
        supplier: {}
    },
    //收货弹窗列表数据
    receivingGoodsDlg:[],
    //收货库位模糊查询数据
    locations:[],
    //上架库位模糊查询数据
    goLocations:[],
    //入库单明细(分页)数据
    inStockDetail:{},
    //收货明细（分页）数据
    receivingDetail:{},
    //待上架明细（分页）数据
    waitingPutData:{},
    //收货交易（分页）数据
    tradingData:{},
    //上架弹窗列表数据
    putDlgData:[],
    //单据类型---接口数据
    billTypes:[],
    //库存类型
    inventoryTypes:[],
    //仓库下拉列表
    storeList:[],
    //打印入库清单--数据
    printStockData:[],
    //打印入库验收单--数据
    printCheckData:[],
    //打印上架单--数据
    printPutawayData:[],
    // 项目列表
    projectList: [],
    //查询条件默认值
    query: {
        //stateList:[5,10,30,40],
        startDate: jt.date.getTodayZero(),
        endDate: jt.date.getTodayLast(),
        returnFlag: 0,
    },
    // 每页展示条数
    pageSize: 10,
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                 // 获取入库通知单列表
                 { key: 'queryList', callee: 'getInStockNoticeList' },
                 // 新建
                { key: 'createEntity', callee: 'createStock' },
                // 修改
                { key: 'updateEntity', callee: 'updateStock' },
                // 编辑详情
                { key: 'queryEntity', callee: 'getInstockById' },
                // 审核 
                { key: 'onExamineAction', callee: 'examine' },
                // 反审核 
                { key: 'onRejectAction', callee: 'reject' },
                // 取消订单 
                { key: 'cancleAction', callee: 'cancelAsn' },
                // 收货弹窗---列表请求
                { key: 'receivingGoodsDlgListAction', callee: 'receivingGoodsDlgList',mutation:'receivingGoodsDlgListDate' },
                //收货弹窗(和上架弹窗）---表头请求
                { key: 'receivingGoodsDlgHeaderAction', callee: 'receivingGoodsDlgHeader' ,mutation:'tableHeader'},
                //收货弹窗----保存弹窗
                { key: 'saveReceivingGoodsDlgAction', callee: 'saveReceivingGoodsDlg' },
                // 收货弹窗---收货库位模糊查询 
                { key: 'queryToLocationsAction', callee: 'queryToLocations' ,mutation:'toLocations'},
                // 一键收货
                { key: 'oneKeyReceivingAction', callee: 'oneKeyReceiving' },
                // 上架弹窗--列表数据请求
                { key: 'putDlgListAction', callee: 'putDlgList' ,mutation:'putDlg'},
                // 上架弹窗---目标库位模糊查询 
                { key: 'toLocationsAction', callee: 'queryToLocations' ,mutation:'targetLocations'},
                //上架----保存弹窗
                { key: 'savePutDlgAction', callee: 'savePutDlg' },
                // 一键上架
                { key: 'oneKeyRackAction', callee: 'oneKeyRack' },
                // 上架库位校验 
                { key: 'checkLocationAction', callee: 'checkLocation' },

                // 打印
                //打印--入库清单
                { key: 'printStockListAction', callee: 'printStockList' ,mutation:'printStock' },
                //打印--入库清单打印标记checkPrintFlagAction
                { key: 'checkPrintFlagAction', callee: 'checkPrintFlag' ,mutation:'printStock' },
                //打印--入库验收单
                { key: 'printCheckListAction', callee: 'printCheckList' ,mutation:'printCheck'},
                //打印--上架单
                { key: 'printPutawayListAction', callee: 'printPutawayList' ,mutation:'printPutaway'},
                // 强制完成
                { key: 'coerceFinishAction', callee: 'coerceFinish' },


                //单据类型接口
                { key: 'getBillTypesAction', callee: 'getBillTypes' ,mutation:'getTypes'},
                //库存类型
                { key: 'getInventoryTypes', callee: 'getInventoryTypes' ,mutation:'getInventory'},
                //仓库下拉列表 
                { key: 'getStoreListAction', callee: 'getStoreList' ,mutation:'getStores'},
            ]
        }),
        ...generateActions({
            caller: api.organize,
            items: [{
                key: 'queryProjectList', callee: 'queryListItem', mutation: 'updateProjectList'
            }]
        }),
    },
    mutations:{
        //根据入库单ID查找到的收货弹窗表头--数据
        tableHeader: (state, payload) => {
            if(payload.supplier === null){
                payload.supplier = { name:'' }
            }
            state.tableHeaderDate = payload
        },
        //根据入库单ID查找收货弹窗列表--数据
        receivingGoodsDlgListDate: (state,receDlg) => {
            //给列表数据加了个
            for (var i = 0; i < receDlg.length; i++) { 
                var myDate = new Date();
                const item = receDlg[i]
                item.showAdd = true;
                //receDlg[i].toLocation = 'stage';
                item.lotatt04 = jt.date.format(+new Date(myDate), 'yyyy-MM-dd')
                item.receivedQty = item.waitReceivedQty 
                item.lotatt05 = item.lotatt05Name
                item.lotatt02 = ''
                //判断项目名称是否存在，存在则展示，否则不展示
                if( item.itemId == 0) {
                    item.itemId = ''
                }
                //给每条数据加一个隐藏id
                item.id = i;
                }
            state.receivingGoodsDlg = receDlg
        },
        //收货库位模糊查询
        toLocations: (state,payload) => {
            state.locations = payload.records
        },
        //上架库位模糊查询
        targetLocations: (state,payload) =>{
            state.goLocations = payload.records
        },
        //根据入库单ID查找到的入库单明细（分页）数据
        inStockDetail:(state,stocks)=>{
            state.inStockDetail = stocks
        },
        //根据入库单ID查询收货明细（分页）数据
        receivingDetail:(state,receivings)=>{
            state.receivingDetail = receivings
        },
        //待上架任务明细（分页）数据
        waitingPutDetail:(state,waiting)=>{
            state.waitingPutData = waiting
        },
        //收货交易（分页）数据
        trading:(state,tradings)=>{
            state.tradingData = tradings
        },
        //上架弹窗--列表数据
        putDlg:(state,putaway)=>{
            //给列表数据加了个
            for (var i = 0; i < putaway.length; i++) { 
                putaway[i].showAdd = true; 
                putaway[i].putawayQty = putaway[i].waitPutawayQty;
                putaway[i].toLocation = putaway[i].planLocation;
                //给每条数据加一个隐藏id
                putaway[i].id = i; 
                }
            state.putDlgData = putaway
        },
        //单据类型接口
        getTypes:(state,payload)=>{
            state.billTypes=payload
        },
        //库存类型
        getInventory:(state,payload)=>{
            state.inventoryTypes=payload 
        },
        //仓库下拉列表
        getStores:(state,payload)=>{
            state.storeList=payload.records
        },
        //打印入库清单--数据
        printStock:(state,payload)=>{
            state.printStockData=payload
        },
        //打印入库验收单--数据
        printCheck:(state,payload)=>{
            state.printCheckData=payload
        },
        //打印上架单--数据
        printPutaway:(state,payload)=>{
            state.printPutawayData=payload
        },
        // 更新 项目列表数据
        updateProjectList (state, payload) {
            // 因为这里是冗余存储 所以去除名称重复的项目
            state.projectList = uniqBy(payload.records, (project) => {
                return project.name
            })
        }
   }
}, DEFAULTS)
