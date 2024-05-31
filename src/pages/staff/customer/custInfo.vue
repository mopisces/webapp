<!-- 客户查询 -->
<template>
	<div>
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;" 
			:height="viewH" 
			:columns="config.table.columns" 
			:table-data="config.table.data" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff"
			:row-click="rowClick"
		>
		</v-table>
		<popup-filter 
			:filterShow.sync="config.filter.show" 
			@resetClick="resetClick" 
			@filterClick="filterClick"
		>	
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="formData.cusId"></cus-picker>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*api接口*/
	import { fetchList } from "@/api/staff/customer.js"
	import { fetchColList } from "@/api/common/tableColumn.js"

	export default {
		components:{
			PopupFilter,
			CusPicker,
			DragMenu
		},
		data(){
			return {
				config: {
					table: {
						columns: [],
						data: []
					},
					filter: {
						show: false
					}
				},
				/*筛选条件*/
				formData: {
					/*客户*/
					cusId: null,
					/*数据类型*/
					dataType: 0
				},
			}
		},
		async created(){
			await this.$store.commit('staff/setHeaderTitle', '客户查询')
		},
		async mounted(){
			await this.setColums()
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods:{
			/*筛选点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*获取数据列表*/
			async queryList(){
				this.config.table.data = this.$options.data().config.table.data
				const { result } = await fetchList(this.formData)
				this.config.table.data = result
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 100})
				this.config.table.columns = result
				await this.queryList()
			},
			/*重置按钮*/
			async resetClick(){
				this.formData = this.$options.data().formData
				this.config.filter.show = false
				await this.queryList()
			},
			/*筛选按钮*/
			async filterClick(){
				await this.queryList()
			},
			/*表格点击复制*/
			rowClick(rowIndex, rowData, column){
				var info = ''
				for (var i = 0; i < this.config.table.columns.length; i++) {
					var value = rowData[this.config.table.columns[i].field] || ''
					info += this.config.table.columns[i].title + ':' + value
					if( i <= this.config.table.columns.length ){
						info += '\n'
					}
				}
				this.$copyText(info).then(()=>{
					this.$notify({
						type: 'success',
						color: '#ad0000',
						background: '#ffe1e1',
						message: '复制成功',
						duration: 2000
					})
				}).catch((e)=>{
					this.$notify({
						type: 'fail',
						message: e.message,
						duration: 2000
					})
				})
			},
		},
		
		
	}
</script>