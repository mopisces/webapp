<!-- 客户报价查询详情 -->
<template>
	<div>
		<van-notice-bar color="#1989fa" background="#ecf9ff" :scrollable="false">
			{{ formData.cusShortName }}({{ formData.cusId }})
		</van-notice-bar>
		<van-tabs v-model="formData.stateType" @change="change">
			<van-tab title="公共规则" name="1"></van-tab>
			<van-tab title="特别规则" name="0"></van-tab>
			<van-tab title="报价价格" name="2">
				<van-search placeholder="请输入材质编号" v-model="formData.keyWord" @input="filterData()"/>
			</van-tab>
		</van-tabs>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;" 
			:columns="config.table.columns" 
			:table-data="config.mockList" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff" 
			:height="config.table.height" 
			even-bg-color="#fafafa"
		>
		</v-table>
	</div>
</template>
<script>
	/*vant组件*/
	import { Search, Tab, Tabs, NoticeBar } from "vant"
	/*api接口*/
	import { fetchList } from "@/api/staff/customer.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	export default {
		components: {
			[Search.name]: Search,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[NoticeBar.name]: NoticeBar,
		},
		data() {
			return {
				/*配置*/
				config: {
					/*表格数据*/
					table: {
						height: 0,
						columns: []
					},
					/*原始数据*/
					indexList: [],
					/*模拟数据*/
					mockList: [],
				},
				/*筛选条件*/
				formData: {
					/*数据类型 11->客户报价查询详细信息*/
					dataType: 11,
					/*客户*/
					cusId: null,
					/*客户中文*/
					cusShortName: null,
					/*数据维度0->特别规则 1->公共规则 2->报价价格*/
					stateType: 1,
					/*搜索关键词*/
					keyWord: null,
				}
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '客户报价详情')
			if( this.$route.query ) {
				this.formData = Object.assign({}, this.$options.data().formData, this.$route.query)
				await this.setColums()
			} else {
				this.$router.replace('/staff/index/menu')
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			/*搜索数据*/
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
			/*标签页改变状态*/
			async change(name, title) {
				await this.setColums()
			},
			/*设置表格列信息*/
			async setColums() {
				if( this.formData.stateType != 2 ) {
					this.config.table.height = this.viewH - 85
					const { result } = await fetchColList({tableName: 4})
					this.config.table.columns = result
				} else {
					this.config.table.height = this.viewH - 146
					const { result } = await fetchColList({tableName: 5})
					this.config.table.columns = result
				}
				await this.fetchData()
			},
			/*获取表格数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				this.config.mockList = this.$options.data().config.mockList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
				this.config.mockList = result
			},
		}
	}
</script>