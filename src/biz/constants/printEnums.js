/**
 * 定义jcloud枚举类型
 */

export default {
      // 运单模板母版
      wayBillTemplate: {
            master: {
                  '签收联物流公司LOGO': 'logisticsCompanyLogoSigned',
                  '平台服务区': 'platformServiceArea',
                  '收件人信息': 'recipientInformation',
                  '寄件人信息': 'senderInformation',
                  '服务信息': 'ServiceInformation',
                  '签收说明': 'signedInstructions',
                  '签收区': 'signedArea',
                  '快递公司二维码': 'expressCompanyQRCode',
                  '留存联物流公司LOGO': 'logisticsCompanyLogoRetained',
                  '平台二维码': 'platformQRCode',
                  '商家自定义区': 'merchantCustomArea',

                  '寄件人': 'contactName2',
                  '寄件人联系电话': 'contactTel2',
                  '寄件人手机': 'contactTel2',
                  '寄件地址': 'contactRtnAdress',
                  '寄件全地址': 'contactRtnAdress',
                  '收件人': 'orderContactDto.contact',
                  '收件人联系电话': 'orderContactDto.tel',
                  '收件人手机': 'orderContactDto.phone',
                  '收件省': 'orderContactDto.province',
                  '收件市': 'orderContactDto.city',
                  '收件县(区)': 'orderContactDto.county',
                  '收件地址': 'orderContactDto.customerAddress1',
                  '收件全地址': 'orderContactDto.fullAddress',
                  '邮政编码': 'orderContactDto.zipCode',
                  '集包地代码': 'orderShipnoDto.packageCenterCode',
                  '集包地名称': 'orderShipnoDto.packageCenterName',
                  '大头笔': 'orderShipnoDto.shortAddress',
                  '面单号': 'wayBill',
                  '发件时间': 'printDate,date,yyyy-MM-dd',
                  '订单号': 'orderNo',
                  '拣货单号': 'pickingTaskNo',
                  '产品类型': 'orderShipnoDto.deliveryType',
                  '顺序号': 'displayNo',
                  '物料总数量': 'totalSkuQty',
                  '打印时间': 'printDate,date,yyyy-MM-dd',
                  '原寄地': 'orderShipnoDto.sendCode',
                  '目的地': 'orderShipnoDto.arriveCode',
                  '付款方式': 'orderShipnoDto.paymentType',
                  '卖家留言': 'sellerNotes',
                  '买家留言': 'notes',
                  '订单明细': 'orderDStr',
                  '订单金额': 'orderPrice',
                  '代收金额': 'receivable',
                  '店铺': 'shop',
                  '店铺地址': 'saledAddress',
                  '店铺联系人': 'saledContact',
                  '店铺电话': 'saledTel',
                  '包裹号': 'orderShipnoDto.packageNo',
                  '工作台': 'workBench',
                  '快递鸟markDestination': 'orderShipnoDto.kdNiaoOrder.markDestination',
                  '快递鸟originCode': 'orderShipnoDto.kdNiaoOrder.originCode',
                  '快递鸟originName': 'orderShipnoDto.kdNiaoOrder.originName',
                  '快递鸟destinatioCode': 'orderShipnoDto.kdNiaoOrder.destinatioCode',
                  '快递鸟destinatioName': 'orderShipnoDto.kdNiaoOrder.destinatioName',
                  '快递鸟sortingCode': 'orderShipnoDto.kdNiaoOrder.sortingCode',
                  '快递鸟packageCode': 'orderShipnoDto.kdNiaoOrder.packageCode',
                  '快递鸟packageName': 'orderShipnoDto.kdNiaoOrder.packageName',
                  '组波信息': 'combineWaveInfo',
                  '线路': 'distributionRoad',
                  '路区': 'shipnoExtDto.roadArea',
                  '站点编号': 'shipnoExtDto.printSiteNo',
                  '站点名称': 'shipnoExtDto.siteName',
                  '4PL运单号': 'orderShipnoDto.fourPlMailNo.',
                  '大头笔信息二段码': 'shipnoExtDto.bigTwoSegmentName',
                  '大头笔信息三段码': 'shipnoExtDto.bigThreeSegmentName',
                  '大头笔信息集包地名称': 'orderShipnoDto.packageCenterName',
                  '自提站点名称': 'shipnoExtDto.printSiteName',
                  '始发地分拣中心名称': 'shipnoExtDto.startStationName',
                  '始发地分拣中心编号': 'shipnoExtDto.startStationNo',
                  // '本地分拣中心道口':'shipnoExtDto.startCrossCode',
                  // '本地分拣中心笼车口':'shipnoExtDto.startCageNo',
                  '目的分拣中心名称': 'shipnoExtDto.targetDistriName',
                  '目的分拣中心编号': 'shipnoExtDto.targetDistriNo',
                  // '目的分拣中心道口':'shipnoExtDto.targetCrossCode',
                  // '目的分拣中心笼车口':'shipnoExtDto.endCageNo',
                  '时效类型名称': 'shipnoExtDto.agingName',
                  '中转地1分拣中心名称': 'shipnoExtDto.transitDepot1Name',
                  '中转地1分拣中心编号': 'shipnoExtDto.transitDepot1Code',
                  '中转地2分拣中心名称': 'shipnoExtDto.transitDepot2Name',
                  '中转地2分拣中心编号': 'shipnoExtDto.transitDepot2Code',
                  '中转地3分拣中心名称': 'shipnoExtDto.transitDepot3Name',
                  '中转地3分拣中心编号': 'shipnoExtDto.transitDepot3Code',
                  'ISV出库单号': 'channelsOrderNo',
                  '京配快运类型名称【仓配零担】': 'shipnoExtDto.transTypeName',
                  '订单是否验货': 'shipnoExtDto.isInspection,jcloudEnums,outbound.isInspection',
                  '应收金额': 'shipnoExtDto.amountReceivable',
                  '京配快运二维码': 'packageLineOrderNo',
                  '京配快运包裹号': 'packageNoForQuick',
                  '储位编码': 'locationNo',
                  '容器编码': 'containerNo'
            }
      },
      // 其它打印模板
      printTemplate: {
            billType: {
                  '1': '入库单',
                  '3': '拣货单',
                  '4': '购物清单',
                  '26': '移库任务单',
                  '2': '上架单',
                  '27': '出库单',
                  '28': '质检单',
                  '29': '养护单',
                  '30': '盘点单',
                  '31': '损耗单',
                  '12': '补货任务下架单',
                  '13': '补货任务上架单',
                  '14': '交接单',
                  // toB业务
                  '17': '箱签',
                  '18': '装箱清单',
                  '20': 'toB拣货单',
                  '21': 'toB出库单',
                  '22': 'toB入库单',
                  '23': 'toB按线路分拣单',
                  '24': 'toB按订单分拣单',
                  '32': '储位标签',
                  '33': '容器标签'
            },
            // 母版模板类型
            printMasterTemplateType: {
                  1: 'A4纸母版',
                  2: 'A5纸母版',
                  3: '热敏纸母版(w:10cm*h:18cm )',
                  4: '3联单纸母版(w:24cm*h:14cm )',
                  // toB业务
                  5: '热敏纸母版(w:8cm*h:9cm)',
                  6: '241-2纸'
            }
      },
      /**
       * 打印参数
       */
      jcloudPrintParam: {
            printNoNew: "printNoNew",
            taskType: "taskType",
            printParam: "printParam",
            taskUUID: "taskUUID",
            taskId: "taskId",
            printJobId: "printJobId",
            needChekJobId:"needChekJobId",


            isSys: "isSys",
            querytype: "querytype",
            querytype_enum: {
                 WAVE: 1,
                 PACKAGENOS: 2,
                 ORDERNOS: 3
            },
            carrierNoTemlpateMap: "carrierNoTemlpateMap",
            templateCode: "templateCode",
            billNos: "printBillNos",

            callBackObj: "callBackObj",

            callBack: "callBack",
            callBackArg: "callBackArgs",

            printCommitCallBack: "printCommitCallBack",
            printCommitCallBackArg: "printCommitCallBackArg",

            printErrorCallBack: "printErrorCallBack",
            printErrorCallBackArg: "printErrorCallBackArg",

            printSource: "printSource",
            printSource_enum: {
                waybill: 1,
                detail: 4
            },
            printType_enum: {
                waybill: 5,
                detail: 4
            },

            printTypeConfig_enum: {
                 waybill: 3,
                 detail: 1,
                 picking: 2
            },

            field: "field",

            template: "template",

            type: "type",
            type_enum: {
                 USE_FIELD: 1,
                 ONLY_TEMPLATE: 3
            },
            fieldValTemplateCodeMap: "fieldValTemplateCodeMap",
            fieldValTemplateMap: "fieldValTemplateMap",
            data: "data",
            printer: "printerName",
            printerIndex: "printerIndex",
            isGetDataByServer: "isGetDataByServer",

            documentName: "documentName",
            filedNameMap: "filedNameMap",
            printType: "printType",

            PlatformFlagEnums: {
                 PDDMD: 2,
                 CNMD: 1,
                 NOTHING: 0
            },
            intCopys : "intCopys",
            printObj:"printObj"
      }
}
