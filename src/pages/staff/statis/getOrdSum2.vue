<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<div class="amount-statis-card">
			<div class="bill-statis-list">
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						下单金额
					</div>
					<div class="bill-statis-value">
						{{ dataInfo.dailyAmount }}
					</div>
				</div>
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						送货金额
					</div>
					<div class="bill-statis-value">
						{{ dataInfo.deliAmount }}
					</div>
				</div>
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						上月返点金额
					</div>
					<div class="bill-statis-value">
						{{ dataInfo.rebateAmount }}
					</div>
				</div>
			</div>
		</div>
	
		<van-tabs v-model="config.tabs.active">
			<van-tab title="退货汇总">
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;" 
					:columns="config.table.columns.return" 
					:table-data="dataInfo.returnDetail" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					:height="viewH - config.table.commonH" 
					even-bg-color="#fafafa">
				</v-table>
			</van-tab>
			<van-tab title="返利汇总">
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;" 
					:columns="config.table.columns.rebate" 
					:table-data="dataInfo.rebateDetail" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					:height="viewH - config.table.commonH" 
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
				<van-cell-group title="下单金额">
					
					<time-range-picker
						:beginDate.sync="formData.beginDate"
						:endDate.sync="formData.endDate"
						:maxDate.sync="formData.maxDate"
						:minDate.sync="formData.minDate"
					></time-range-picker>
				</van-cell-group>
				<van-cell-group title="收货金额">
					<time-range-picker
						:beginDate.sync="formData.beginDate1"
						:endDate.sync="formData.endDate1"
						:maxDate.sync="formData.maxDate1"
						:minDate.sync="formData.minDate1"
					></time-range-picker>
				</van-cell-group>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	/*vant组件*/
	import { Button, CellGroup, SwitchCell, Tab, Tabs } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { fetchList } from "@/api/staff/statis.js"

	export default {
		components:{
			[Button.name]: Button,
			[CellGroup.name]: CellGroup,
			[SwitchCell.name]: SwitchCell,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter,
			TimeRangePicker,
			DragMenu
		},
		data(){
			return {
				/*页面配置*/
				config:{
					filter:{
						show: false,
					},
					tabs: {
						active: 0
					},
					table: {
						commonH: 120,
						columns:{
							return: [],
							rebate: []
						},
						data:{
							return: [],
							rebate: []
						}
					},
					switch: {
						checked: false
					}
				},
				/*头部信息*/
				dataInfo: {
					dailyAmount: null,
					deliAmount: null,
					rebateAmount: null,
					returnDetail: [],
					rebateDetail: [],
				},
				/*筛选条件*/
				formData: {
					//数据类型
					dataType: 4,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					//开始日期1
					beginDate1: null,
					//结束日期1
					endDate1: null,
					//最小日期1
					minDate1: null,
					//最大日期1
					maxDate1: null,
				}
			}
		},
		async created() {
			this.$store.commit('staff/setHeaderTitle','订单统计2');
			if( getStorage('staff/statis/amountStatis') !== null ){
				let storageData = JSON.parse(getStorage('staff/statis/amountStatis'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.fetchData()
			}else{
				await this.getConfig()
			}
		},
		async mounted() {
			await this.setColums()
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		destroyed() {
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			/*筛选按钮*/
			menuClick() {
				this.config.filter.show = true
			},
			/*获取页面参数*/
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				this.formData.beginDate = result.StaffAmountStatisDailyBeginDate
				this.formData.endDate = result.StaffAmountStatisDailyEndDate
				this.formData.beginDate1 = result.StaffAmountStatisDeliveryBeginDate
				this.formData.endDate1 = result.StaffAmountStatisDeliveryEndDate
				this.formData.minDate = result.StaffAmountStatisDailyMinDate
				this.formData.maxDate = result.StaffAmountStatisDailyMaxDate
				this.formData.minDate1 = result.StaffAmountStatisDeliveryMinDate
				this.formData.maxDate1 = result.StaffAmountStatisDeliveryMaxDate
				await this.fetchData()
			},
			/*获取页面数据*/
			async fetchData(){
				this.config.table.data = this.$options.data().config.table.data
				this.topInfo = this.$options.data().topInfo
				const { result } = await fetchList(this.formData)
				this.dataInfo = result
			},
			/*重置按钮*/
			async reset(){
				this.formData = this.$options.data().formData
				this.config.filter.show = false
				this.config.switch.checked = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter(){
				await this.fetchData()
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 1})
				this.config.table.columns.return = result.amtReturn
				this.config.table.columns.rebate = result.amtRebate
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('staff/statis/amountStatis', this.formData)
				}else{
					removeStorage('staff/statis/amountStatis')
				}
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
	.amount-statis-container{
		background-color: #f1f1f1;
	}

	.amount-statis-card{
		padding: 0.2rem 0.5rem;
		width: 100%;
		height: 4.625rem;
	}

	.bill-statis-list{
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

	.bill-statis-item{
		flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
	}

	.bill-statis-text{
		font-size:0.8rem;
		padding-bottom: 0.2rem;
	}
	
	.bill-statis-value{
		font-size: 1rem; 
	}
</style>