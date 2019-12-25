<template>
    <div class="topbar">
        <div class="topbar__col--l">
            <!-- <div class="logo">&nbsp;</div> -->
            <!-- <top-menu/> -->
        </div>
        <div class="topbar__col--r">
            <div class="whse-wrap" v-if="whses.length">
                {{whses[0].name}}
            </div>
            <a class="topbar-popover-ref" slot="reference" @click="showChgWhseDlg">切换仓库</a>
            <el-popover placement="bottom-end" trigger="hover" popper-class="topbar-popover--r" :visible-arrow="false">
                <a class="topbar-popover-ref user-ref" slot="reference">{{user.name}}</a>
                <div class="topbar-popover-content user-popover-content">
                    <div class="picName">
                        <img width="55px" height="54px" style="margin-top:15px;display:inline-block" src="../../../imgs/icon-user.png" alt="">
                        <div class="userPhone">
                            <p width="101px" :title="user.loginName" style="text-align:left;font-size:18px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{user.loginName}}</p>
                            <p>{{user.name}}</p>
                        </div>
                    </div>
                    <p style="font-size:14px;margin-top:14px;margin-bottom:9px">公司名称:{{user.companyName}}</p>
                    <p style="font-size:14px;margin-top:14px;margin-bottom:9px">所属仓库:{{user.defaultWarehouseName}}</p>
                    <!-- <a class="link logout-link" @click="logout">退出登录</a> -->
                    <div class="changeAndOut">
                        <a class="link logout-link" @click="chagePsw">修改密码</a>
                        <a class="link logout-link" style="float:right" @click="logout">退出登录</a>
                    </div>
                </div>
            </el-popover>
<!--             
            <el-popover placement="bottom-end" trigger="hover" popper-class="topbar-popover--r" :visible-arrow="false">
                <a class="topbar-popover-ref serve-ref" slot="reference">&nbsp;</a>
                <div class="topbar-popover-content serve-popover-content">
                    <div class="block">
                        <div class="block-hd">客服热线</div>
                        <div class="block-bd">
                            <div class="item">电话: 0571-2620-7356</div>
                        </div>
                    </div>
                </div>
            </el-popover> -->
        </div>
        <changePasswordDialog
            :visible="showChange"
            :user="user"
            :proxyAction="proxyAction"
            :closeChangeDlg="closeChangeDlg"
         />
        <chg-whse-dlg
           :visible="chgWhseDlgVis"
           :update-vis="updateChgWhseDlgVis"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { logout } from 'biz/utils/oauth'
import changePasswordDialog from 'biz/components/changePasswordDialog'
import ChgWhseDlg from './chgWhseDlg'
import TopMenu from './topMenu'

const env = process.env

export default {
    components: {
        TopMenu,
        changePasswordDialog,
        ChgWhseDlg
    },
    data() {
        return {
            showChange:false,
            // 切换仓库弹窗是否可见
            chgWhseDlgVis: false,
        }
    },
    computed: {
        ...mapState('app', ['user', 'whses'])
    },
    mounted () {
    },
    methods: {
        logout () {
            logout()
        },
        chagePsw(){
            this.showChange = true
        },
        proxyAction(data,cb){
            api.account.changePassword(data.data).then(({head,body,messaage})=>{
                if(head.code==200){
                    this.$message.success(head.subMessage)
                    this.showChange = false
                    cb()
                }else{
                    this.$message.error(head.subMessage);
                }
            })
        },
        closeChangeDlg(){
            this.showChange = false
        },
        // 切换仓库
        showChgWhseDlg () {
            this.chgWhseDlgVis = true
        },
        // 切换仓库弹框隐藏方法
        updateChgWhseDlgVis (vis) {
            this.chgWhseDlgVis = vis
        },
    }
}
</script>
<style lang="scss" scoped>
.topbar {
    display: flex;
    padding: 0 30px 0 24px;
    height: $--tb-height;
    line-height: $--tb-height;
    background-color: #131038;
    color: #fff;
}
.topbar__col--l {
    display: flex;
    flex: 1;
    height: 100%;
    .logo {
        display: inline-block;
        width: 108px;
        height: 100%;
        margin-right: 60px;
        background: url('../../../imgs/logo.svg') no-repeat center center;
        background-size: auto 30px;
    }
    .order-center-link {
        display: inline-block;
        padding: 0 24px;
        color: #fff;
        font-size: 16px;
        &:hover {
            color: #3998FC;
            background: #181636;
        }
    }
}
.topbar__col--r {
    width: 400px;
    text-align: right;
    .whse-wrap {
        display: inline-block;
        margin-right: 22px;
        padding-left: 36px;
        font-size: 12px;
        background: url('../../../imgs/icon-whse.png') no-repeat left center;
        background-size: auto 32px;
    }
    .topbar-popover-ref {
        display: inline-block;
        padding: 0 10px;
        font-size: 12px;
        &:hover {
            color: #3998FC;
            background-color: #181636;
        }
    }
    .user-ref {
        padding-left: 36px;
        background: url('../../../imgs/icon-user.png') no-repeat left center;
        background-size: auto 32px;
    }
    .serve-ref {
        width: 32px;
        background: url('../../../imgs/icon-serve.png') no-repeat center center;
        background-size: 32px auto;
    }
   
}
</style>

<style lang="scss">
.topbar-popover--r {
    &[x-placement^="bottom"] {
        margin-top: 0;
    }
    font-size: 14px;
    color: #fff;
    border-radius: 0;
    border: 0;
    background: rgba( 9, 7, 36, 0.971);
    .block-hd {
        margin-bottom: 16px;
        padding: 0 0 10px 0;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid rgba(216, 216, 216, 0.2045);
    }
    .link {
        &:hover {
            color: #3998FC;
        }
    }
    .user-popover-content {
        // padding: 0 10px;
        position: relative;
        width: 215px;
        height: 200px;
        .picName{
            width: 100%;
            height: 86px;
            border-bottom: 1px solid #2F2C5A;
            .userPhone{
                width: 101px;
                display: inline-block;
                margin-left: 30px;
                padding-bottom: 8px;
                overflow: hidden;
            }
        }
        .changeAndOut{
            position: absolute;
            width: 100%;
            height: 20px;
            bottom: 10px;
        }
    }
    .serve-popover-content {
        width: 160px;
        padding: 8px 10px;
    }
}
</style>

