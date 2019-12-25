<template>
    <el-form
        label-position="right"
        label-width="80px"
        ref="form"
        size="small"
        :model="model"
        :rules="rules"
        @submit.native.prevent>
        <el-row :gutter="24">
            <el-col :span="8">
                <el-form-item label="物料编号" prop="goodsNo">
                    <el-input v-model="model.goodsNo"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="货主" prop="ownerName">
                    <el-input v-model="model.ownerName"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="物料名称" prop="goodsName">
                    <el-input v-model="model.goodsName"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="8">
                <el-form-item label="物料简称" prop="goodsAlias">
                    <el-input v-model="model.goodsAlias"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="物料条码" prop="skuBarcode">
                    <el-input v-model="model.skuBarcode"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="货号" prop="goodsMemo">
                    <el-input v-model="model.goodsMemo"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="8">
                <el-form-item label="品牌" prop="attr07">
                    <el-select v-model="model.brand">

                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="规格" prop="skuName">
                    <el-input v-model="model.skuName"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="基本单位" prop="unitName">
                    <el-input v-model="model.unitName"/>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import BasicForm from 'biz/mixins/basicForm'
export default {
    mixins: [ BasicForm ],
    data () {
        return {
            rules: {

            }
        }
    },
    beforeCreate () {
        this.allFields = [ 'goodsNo', 'ownerName', 'goodsName', 'goodsAlias', 'skuBarcode', 'goodsMemo', 'brand', 'skuName', 'unitName' ]
        this.disFields = []
    }
}
</script>

