<template>
	<div class="trans-wrap">
		<el-transfer
	        v-model="disIdxs"
	        filterable
	        :right-default-checked="[1]"
	        :titles="['显示列', '隐藏列']"
	        :props="{
		        key: 'idx',
		        label: 'name'
		    }"
	        :format="{
	            noChecked: '${total}',
	            hasChecked: '${checked}/${total}'
	        }"
	        @change="handleChange"
	        :data="dataColums">
	    </el-transfer>
	    
	    <div class="cont-fot">
	        <el-button type="primary" size="mini" @click="handleClosePop">取 消</el-button>
	        <el-button type="primary" size="mini" @click="handleSave">保 存</el-button>
	    </div>
	</div>
</template>

<script>
	import Sortable from 'sortablejs'
	export default {
	    data () {
		    return {
		      	sortable: null,
		        dataColums: [],
		        disIdxs: []
		    }
	    },
	    props: {
	    	menuId: String|Number,
	        tbAllColmns: Array,
	        handleChgVis: Function,
	        handleSaveClms: Function,
	        handleClosePop: Function
        },
        computed: {
	        visColmns () {
	        	let tmp = this.disIdxs
	            return this.dataColums.filter( item => {
	                return tmp.indexOf(item.idx) === -1
	            })
	        },
	        disColmns () {
	        	let tmp = this.disIdxs
	            return this.dataColums.filter( item => {
	                return tmp.indexOf(item.idx) !== -1
	            })
	        }
	    },
        watch: {
	        tbAllColmns (newVal) {
	            this.setAllTree(newVal)
	        }
	    },
		mounted () {
		    this.$nextTick(() => {
		    	this.setAllTree(this.tbAllColmns)
                this.setSort()
            })
		},
		methods: {
			setAllTree (dt) {
				this.dataColums.length = 0
				this.disIdxs.length = 0
				for (let i = 0, len = dt.length; i < len; i++) {
					if (!dt[i].selected) {
						this.disIdxs.push(i)
			    	}
			    	dt[i].idx = i
					this.dataColums.push(dt[i])
				}
				this.handleChange()
			},
			setSort () {
	            const el = document.querySelectorAll('.el-transfer-panel__list')[0]
	            this.sortable = Sortable.create(el, {
		            ghostClass: 'sortable-ghost',
		            setData: function(dataTransfer) {
		              dataTransfer.setData('Text', '')
		            },
		            onEnd: evt => {
		              const targetRow = this.visColmns.splice(evt.oldIndex, 1)[0]
		              this.visColmns.splice(evt.newIndex, 0, targetRow)
		              
		              this.handleChange()
		            }
		        })
	        },
	        handleChange () {
	            this.handleChgVis(this.visColmns)
	        },
	        handleSave () {
	        	let sd = {
					totalColumnNum:this.tbAllColmns.length,
	        		menuId: this.menuId,
	        		showColList: this.visColmns.map(item => item.key),
	        		hideColList: this.disColmns.map(item => item.key)
	        	}
	        	this.handleSaveClms(sd)
	        }
		}
	}
</script>

<style lang="scss" scoped>
/deep/ .el-transfer-panel__item {
    display: block;
}
.trans-wrap{
	/deep/ .el-transfer{
		text-align: left;
		display: inline-block;
	}
	.cont-fot{
		text-align: center;
		margin-top: 10px;
		margin-left: -45px;
	}
}
</style>