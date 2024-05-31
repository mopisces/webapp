<!-- 订单统计 -->
<template>
	<div class="amount-statis-container">
		<!-- 菜单 -->
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<!-- 头部数据 -->
		<div class="amount-statis-card">
			<div class="bill-statis-list">
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						下单金额
					</div>
					<div class="bill-statis-value">
						{{ indexData.dailyOrderAmount }}
					</div>
				</div>
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						送货金额
					</div>
					<div class="bill-statis-value">
						{{ indexData.deliveryAmount }}
					</div>
				</div>
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						上月返点金额
					</div>
					<div class="bill-statis-value">
						{{ indexData.rebateAmount }}
					</div>
				</div>
			</div>
		</div>	
		<!-- 底部表格 -->
		<van-tabs v-model="config.tabs.active">
			<van-tab title="退货汇总">
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;" 
					:columns="config.table.refund.columns" 
					:table-data="indexData.returnDetail" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					:height="viewH-config.table.commonH" 
					even-bg-color="#fafafa">
				</v-table>
			</van-tab>
			<van-tab title="返利汇总">
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;" 
					:columns="config.table.rebate.columns" 
					:table-data="indexData.rebateDetail" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					:height="viewH-config.table.commonH" 
					even-bg-color="#fafafa">
				</v-table>
			</van-tab>
		</van-tabs>	
		<popup-filter 
			:filterShow.sync="config.filter.show" 
			@resetClick="reset" 
			@filterClick="filter"
		>
			<div slot="filter-field-1">
				<time-range-picker
					label="下单金额"
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<time-range-picker
					label="收货金额"
					:beginDate.sync="formData.beginDate1"
					:endDate.sync="formData.endDate1"
					:maxDate.sync="formData.maxDate1"
					:minDate.sync="formData.minDate1"
				></time-range-picker>
			</div>
		</popup-filter>
	</div>
</template>

<script>
	/*vant组件*/
	import { SwitchCell, Tab, Tabs } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { fetchList } from "@/api/client/customer.js"
	export default {
		components: {
			[SwitchCell.name]: SwitchCell,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter,
			DragMenu,
			TimeRangePicker
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					tabs: {
						active: 0
					},
					switch: {
						checked: false
					},
					/*表格配置*/
					table: {
						commonH: 118,
						refund: {
							columns: [],
						},
						rebate: {
							columns: [],
						},
					},
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 21->订单统计
					 */
					dataType: 21,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					//开始日期
					beginDate1: null,
					//结束日期
					endDate1: null,
					//最小日期
					minDate1: null,
					//最大日期
					maxDate1: null,
				},
				indexData: {
					dailyOrderAmount: 0,
					deliveryAmount: 0,
					rebateAmount: 0,
					returnDetail: [],
					rebateDetail: []
				},
			}
		},
		async created() {
			this.$store.commit('client/setHeaderTitle', '订单统计')
			if( getStorage('client/statis/amountStatis') !== null ) {
				let storageData = JSON.parse(getStorage('client/statis/amountStatis'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.fetchData()
			} else {
				await this.getConfig()
			}
		},
		mounted() {
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		destroyed() {
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
			}),
		},
		methods: {
			/*获取表格配置*/
			async setColums(){
				const { result } = await fetchColList({tableName: 1})
				this.config.table.refund.columns = result.amtReturn
				this.config.table.rebate.columns = result.amtRebate
			},
			/*菜单点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*获取参数*/
			async getConfig(){
				await this.setColums()
				const { result } = await getWebConfig({paramType: 'clientStatis'})
				this.formData.minDate = result.ClientAmountStatisDailyMinDate
				this.formData.maxDate = result.ClientAmountStatisDailyMaxDate
				this.formData.beginDate = result.ClientAmountStatisDailyBeginDate
				this.formData.endDate = result.ClientAmountStatisDailyEndDate
				this.formData.minDate1 = result.ClientAmountStatisDeliveryMinDate
				this.formData.maxDate1 = result.ClientAmountStatisDeliveryMaxDate
				this.formData.beginDate1 = result.ClientAmountStatisDeliveryBeginDate
				this.formData.endDate1 = result.ClientAmountStatisDeliveryEndDate
				await this.fetchData()
			},
			/*获取列表数据*/
			async fetchData() {
				this.indexData = this.$options.data().indexData
				const { result } = await fetchList(this.formData)
				this.indexData = result
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.switch.checked = false
				this.config.filter.show = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchData()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client/statis/amountStatis', this.formData)
				}else{
					removeStorage('client/statis/amountStatis')
				}
			}
		},
	}
</script>

<style>
	.amount-statis-container {
		background-color: #f1f1f1;
	}

	.amount-statis-card {
		padding: 0.2rem 0.5rem;
		width: 100%;
		height: 4.625rem;
	}

	.bill-statis-list {
		width: 100%;
	    height: 4.1875rem;
	    box-sizing: border-box;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    background-color: #fff;
	    box-shadow: 0 0.0625rem 0.625rem hsl(0deg 0% 72% / 10%);
	    border-radius: 0.5rem;
	    padding: 0.1rem;
	}

	.bill-statis-item {
		flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
	}

	.bill-statis-text {
		font-size: 0.8rem;
		padding-bottom: 0.2rem;
	}
	
	.bill-statis-value {
		font-size: 1rem; 
	}
</style>