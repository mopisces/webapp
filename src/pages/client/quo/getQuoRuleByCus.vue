<!-- 报价规则 -->
<template>
	<div>
		<van-tabs v-model="formData.ordState" @change="change">
			<van-tab title="公共规则" name="1"></van-tab>
			<van-tab title="特别规则" name="0"></van-tab>
		</van-tabs>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;" 
			:columns="config.table.columns" 
			:table-data="config.indexList" 
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
	import { Tab, Tabs } from "vant"
	/*api接口*/
	import { fetchList } from "@/api/client/customer.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	export default {
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
		},
		data() {
			return {
				/*配置*/
				config: {
					table: {
						commonH: 0,
						columns: []
					},
					/*表格数据*/
					indexList: []
				},
				/*筛选条件*/
				formData: {
					/*数据类型6->报价规则*/
					dataType: 6,
					/**
					 * 订单类型
					 * >特别规则 1->公共规则 
					 */
					ordState: 1,
				},
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '报价规则')
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
				const { result } = await fetchColList({tableName: 4})
				this.config.table.columns = result
				await this.fetchData()
			},
			/*获取页面数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*头部标签改变*/
			async change( name, title ) {
				await this.fetchData()
			},
		}
	}
</script>