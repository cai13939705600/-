<template>
    <div class="p-home" @click="clickItem" >
        <ul class="warehouse">
            <li id="ware_house" @mouseover="hoverItem"  :class="{active:hoverActive=='ware_house'?true:false}">仓库</li>
            <li id="item" @mouseover="hoverItem" :class="{active:hoverActive=='item'?true:false}">物料</li>
        </ul>
        <ul class="right_mgt">
            <li id="right" @mouseover="hoverItem" :class="{active:hoverActive=='right'?true:false}">权限</li>
            <li id="system" @mouseover="hoverItem" :class="{active:hoverActive=='system'?true:false}">系统参数</li>
        </ul>
        <ul class="in_stock">
            <li id="in_stock_order" @mouseover="hoverItem" :class="{active:hoverActive=='in_stock_order'?true:false}">入库单</li>
            <li id="get_data" @mouseover="hoverItem" :class="{active:hoverActive=='get_data'?true:false}">收货</li>
            <li id="put_des" @mouseover="hoverItem" :class="{active:hoverActive=='put_des'?true:false}">上架</li>
        </ul>
        <ul class="out_stock">
            <li id="out_stock_order" @mouseover="hoverItem" :class="{active:hoverActive=='out_stock_order'?true:false}">出库单</li>
            <li id="distribution" @mouseover="hoverItem" :class="{active:hoverActive=='distribution'?true:false}">分配明细</li>
            <li id="pick_list" @mouseover="hoverItem" :class="{active:hoverActive=='pick_list'?true:false}">拣货单</li>
        </ul>
        <ul class="at_stock">
            <li id="Stock" @mouseover="hoverItem" :class="{active:hoverActive=='Stock'?true:false}">库存</li>
            <li id="displacement" @mouseover="hoverItem" :class="{active:hoverActive=='displacement'?true:false}">移位</li>
        </ul>
        <ul class="inventer_order">
            <li id="inventory" @mouseover="hoverItem" :class="{active:hoverActive=='inventory'?true:false}">盘点</li>
            <li id="difference_center" @mouseover="hoverItem" :class="{active:hoverActive=='difference_center'?true:false}">差异中心</li>
        </ul>
        <ul class="bottom_item">
            <li id="basic_data" ><img id="basic_data_img" :src="basic_select_img" alt=""></li>
            <li id="warehousing"  :class="{active1:hoverActive=='warehousing'?true:false}">入库</li>
            <li id="out_of_stock"  :class="{active1:hoverActive=='out_of_stock'?true:false}">出库</li>
            <li id="in_library" ><img id="in_library_img" :src="at_stock_img" alt=""></li>
        </ul>
        <div class="item_detail">
            <div v-show="hoverActive=='ware_house'">
                <h1>仓库</h1>
                <p>公司下设仓库，仓库指对物品储存、保管保养，装卸搬运、分拣包装等。UWS系统支持多仓库作业。
                    <br/>
                    库区：即把仓库划按功能性分为多个区域，UWS系统中一个仓库能划分多个库区。
                    <br/>
                    库位：储位是仓库内的最小存储单位，由列和层共同定位，实现最小单元管理，便于存储和拣选。
                </p>
            </div>
            <div v-show="hoverActive=='item'">
                <h1>物料</h1>
                <p>物料管理功能用于对货主的物料进行统一管理，定义物料的编码、规格、包装以及预警期等信息。
                    <br/>
                    UWS与传统UWS不同之处在于，还需要对新入库物料进行机器学习，用于上架和拣货时作图像识别。
                </p>
            </div>
            <div v-show="hoverActive=='right'">
                <h1>权限</h1>
                <p>权限：分为角色和账号。
                    <br/>
                    角色模块：可以理解为业务中的工作岗位。不同岗位的人对系统有不同的作业权限职责范围。角色管理模块负责对用户岗位进行设置、功能授权以及数据授权等操作。
                    <br/>
                    账号模块：负责对操作系统的用户进行管理，包括用户新增、修改、删除、授权等操作。

                </p>
            </div>
            <div v-show="hoverActive=='system'">
                <h1>系统参数</h1>
                <p>系统中用户根据业务需求自定义一些参数，在部分流程上实现控制。</p>
            </div>
            <div v-show="hoverActive=='in_stock_order'">
                <h1>入库单</h1>
                <p>入库通知单是货主在将物料发运到仓库前，提前给仓库下达的物料预计到货通知。在这个功能模块中，软件提供了对入库通知单的查询、新建、修改、审核、取消审核、收货、上架，打印等一系列的操作。退货入库单操作同普通入库通知单类似。</p>
            </div>
            <div v-show="hoverActive=='get_data'">
                <h1>收货</h1>
                <p>操作员可根据收货的实际信息来进行收货确认的相关操作。UWS系统支持PC端的收货，一键收货，同时也支持移动端收货，快速收货操作。
                    <br/>
                    对于需要用RFID管理的物料，可在收货同时绑定RFID。
                </p>
            </div>
            <div v-show="hoverActive=='put_des'">
                <h1>上架</h1>
                <p>收货完成后对物料进行上架到实际库位的操作。UWS在收货后自动创建上架任务，操作员可在PC或移动端做实物上架操作。</p>
            </div>
            <div v-show="hoverActive=='out_stock_order'">
                <h1>出库单</h1>
                <p>有业务出库需求时，货主向仓库下达的出仓指令。在UWS系统中新建或者由上游ERP系统下发出库单据，这个功能模块，系统提供了新建，修改，审核，反审核，取消，分配等一系列操作功能。</p>
            </div>
            <div v-show="hoverActive=='distribution'">
                <h1>分配明细</h1>
                <p>系统分配库存后，可在该模块查询分配的具体信息，包括数量，库位，批次等。支持手工分配，和按分配规则自动分配。</p>
            </div>
            <div v-show="hoverActive=='pick_list'">
                <h1>拣货单</h1>
                <p>出库通知单分配后，会自动产生拣货单，操作员可在PC或者移动端操作拣货任务。
                在UWS中，可以做到在重力感应货架和图像识别基础上，即拿即走，则完成一张拣货单的拣货任务操作。
                </p>
            </div>
            <div v-show="hoverActive=='Stock'">
                <h1>库存</h1>
                <p>库存，记录着仓库中不同货主不同物料批次在不同库位上的库存数量，以及这些物料的业务单据号、物料状态、入库日期等各个关键信息。
                本模块支持移库，批次调整，冻结，释放、库存查询、库存汇总查询、库存日志查询等一系列操作。
                </p>
            </div>
            <div v-show="hoverActive=='displacement'">
                <h1>移位</h1>
                <p>当仓库管理人员发现库位上的物料放置需要调整时，可以直接对物料进行人工移位整理，并将移位情况记录下来。可在PC或者移动端做物料移位操作。</p>
            </div>
            <div v-show="hoverActive=='inventory'">
                <h1>盘点</h1>
                <p>仓库在运作过程中，由于货物保管不善或作业人员问题等原因，可能会导致库存中的实物数量与系统账务上的数量不一致。因此仓库每隔一定的时间，就会发起对仓库中货物的盘点任务。随时核对仓库中货品库存的正确性。</p>
            </div>
            <div v-show="hoverActive=='difference_center'">
                <h1>差异中心</h1>
                <p>所有的库存差异均在差异中心中生成，经过审核后，对于差异数量进行核销。</p>
            </div>
            <div v-show="hoverActive=='basic_data_img'">
                <h1>基础数据</h1>
                <p>所有的库存差异均在差异中心中生成，经过审核后，对于差异数量进行核销。</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import './styles/index.scss'
import at_stock_default from '../../imgs/at_stock_default.png'
import at_stock_select from '../../imgs/at_stock_select.png'
import basic_select from '../../imgs/basic_select.png'
import basic_default from '../../imgs/basic_default.png'
import Bus from 'common/utils/bus'

const env = process.env

export default {
    computed: {
        ...mapState('app', [ 'rcMap' ])
    },
    data () {
        return {
            hoverActive:'ware_house',
            basic_select_img:basic_default,
            at_stock_img:at_stock_default,
        }
    },
    watch:{
        'hoverActive' (val){
            if(val == 'basic_data_img'){
                this.basic_select_img = basic_select
            }else{
                this.basic_select_img = basic_default
            }
            if(val == 'in_library_img'){
                this.at_stock_img = at_stock_select
            }else{
                this.at_stock_img = at_stock_default
            }
        }
    },
    mounted () {
        debugger
    },
    methods: {
        //hover实践
        hoverItem (e) {
            if(e.target.id){
                this.hoverActive = e.target.id
            }else{
                return
            }
            
        },
        //点击事件
        clickItem (e) {
            debugger
            console.log('点击',e)
            var it = e.target.id
            if (!it){
                return
            }else{
                switch(it){
                    case 'ware_house': this.onSelect(it,'ba.wh.warehouse')
                    break;
                    case 'item': this.onSelect(it,'ba.sku.manage')
                    break;
                    case 'right': this.onSelect(it,'ba.authority.user')
                    break;
                    case 'system': this.onSelect(it,'ba.sysparam.manage')
                    break;
                    case 'in_stock_order': this.onSelect(it,'wi.inbound.asn')
                    break;
                    case 'get_data': this.onSelect(it,'wi.inbound.asn')
                    break;
                    case 'put_des': this.onSelect(it,'wi.inbound.asn')
                    break;
                    case 'out_stock_order': this.onSelect(it,'wo.outbound.do')
                    break;
                    case 'distribution': this.onSelect(it,'wo.outbound.allodetail')
                    break;
                    case 'pick_list': this.onSelect(it,'wo.outbound.pick')
                    break;
                    case 'Stock': this.onSelect(it,'wi.invmagr.stockmag')
                    break;
                    case 'displacement': this.onSelect(it,'wi.invmagr.stockmag')
                    break;
                    case 'inventory': this.onSelect(it,'wi.invmagr.cou')
                    break;
                    case 'difference_center': this.onSelect(it,'wi.invmagr.diff')
                    break;
                }
            }
        },
        onSelect (id,path) {
            this.hoverActive  = id
            Bus.$emit('openAndSelectByCode', path);
        },
    }
}
</script>

