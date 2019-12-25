<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="960"
        :show-ft="showFt"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <div class="entity-dlg__block">
            <div class="entity-dlg__block-hd">
                <span class="entity-dlg__hd-line"></span>
                <span class="entity-dlg__hd-title">基础信息</span>
            </div>
            <div class="entity-dlg__block-bd">
                <base-info
                    :action="action"/>
            </div>
        </div>
        <div class="entity-dlg__block">
            <div class="entity-dlg__block-hd">
                <span class="entity-dlg__hd-line"></span>
                <span class="entity-dlg__hd-title">组合物料</span>
            </div>
            <div class="entity-dlg__block-bd">
                <goods-list
                    :action="action"/>
            </div>
        </div>
    </basic-dialog>
</template>

<script>
import BaseInfo from './baseInfo'
import GoodsList from './goodsList'
import EntityDialog from 'biz/mixins/entityDialog'
export default {
    components: {
        BaseInfo,
        GoodsList
    },
    mixins: [ EntityDialog ],
    props: {
        action: String
    },
    data () {
        return {

        }
    },
    beforeCreate () {

    },
    methods: {

    }
}
</script>
