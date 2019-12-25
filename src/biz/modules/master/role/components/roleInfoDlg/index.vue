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
                    :rules="rules"
                    >
                    <el-form-item
                        label="角色类型"
                        label-width="102px"
                        prop="type"
                        >
                        <el-select
                            :disabled="action === 'edit'"
                            v-model="dto.type"
                            @change="changeType"
                            filterable
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
                        ref="name"
                        >
                        <el-input v-model="dto.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="备注"
                        prop="remarks"
                        >
                        <el-input v-model="dto.remarks"></el-input>
                    </el-form-item>
                </el-form>
            </div>
         </div>
         <div class="entity-dlg__block roleInfo-r">
            <div class="entity-dlg__block-hd">
                <span class="entity-dlg__hd-line"></span>
                <span v-if="dto.type === 2" class="entity-dlg__hd-title">
                    设置功能角色
                    <el-button type="primary" size="mini" @click="checkAll">全选</el-button>
                </span>
                <span v-else class="entity-dlg__hd-title">设置数据角色</span>
            </div>
            <div v-if="dto.type === 2" class="entity-dlg__block-bd">
                <div class="roleInfo-r overflow">
                    <el-tree
                        ref="tree"
                        :data="state.treeData"
                        show-checkbox
                        node-key="id"
                        :check-strictly="false"
                        :check-on-click-node="true"
                        :default-expand-all="true"
                        :default-expanded-keys="state.entity.resourceIds"
                        :default-checked-keys="state.entity.resourceIds"
                        :props="{ children: 'children', label: 'name' }"
                        @check-change="handleCheckChange">
                    </el-tree>
                </div>
            </div>
            <div v-else class="entity-dlg__block-bd">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <div class="sub-title">请选择仓库</div>
                        <el-input v-if="action=='add'"
                            @input="updateSearchWare"
                            v-model="wareHourse"
                            placeholder="请输入关键词"></el-input>
                        <ul v-if="action=='add'">
                                <li v-for="role in searchWareList"
                                    :key="role.id"
                                    style="position:relative"
                                    >
                                    <el-checkbox @change="chooseWareHourse(role)" v-model="role.choosed"></el-checkbox>
                                    <span :class="{ 'active': active==role.id }"  @click="clickSpan(role)" style="margin-left:15px;">{{ role.name }}</span>
                                    <span :class="{ 'active': active==role.id }" @click="clickSpan(role)" style="position:absolute;right:0">></span>
                                </li>
                            
                        </ul>

                        <el-input v-if="action=='edit'"
                                  v-model="wareHourseEdit"
                                  placeholder="请输入关键词"></el-input>
                        <ul v-if="action=='edit'">
                            <li v-for="role in searchWareListEditComputed"
                            style="position:relative"
                                :key="role.id">
                                <el-checkbox @change="chooseWareHourse(role)" v-model="role.choosed"></el-checkbox>
                                    <span :class="{ 'active': active==role.id }"  @click="clickSpan(role)" style="margin-left:15px;">{{ role.name }}</span>
                                    <span :class="{ 'active': active==role.id }" @click="clickSpan(role)" style="position:absolute;right:0">></span>
                            </li>
                        </ul>
                    </el-col>
                     <el-col :span="8">
                        <div class="sub-title">请选择库区</div>
                        <el-input v-if="action=='add'"
                        disabled
                            placeholder=""></el-input>
                        <ul v-if="action=='add'">
                                <li v-for="role in state.zoneList.list"
                                    v-show="active==role.warehouseId"
                                    :class="{ 'active': role.choosed }"
                                    @click="chooseZone(role)"
                                    :key="role.id">
                                    {{ role.name }}
                                </li>
                            
                        </ul>

                        <el-input v-if="action=='edit'"
                                    disabled
                                  placeholder=""></el-input>
                        <ul v-if="action=='edit'">
                            <li v-for="role in editZoneList"
                                v-show="active==role.warehouseId"
                                @click="chooseZone(role)"
                                :class="{ 'active': role.choosed }"
                                :key="role.id">
                                {{ role.name }}
                            </li>
                        </ul>
                    </el-col>
                    <el-col :span="8">
                        <div class="sub-title">请选择货主</div>
                        <el-input
                            @input="updateSearchStore"
                            v-model="store"
                            placeholder="请输入关键词" v-if="action=='add'"></el-input>
                        <ul v-if="action=='add'">
                            <li v-for="role in searchStoreList"
                                @click="chooseStore(role)"
                                :class="{ 'active': role.choosed }"
                                :key="role.id">
                            {{ role.name }}
                            </li>
                        </ul>
                        <el-input
                            v-model="storeEdit"
                            placeholder="请输入关键词" v-if="action=='edit'"></el-input>
                        <ul v-if="action=='edit'">
                            <li v-for="role in searchStoreListEditComputed"
                                @click="chooseStore(role)"
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
        handleSave: Function,
    },
    mixins: [ EntityDialog ],
    computed: {
        ...mapGetters('master/role', ['searchStoreList', 'searchWareList']),
        searchWareListEditComputed(){
            let arr = this.searchWareListEdit.filter(item=>{
                return item.name.includes(this.wareHourseEdit)
            })
            return arr
        },
        searchStoreListEditComputed(){
            let arr = this.searchStoreListEdit.filter(item=>{
                return item.name.includes(this.storeEdit)
            })
            return arr
        }
    },

    data(){
        return{
            wareHourse: '',
            wareHourseEdit:'',//修改的模态框 的input
            store: '',
            storeEdit:'',//修改的模态框 的input
            shop: '',
            //默认显示功能角色设置
            showRole: true,
            active:false,
            // 选择的列表
            checkedList: [],
            searchWareListEdit:[],//仓库回显
            searchStoreListEdit:[],//货主回显
            editZoneList:[],//库区回显
            rules: {
                type: [{ required: true, message: '请选择角色类型', trigger: 'change' }],
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        if (!value) {
                            return callback('请输入角色名称')
                        }
                        const params = { name: value, type: this.dto.type }
                        if (this.dto.id) {
                            params.id = this.dto.id
                        }
                        this.getRoleNameExist({
                            params,
                            cb: (head, body) => {
                                if (Number(body) > 0) {
                                    // 不可用
                                    return callback (new Error('角色名称已存在'))
                                } else {
                                    // 可用
                                    return callback ()
                                }
                            },
                            errCb: (head, body) => {
                                // 验证失败
                                return callback (new Error(head.subMessage || '数据验证失败'))
                            }
                        })
                    }, trigger: 'blur' }
                ]
            }
        }
    },
    beforeCreate () {
        this.allFields = ['id', 'type', 'name', 'remarks']
        this.disFields = []
    },
    created () {
        this.getStorerList({params: {
               validFlag:1
            }})
        this.getWareHouseList({params: {
               validFlag:1
         }})
        this.getMenuList({params: {}, cb: () => {
            if (this.action === 'edit') {
                // 加载历史数据
                this.addHistroyData()
            }
        }})
        
    },
    mounted(){
       
    },
    watch: {
        'dto.type': function (n) {
            switch (n) {
                case 1:
                    this.showRole = false
                    break;
                case 2:
                    this.showRole = true
                default:
                    break;
            }
            if (this.dto.name){
                this.$refs.name.validate()
            }
        },
        'state.wareHouseIdList' (n){
            if(n){
                this.getZoneList({params: {
                    warehouseIdList:this.state.wareHouseIdList
                }})
            }
        },
        'state.entity': function (n) {
            if(this.action!='add'){
                // 加载历史数据
                this.addHistroyData()
                if (this.$refs.tree) {
                    this.$refs.tree.setCheckedKeys(n.resourceIds || [])
                }
                if (n.shopIds && n.shopIds.length){
                    n.shopIds.forEach(item => {
                        this.chooseShop({
                            id: item.id,
                            choosed:item.choseFlag
                        })
                    })
                }/* else {
                    this.emptyData()
                }*/
                    //
            }
            
        },
        // 'state.zoneList' (n){
        //     if(this.action!='add'){
        //         let zoneIds = _.cloneDeep(this.state.entity.zoneIds)
        //         if(zoneIds){
        //             zoneIds= zoneIds.map(id => {
        //                 return id
        //             })
        //         // this.searchWareListEdit=_.cloneDeep(this.searchWareList)
        //             let editZoneList=_.cloneDeep(this.state.zoneList.list)
        //             console.log('abac',this.state.zoneList.list)
        //             for(let i=0;i<zoneIds.length;i++){
        //                 for(let j=0;j<editZoneList.length;j++){
        //                     if(editZoneList[j].id==zoneIds[i]){
        //                         editZoneList[j].choseFlag=true
        //                         editZoneList[j].choosed=true
        //                     }
        //                 }
        //             }
        //             this.editZoneList=editZoneList
        //         }
        //     }
            
        // }
      /*  'wareHourseEdit':function (n) {
            if(n!=''){
                if (this.state.wareHouseList.total) {
                    let showArr=[]
                    this.searchWareListEdit.filter(item => {
                        //   console.log(item)
                        const isFileter = item.name.indexOf(n) !== -1
                        if(isFileter){
                            showArr.push(item)
                        }
                        // return isFileter || isChoose
                    })
                    this.searchWareListEdit=showArr
                }
            }else{
                console.log(678)
                this.addHistroyData ()
            }
        },
        'storeEdit':function (n) {
            if(n!=''){
                if (this.state.storeList.total) {
                    let showArr=[]
                    this.searchStoreListEdit.filter(item => {
                        //   console.log(item)
                        const isFileter = item.name.indexOf(n) !== -1
                        if(isFileter){
                            showArr.push(item)
                        }
                    })
                    this.searchStoreListEdit=showArr
                } /!*else {
                    return []
                }*!/
            }else{
                console.log(123)
                this.addHistroyData ()
            }
        }*/
    },
    methods:{
        ...mapActions('master/role', ['getStorerList', 'getWareHouseList','getZoneList', 'getMenuList', 'getRoleNameExist']),
        ...mapMutations('master/role', ['updateSearchStore', 'updateSearchWare', 'updateChoose', 'emptyData', 'updateChooseAll']),
        //切换角色类型
        changeType(){
            this.active = false
            this.getStorerList({params: {
               validFlag:1
            }})
            this.getWareHouseList({params: {
                validFlag:1
            }})
            this.getMenuList({params: {}, cb: () => {
                if (this.action === 'edit') {
                    // 加载历史数据
                    this.addHistroyData()
                }
            }})
        },
        // 选择仓库
        chooseWareHourse (role) {
            console.log(role)
            if(!role.choosed){
                console.log('nnnnn',this.state.zoneList.list)
                if(this.action=='add'){
                    this.state.zoneList.list.forEach(e=>{
                        if(e.warehouseId==role.id){
                            e.choosed = false
                        }
                    })
                    this.active = false
                }
                if(this.action=='edit'){
                    this.editZoneList.forEach(e=>{
                        if(e.warehouseId==role.id){
                            e.choosed = false
                        }
                    })
                    this.active = false
                }
            }else{
                this.active = role.id
            }
            this.updateChoose({
                type: 1,
                id: role.id,
                state: role.choosed
            })
        },
         // 选择库区
        chooseZone(role) {
            role.choosed=!role.choosed
            // console.log('mmmmmmmmmmmm',this.searchWareList)
            if(role.choosed){
                this.searchWareList.forEach(e=>{
                    if(e.id==role.warehouseId){
                        e.choosed = true
                    }
                })
            }
            this.updateChoose({
                type: 3,
                id: role.id,
                state: role.choosed
            })
        },
        clickSpan(b){
            debugger
            this.active = b.id
            if(!b.choosed){
                b.choosed = true
            }
        },
        // 选择货主
        chooseStore (role) {
            role.choosed=!role.choosed
            this.updateChoose({
                type: 2,
                id: role.id,
                state: role.choosed
            })
        },
        handleCheckChange (data, isChecked) {
            if (isChecked) {
                this.checkedList.push(data);
            } else {
                this.checkedList = this.checkedList.filter(item => item.id !== data.id)
            }
        },
        toEnd () {
            const data = _.pick(this.dto, this.allFields);
            switch (data.type) {
                case 1:
                    // 数据角色
                   if(this.action=='add'){
                       data.warehouseIds = this.searchWareList.filter(item => item.choosed).map(item => item.id)
                       data.ownerIds = this.searchStoreList.filter(item => item.choosed).map(item => item.id)
                       data.zoneIds = this.state.zoneList.list.filter(item => item.choosed).map(item => item.id)
                   }else{
                       data.warehouseIds = this.searchWareListEdit.filter(item => item.choosed).map(item => item.id)
                       data.ownerIds = this.searchStoreListEdit.filter(item => item.choosed).map(item => item.id)
                       data.zoneIds = this.editZoneList.filter(item => item.choosed).map(item => item.id)
                   }
                    // 数据验证
                    if (!data.warehouseIds.length) {
                        this.$message.error('请至少选择一个仓库')
                        return undefined
                    }
                    if (!data.ownerIds.length) {
                        this.$message.error('请至少选择一个货主')
                        return undefined
                    }
                    // if (!data.shopIds.length) {
                    //     this.$message.error('请至少选择一个店铺')
                    //     return undefined
                    // }
                    break;
                case 2:
                    // 功能角色
                    data.resourceIds = this.checkedList.map(item => item.id)
                    // 数据验证
                    if (!data.resourceIds.length) {
                        this.$message.error('请至少选择一个菜单')
                        return undefined
                    }
                    data.resourceIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
                    break;
                default:
                    break;
            }
            return data
        },
        // 保存并继续
        onSaveGoOn () {
            // 验证from表单
            this.onSave(false)
        },
        // 保存
        onSave (isClose = true) {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                let params = this.toEnd()
              //  console.log('params', params);
                // 判断参数
                if (params) {
                    removeEmptyAttr(params)
                    this.handleSave(params, () => {
                        // 制空数据
                        this.emptyData()
                        this.$refs.form.resetFields()
                        this.updateState('entity')
                        if (this.$refs.tree) {
                            this.$refs.tree.setCheckedKeys(this.state.entity.resourceIds || [])
                        }
                        this.queryList()
                        isClose && this.handleClose()
                    }, this.action)
                }
            })
        },
        // 添加历史数据
        addHistroyData () {
        //   console.log(2222222222222,this.state)
            this.active = false
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
               // this.searchWareListEdit=_.cloneDeep(this.searchWareList)
                let editZoneList=_.cloneDeep(this.state.zoneList.list)
                console.log('abac',this.state.zoneList.list)
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
        checkAll () {
            this.updateChooseAll()
        }
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
            width: 100%;
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
            cursor: pointer;
            &.active {
                color: #3998FC;
            }
        }
        .active {
            color: #3998FC;
        }
    }
    .overflow {
        overflow: scroll;
        height: 370px;
    }
</style>
