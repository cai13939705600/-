<template>
    <el-dialog
        class="print-toaster-preview"
        @close="updateToasterDialogVis(false)"
        :visible="visible"
        :width="'960px'"
        :append-to-body="true"
        :custom-class="'overflow-y'"
        title="帮助"
    >
        <div class="mt-18 entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">打印插件下载</span>
        </div>
        <p class="mt-18">
            <el-link target="_blank" href="https://pan.baidu.com/s/10LU8GhIeB0MkGh6K2y_Djw" type="primary">单击下载默认打印插件(Clodop)</el-link>
            <sub class="mr-18">【提取码: n4hz】</sub>
            <el-link target="_blank" class="mr-18" href="https://open.taobao.com/doc.htm?docId=106976&docType=1" type="primary">单击下载菜鸟打印插件</el-link>
            <el-link target="_blank" href="https://pan.baidu.com/s/10OvlgPSY7mOTvgAnge1WrQ" type="primary">单击下载拼多多打印插件</el-link>
            <sub>【提取码: 06m1】</sub>
        </p>
        <div class="mt-18 entity-dlg__block-hd">
            <span class="entity-dlg__hd-line"></span>
            <span class="entity-dlg__hd-title">C-lodop使用帮助</span>
        </div>
        <p class="mt-18">
            <ul>
                <li>1. Clodop打印插件下载安装后，请依次点击：【开始菜单】->【所有程序】->【C-Lodop(HTM-WEB-PRINT)32bit】->【C-Lodop Setup】进行启动</li>
                <li>2. Clodop打印插件下载安装后，请确认打印服务的端口是否匹配</li>
                <li>3. 您的打印服务可能端口指定不匹配，请确认当前端口:
                    <input v-model.number="port" min="0" :max="65565" class="port-input" type="number">
                    &ensp;
                    <el-button @click="changePort" class="edit-button" size="mini" type="primary">修改</el-button>
                </li>
            </ul>
        </p>
        <template slot="ft"></template>
    </el-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
export default {
    name: 'toaster-preview',
    mixins: [EntityDialog],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        updateToasterDialogVis: Function
    },
    data () {
        return {
            port: 8000
        }
    },
    beforeCreate () {
        this.allFields = [
        ]
        this.disFields = []
    },
    created () {
        this.updatePort()
    },
    watch: {
    },
    methods: {
        // 抓取当前端口号
        updatePort () {
            try {
                this.port = printService.currentPort
            } catch (e) {
                console.warn(e);
            }
        },
        changePort () {
            try {
                console.log('this.port', this.port);
                if (Number.isSafeInteger(this.port) && this.port > 0 && this.port < 65565) {
                    // 修改端口号
                    printService.changeProt(this.port)
                } else {
                    this.$message.error('端口号不合法')
                }
            } catch (e) {
                this.$message.error('修改端口号失败')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/biz/styles/public.scss";
.print-toaster-preview {
    /deep/ .el-dialog__body {
        padding: 18px 28px;
    }
    /deep/ .entity-dlg__block {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    /deep/ .entity-dlg__block-hd {
        font-size: 13px;
    }
    /deep/ .entity-dlg__hd-line {
        display: inline-block;
        margin-right: 10px;
        width: 3px;
        height: 16px;
        vertical-align: middle;
        border-radius: 3px;
        background: #4186f6;
    }
    /deep/ .entity-dlg__hd-title {
        vertical-align: middle;
        color: #3f4656;
    }
    .mt-18 {
        margin-top: 18px;
    }
    .tips-sub {
        position: static;
        margin-top: 96px;
        text-align: center;

    }
    ul {
        color: #666666;
        font-size: 12px;
    }
    li {
        line-height: 32px;
    }
    /deep/ .el-link--inner {
        line-height: 22px;
    }
    .mr-18 {
        margin-right: 18px;
    }
    .edit-button{
        padding: 4px 13px;
    }
    .port-input {
        text-align: center;
        width: 50px;
        height: 15px;
        border: 1px solid #eeeeee;
        padding: 1px;
        outline-width: 1px;
        &:focus {
            outline-width: 1px;
        }
    }
}
</style>

