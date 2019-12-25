<template>
    <div class="roleInfo roleInfo-dialog">
        <div class="entity-dlg__block roleInfo-l">
            <div class="entity-dlg__block-hd">
                <span class="entity-dlg__hd-line"></span>
                <span class="entity-dlg__hd-title">角色信息</span>
            </div>
            <div class="entity-dlg__block-bd">
                <el-form
                    :model="dto"
                    label-width="100px"
                    ref="form"
                >
                    <el-form-item
                        label="角色类型"
                        label-width="102px"
                        prop="type"
                    >
                        <el-select
                            v-model="dto.type"
                            filterable
                            :disabled="true"
                            placeholder="请选择">
                            <el-option
                                v-for="item in ROLE_TYPE.array"
                                :key="item.enumCode"
                                :label="item.enumValueCn"
                                :value="item.enumCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="角色名称"
                        prop="name"
                    >
                        <el-input :disabled="true" v-model="dto.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="备注"
                        prop="remarks"
                    >
                        <el-input :disabled="true" v-model="dto.remarks"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="entity-dlg__block roleInfo-r">
            <div class="entity-dlg__block-hd">
                <span class="entity-dlg__hd-line"></span>
                <span class="entity-dlg__hd-title">{{ dto.type === 2 ? '功能角色' : '数据角色' }}</span>
            </div>
            <div v-if="dto.type === 2" class="entity-dlg__block-bd">
                <div class="roleInfo-r overflow">
                    <el-tree
                        ref="tree"
                        :data="state.treeData"
                        show-checkbox
                        node-key="id"
                        :default-expand-all="true"
                        :default-expanded-keys="state.entity.resourceIds"
                        :default-checked-keys="state.entity.resourceIds"
                        :props="{ children: 'children', label: 'name', disabled: isDisabled }"
                    >
                    </el-tree>
                </div>
            </div>
            <div v-else  class="entity-dlg__block-bd">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <div class="sub-title">仓库</div>
                      <!--  <el-input
                            @input="updateSearchWare"
                            v-model="wareHourse"
                            placeholder="请输入关键词"></el-input>-->
                        <ul>
                            <li v-for="role in searchWareListEdit"
                                :class="{ 'active': role.choosed }"
                                v-show="role.choosed"
                                :key="role.id">
                                {{ role.name }}
                            </li>
                        </ul>
                    </el-col>
                    <el-col :span="8">
                        <div class="sub-title">库区</div>
                      <!--  <el-input
                            @input="updateSearchWare"
                            v-model="wareHourse"
                            placeholder="请输入关键词"></el-input>-->
                        <ul>
                            <li v-for="role in editZoneList"
                                :class="{ 'active': role.choosed }"
                                v-show="role.choosed"
                                :key="role.id">
                                {{ role.name }}
                            </li>
                        </ul>
                    </el-col>
                    <el-col :span="8">
                        <div class="sub-title">货主</div>
                        <!--<el-input
                            @input="updateSearchStore"
                            v-model="store"
                            placeholder="请输入关键词"></el-input>-->
                        <ul ref="li">
                            <!-- v-show="role.choosed"-->
                            <li v-for="role in searchStoreListEdit"
                                v-show="role.choosed"
                                :class="{ 'active': role.choosed }"
                                :key="role.id">
                                {{ role.name }}
                            </li>
                        </ul>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import EntityDialog from 'biz/mixins/entityDialog'
    import { removeEmptyAttr } from 'common/utils/tools'

    export default {
        props: {
            state: Object,
            ROLE_TYPE: Object,

        },
        mixins: [ EntityDialog ],
        computed: {
            ...mapGetters('master/role', ['searchStoreList', 'searchWareList'])
        },
        data(){
            return{
                wareHourse: '',
                store: '',
                shop: '',
                //默认显示功能角色设置
                showRole: true,
                searchWareListEdit:[],//仓库回显
                searchStoreListEdit:[],//货主回显
                editZoneList:[]//库区回显
            }
        },
        beforeCreate () {
            this.allFields = []
            this.disFields = []
        },
        created () {
            this.getMenuList({params: {},
                cb: (head, body) => {
                    //   this.searchWareList=body
                    this.addHistroyData()
                },
            })
            this.getStorerList({params: {},
                cb: function(head, body){
                    //this.searchStoreList=body
                },
            })
            this.getWareHouseList({params: {},
                cb: (head, body) => {
                    //   this.searchWareList=body
                },
            })

        },
        watch: {
            'state.entity': function (n) {
                switch (n.type) {
                    case 1:
                        this.showRole = false
                        break;
                    case 2:
                        this.showRole = true
                    default:
                        break;
                }
                this.addHistroyData()
                if (this.$refs.tree) {
                    this.$refs.tree.setCheckedKeys(n.resourceIds || [])
                }
            },
            'state.wareHouseIdList' (n){
                if(n){
                    this.getZoneList({params: {
                        warehouseIdList:this.state.wareHouseIdList
                    }})
                }
            },
            'state.wareHouseList' (n){
                if(n){
                   let warehouseIds=_.cloneDeep(this.state.entity.warehouseIds)
                    if(warehouseIds){
                        warehouseIds= warehouseIds.map(id => {
                            return id
                        })
                        // this.searchWareListEdit=_.cloneDeep(this.searchWareList)
                        let searchWareListEdit=_.cloneDeep(this.state.wareHouseList.list)
                        for(let i=0;i<warehouseIds.length;i++){
                            for(let j=0;j<searchWareListEdit.length;j++){
                                if(searchWareListEdit[j].id==warehouseIds[i]){
                                    searchWareListEdit[j].choseFlag=true
                                    searchWareListEdit[j].choosed=true
                                }
                            }
                        }
                        this.searchWareListEdit=searchWareListEdit
                    }
                }
            },
            'state.zoneList' (n){
                if(n){
                    let zoneIds = _.cloneDeep(this.state.entity.zoneIds)
                    if(zoneIds){
                        zoneIds= zoneIds.map(id => {
                            return id
                        })
                        let editZoneList=_.cloneDeep(this.state.zoneList.list)
                        for(let i=0;i<zoneIds.length;i++){
                            for(let j=0;j<editZoneList.length;j++){
                                if(editZoneList[j].id==zoneIds[i]){
                                    editZoneList[j].choseFlag=true
                                    editZoneList[j].choosed=true
                                }
                            }
                        }
                        this.editZoneList=editZoneList
                    }
                }
            },
            'state.storeList' (n){
                if(n){
                    let ownerIds=_.cloneDeep(this.state.entity.ownerIds)
                    if(ownerIds){
                        ownerIds= ownerIds.map(id => {
                            return id
                        })
                        this.searchStoreListEdit=_.cloneDeep(this.state.storeList.list)
                        for(let i=0;i<ownerIds.length;i++){
                            for(let j=0;j<this.searchStoreListEdit.length;j++){
                                if(this.searchStoreListEdit[j].id==ownerIds[i]){
                                    this.searchStoreListEdit[j].choseFlag=true
                                    this.searchStoreListEdit[j].choosed=true
                                }
                            }
                        }
                    }
                }
            }
        },
        methods:{
            ...mapActions('master/role', ['getStorerList', 'getShopList','getZoneList', 'getWareHouseList', 'getMenuList', 'getRoleNameExist']),
            ...mapMutations('master/role', ['updateSearchStore', 'updateSearchShop', 'updateSearchWare', 'updateChoose', 'emptyData']),
            isDisabled () {
                return true
            },

            addHistroyData () {
                //   console.log(2222222222222,this.state)
                let resourceIds = this.state.entity.resourceIds
                if (resourceIds) {
                    let treeDataSource = this.state.treeDataSource
                    this.checkedList = [
                        ...resourceIds.map(id => {
                            return treeDataSource.find(source => source.id === id)
                        })
                    ]
                }
                let warehouseIds=_.cloneDeep(this.state.entity.warehouseIds)
                let ownerIds=_.cloneDeep(this.state.entity.ownerIds)
                let zoneIds = _.cloneDeep(this.state.entity.zoneIds)
                if(warehouseIds){
                    warehouseIds= warehouseIds.map(id => {
                        return id
                    })
                    // this.searchWareListEdit=_.cloneDeep(this.searchWareList)
                    let searchWareListEdit=_.cloneDeep(this.searchWareList)
                    for(let i=0;i<warehouseIds.length;i++){
                        for(let j=0;j<searchWareListEdit.length;j++){
                            if(searchWareListEdit[j].id==warehouseIds[i]){
                                searchWareListEdit[j].choseFlag=true
                                searchWareListEdit[j].choosed=true
                            }
                        }
                    }
                    this.searchWareListEdit=searchWareListEdit
                }
                if(zoneIds){
                    zoneIds= zoneIds.map(id => {
                        return id
                    })
                    let editZoneList=_.cloneDeep(this.state.zoneList.list)
                    for(let i=0;i<zoneIds.length;i++){
                        for(let j=0;j<editZoneList.length;j++){
                            if(editZoneList[j].id==zoneIds[i]){
                                editZoneList[j].choseFlag=true
                                editZoneList[j].choosed=true
                            }
                        }
                    }
                    this.editZoneList=editZoneList
                }
                if(ownerIds){
                    ownerIds= ownerIds.map(id => {
                        return id
                    })
                    this.searchStoreListEdit=_.cloneDeep(this.searchStoreList)
                    for(let i=0;i<ownerIds.length;i++){
                        for(let j=0;j<this.searchStoreListEdit.length;j++){
                            if(this.searchStoreListEdit[j].id==ownerIds[i]){
                                this.searchStoreListEdit[j].choseFlag=true
                                this.searchStoreListEdit[j].choosed=true
                            }
                        }
                    }
                }
            },
        },

    }
</script>
<style lang="scss" scoped>
    .roleInfo{
        width:961px;
        height:410px;
        overflow: hidden;
    }
    .roleInfo-l{
        width:300px;
        height:400px;
        float:left;
    }
    .roleInfo-r{
        width:610px;
        height: 400px;
        float:left;
        margin-left:50px;

    }
    .roleInfo-dialog {
        /deep/ .el-icon-more {
            cursor: pointer;
        }
        .sub-title {
            margin-bottom: 10px;
            font-size: 14px;
            color: #8492a6;
        }
        ul {
            margin-top: 10px;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            background-color: #FFFFFF;
            height: 240px;
            width: 99%;
            overflow: hidden scroll;
        }
        li {
            font-size: inherit;
            height: 40px;
            line-height: 40px;
            outline: none;
            padding: 0 15px;
            box-sizing: border-box;
            color: #606266;
            cursor: no-drop;
            &.active {
                color: #3998FC;
            }
        }
    }
    .overflow {
        overflow: scroll;
        height: 370px;
    }
</style>
