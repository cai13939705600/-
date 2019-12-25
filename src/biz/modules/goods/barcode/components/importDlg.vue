<template>
    <basic-dialog
        class="import-dlg"
        :title="title"
        :width="600"
        :show-ft="false"
        :visible="visible"
        :handle-close="handleClose"
        :handle-closed="handleClosed">
        <el-upload
            accept=".xlsx,.xls"
            :action="uploadUrl"
            :show-file-list="false"
            :disabled="importing"
            :before-upload="beforeUpload"
            :http-request="handleUpload">
            <a class="el-button el-button--primary upload-btn" :disabled="importing">
                <i class="el-icon-loading" v-if="importing"></i>
                {{importing ? '导入中' : '文件导入' }}
            </a>
        </el-upload>
        <a class="el-button el-button--primary download-btn" download="" :href="tplUrl">
            模板下载
        </a>
        <div class="result-block" v-if="imported">
            <div class="result-msg">导入结果：{{importResultMsg}}</div>
            <div class="result-path" v-if="importResultPath">查看详情：<a :href="importResultPath">点击下载详情</a></div>
        </div>
    </basic-dialog>
</template>

<script>
import cookie from 'js-cookie'
import qs from 'qs'
import BasicDialog from 'biz/components/basicDialog'
export default {
    components: {
        BasicDialog
    },
    props: {
        visible: Boolean,
        title: {
            type: String,
            default: '数据导入'
        },
        uploadUrl: {
            type: String,
            default: ''
        },
        fileName: {
            type: String,
            default: 'file'
        },
        importParams: {
            type: Object,
            default () {
                return {}
            }
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        successCb: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            importing: false,
            imported: false,
            importResultMsg: '',
            importResultPath: '',
            tplUrl: process.env.VUE_APP_API_PREFIX + '/ba/rest/api/skuBarcode/downloadExcelTemplate?' + qs.stringify({
                qpId: cookie.get('qpId'),
                tenantId: cookie.get('tenantId'),
                jwt: cookie.get('jwt'),
            })
        }
    },
    methods: {
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            this.importing = false
            this.importResultMsg = ''
            this.importResultPath = ''
            if (this.imported) {
                this.imported = false
                this.successCb && this.successCb()
            }
        },
        beforeUpload (file) {
            const isExcel = /(.xlsx)|(.xls)$/.test(file.name)
            if (!isExcel) {
                this.$message.error('请上传excel文件')
            }
            return isExcel
        },
        handleUpload (opts) {
            this.imported = false
            this.importing  = true
             this.importResultPath=''
            const data = new FormData()
            data.append('file', opts.file)
            api.sku.importBarcodes(data).then(({ head, body }) => {
                if (head.code === '200' && body) {
                    const params = {
                        qpId: cookie.get('qpId'),
                        tenantId: cookie.get('tenantId'),
                        jwt: cookie.get('jwt'),
                        JFSKey: body
                    }
                    this.importResultPath = process.env.VUE_APP_API_PREFIX + '/ba/rest/api/skuBarcode/downloadExcel?' + qs.stringify(params)
                }
                this.importResultMsg = head.subMessage
                this.imported = true
                this.importing = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.import-dlg {
    /deep/ .el-upload {
        display: block;
        width: 90px;
        margin: 0 auto;
    }
    .import-btn,
    .download-btn {
        display: block;
        width: 90px;
    }
    .download-btn {
        margin: 20px auto 0;
    }
    .result-block {
        margin-top: 20px;
        text-align: center;
        .result-msg {
            margin-bottom: 20px;
        }
    }
}
</style>
