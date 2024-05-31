<!-- 报价价格 -->
<template>
	<div>
		<van-search 
			placeholder="请输入材质编号" 
			v-model="formData.keyWord" 
			@input="filterData()"
		/>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;" 
			:columns="config.table.columns" 
			:table-data="config.mockList" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff" 
			:height="viewH - config.table.commonH" 
			even-bg-color="#fafafa"
		>
		</v-table>
	</div>
</template>

<script>
	/*vant组件*/
	import { Search } from "vant"
	/*api接口*/
	import { fetchList } from "@/api/client/customer.js"
	import { fetchColList } from "@/api/common/tableColumn.js"

	export default {
		components: {
			[Search.name]: Search
		},
		data() {
			return {
				/*配置信息*/
				config: {
					table: {
						commonH: 61,
						columns: [],
					},
					/*原始数据列表*/
					indexList: [],
					/*表格数据*/
					mockList: [],
				},
				/*筛选条件*/
				formData: {
					/*数据类型 5->报价价格*/
					dataType: 5,
					keyWord: null
				},
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '报价价格')
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
			/*过滤数据*/
			filterData() {
				if( this.formData.keyWord != '' ) {
					this.config.mockList = this.$options.data().config.mockList
					for (var i = 0; i < this.config.indexList.length; i++) {
						if( this.config.indexList[i].BoardId.indexOf(this.formData.keyWord) !== -1 ){
							this.config.mockList.push(this.config.indexList[i])
						}
					}
				} else {
					this.config.mockList = this.config.indexList
				}
			},
			/*获取页面数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				this.config.mockList = this.$options.data().config.mockList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
				this.config.mockList = result
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 5})
				this.config.table.columns = result
				await this.fetchData()
			},
		},
	}
</script>