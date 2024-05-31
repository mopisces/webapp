<!-- 库区面积 -->
<template>
	<div>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;" 
			:height="viewH" 
			:columns="config.table.columns" 
			:table-data="config.indexList" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff"
		>
		</v-table>
	</div>
</template>

<script>
	/*api接口*/
	import { fetchList } from "@/api/staff/paper.js"
	import { fetchColList } from "@/api/common/tableColumn.js"

	export default {
		data() {
			return {
				/*配置*/
				config: {
					/*表格配置*/
					table: {
						columns: []
					},
					/*列表数据*/
					indexList: [],
				},
				/*筛选条件*/
				formData: {
					/*数据类型 1->库区面积*/
					dataType: 1
				},
			}
		},
		async created(){
			await this.$store.commit('staff/setHeaderTitle', '库区面积')
		},
		async mounted() {
			await this.setColums()
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 105})
				this.config.table.columns = result
				await this.fetchData()
			},
			/*获取列表数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			}
		}
	}
</script>