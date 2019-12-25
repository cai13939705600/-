<template>
    <div class="old-sub">
        <basic-list
            :show-action-col="false"
            :fields="fields">
            <template slot="hd-col--l">
                <el-form :model="query" label-width="80px" size="small" @submit.native.prevent>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="物料编号">
                                <el-input>
                                    <i class="el-icon-more" slot="suffix"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
        </basic-list>
    </div>
</template>

<script>
import BasicList from 'biz/components/basicList'
export default {
    components: {
        BasicList
    },
    data () {
        return {
            query: {

            },
            fields: [
                { key: 'attr01', name: '物料编号' },
                { key: 'attr02', name: '物料名称' },
                { key: 'attr03', name: '物料简称' },
                { key: 'attr04', name: '物料条码' },
                { key: 'attr05', name: '品牌' },
                { key: 'attr06', name: '基本单位' },
                { key: 'attr07', name: '货号' },
                { key: 'attr08', name: '规格' },
                { key: 'attr09', name: '长(cm)' },
                { key: 'attr10', name: '宽(cm)' },
                { key: 'attr11', name: '高(cm)' },
                { key: 'attr12', name: '体积(L)' },
                { key: 'attr13', name: '毛重(kg)' },
                { key: 'attr14', name: '净重(kg)'}
            ]
        }
    },
}
</script>



