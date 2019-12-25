<template>
    <basic-dialog
        class="account-role-dialog"
        :visible="visible"
        title='账号/角色设置'
        :width="960"
        :show-ft="showFt"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <div class="entity-dlg__block">
            <div class="entity-dlg__block-hd">
                <span class="entity-dlg__hd-line"></span>
                <span class="entity-dlg__hd-title">共选中账号数据{{ state.chooseCount }}条</span>
            </div>
            <div class="entity-dlg__block-bd">
                <el-form
                  ref="form"
                  size="small"
                  label-position="right"
                  label-width="80px"
                  :model="dto"
                  @submit.native.prevent>
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <div class="sub-title">设置功能角色</div>
                            <el-input @input="searchFuncRole" v-model="funcName" placeholder="请输入关键词"></el-input>
                            <ul>
                              <li v-for="role in funcRoles"
                                @click="chooseFuncRole(role)"
                                :class="{ 'active': role.choosed }"
                                :key="role.id">
                                  {{ role.name }}
                              </li>
                            </ul>
                        </el-col>
                        <el-col :span="12">
                            <div class="sub-title">设置数据角色</div>
                            <el-input @input="searchDataRole" v-model="dataName" placeholder="请输入关键词"></el-input>
                            <ul>
                              <li v-for="role in dataRoles"
                                @click="chooseDataRole(role)"
                                :class="{ 'active': role.choosed }"
                                :key="role.id">
                                {{ role.name }}
                              </li>
                            </ul>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <template slot="ft">
            <el-button size="small" type="primary" @click="onSave">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>

import EntityDialog from 'biz/mixins/entityDialog'
import { mapGetters, mapMutations } from 'vuex';


export default {
    components: {
    },
    mixins: [ EntityDialog ],
    props: {
      proxyAction: Function,
      state: Object
    },
    data () {
        return {
            funcName: '',
            dataName: '',
            options:[{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项15',
            label: '北京烤鸭'
          }],
        }
    },
    beforeCreate () {
        this.allFields = [ 'loginName', 'name', 'mobile', 'remark' ]
        this.disFields = []
    },
    watch: {
      visible: function (n) {
        if (n) {
          this.proxyAction({ action: 'getRole', data: { type: 1 }, cb: () => {
            this.updateHistroyChoose()
          }}, false)
          this.proxyAction({ action: 'getRole', data: { type: 2 }, cb: () => {
            this.updateHistroyChoose()
          }}, false)
        }
      }
    },
    computed: {
      ...mapGetters('master/account', ['funcRoles', 'dataRoles'])
    },
    methods: {
      ...mapMutations('master/account', ['updateSearchFuncRole', 'updateSearchDataRole', 'updateChoose', 'updateHistroyChoose']),
      // 搜索功能角色
      searchFuncRole (val) {
        this.updateSearchFuncRole(val)
      },
      // 搜索数据角色
      searchDataRole (val) {
        this.updateSearchDataRole(val)
      },
      // 更新功能角色
      chooseFuncRole (role) {
        this.updateChoose({
          type: 2,
          id: role.id,
          state: !role.choosed
        })
      },
      // 更新数据角色
      chooseDataRole (role) {
        this.updateChoose({
          type: 1,
          id: role.id,
          state: !role.choosed
        })
      },
      // 保存
      onSave () {
        const dataRoleIdList = this.dataRoles
          .filter(role => role.choosed)
          .map(role => role.id)
        const funRoleIdList = this.funcRoles
          .filter(role => role.choosed)
          .map(role => role.id)
        this.proxyAction({ action: 'setRoles', data: { dataRoleIdList, funRoleIdList } }, false)
      }
    }
}
</script>

<style lang="scss" scoped>
.account-role-dialog {
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
      width: 99.5%;
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
}
</style>
