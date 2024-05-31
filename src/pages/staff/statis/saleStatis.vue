<!-- 接单统计 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<van-tabs v-model="formData.tabs">
			<van-tab title="接单">
				<template v-if=" config.produce == 0 ">
					<card 
						title="接单信息"
						:is-shadow="true"
					>
						<div class="card-body-container">
							<div class="card-body-item card-body-item-50">
								<span>
									按单金额
									<span>{{ orderTakeData.ordAmt }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-50">
								<span>
									二层米数
									<span>{{ orderTakeData.tLength0 }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-50">
								<span>
									单坑米数
									<span>{{ orderTakeData.tLength1 }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-50">
								<span>
									双坑米数
									<span>{{ orderTakeData.tLength2 }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-50">
								<span>
									三坑米数
									<span>{{ orderTakeData.tLength3 }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-50">
								<span>
									按单米数
									<span>{{ orderTakeData.tLength }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-50">
								<span>
									未排米数
									<span>{{ orderTakeData.wTLength }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-50">
								<span>
									接单客户数
									<span>{{ orderTakeData.ccount }}</span>
								</span>
							</div>
						</div>
					</card>
				</template>
				<template v-else>
					<v-table 
						is-horizontal-resize 
						:is-vertical-resize="true" 
						style="width:100%;"  
						:columns="config.table.columns.orderTake" 
						:table-data="config.table.data.orderTake" 
						row-hover-color="#eee" 
						row-click-color="#edf7ff" 
						:height="0.5 * viewH" 
						even-bg-color="#fafafa">
					</v-table>
				</template>
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;"  
					:columns="config.table.columns.meters" 
					:table-data="config.table.data.planSum"  
					:height="0.5 * viewH - config.table.commonH" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					even-bg-color="#fafafa">
				</v-table>
			</van-tab>
			<van-tab title="客户">
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;"  
					:columns="config.table.columns.cus" 
					:table-data="config.table.data.cus" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					:height="viewH - config.table.commonH" 
					even-bg-color="#fafafa">
				</v-table>
			</van-tab>
			<van-tab title="业务员">
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;"  
					:columns="config.table.columns.task" 
					:table-data="config.table.data.task" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					:height="viewH - config.table.commonH" 
					even-bg-color="#fafafa">
				</v-table>
			</van-tab>
		</van-tabs>
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	/*vant组件*/
	import { Tab, Tabs, SwitchCell } from "vant"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义拖动组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { fetchList } from "@/api/staff/statis.js"

	export default {
		components:{
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[SwitchCell.name]: SwitchCell,

			PopupFilter,
			DragMenu,
			TimeRangePicker
		},
		data(){
			return {
				/*页面配置*/
				config:{
					/*筛选条件*/
					filter: {
						show: false,
					},
					switch:{
						checked:false
					},
					table:{
						commonH: 44,
						columns:{
							cus:[],
							task:[],
							meters:[],
							orderTake:[]
						},
						data:{
							cus:[],
							task:[],
							planSum:[],
							orderTake:[]
						}
					},
					produce:0
				},
				orderTakeData:{
					ordAmt: null,
					tLength0: null,
					tLength1: null,
					tLength2: null,
					tLength3: null,
					tLength: null,
					wTLength: null,
					ccount: null
				},
				/*筛选条件*/
				formData: {
					tabs: 0,
					dataType: 7,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
				}
			}
		},
		async created(){
			await this.$store.commit('staff/setHeaderTitle','接单统计')
			await this.setColums()
			if(  getStorage('hide/SaleStatis') !== null  ){
				let storageData = JSON.parse(getStorage('hide/SaleStatis'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getSaleStatisData()
			} else {
				await this.getConfig()
			}
		},
		mounted() {
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		destroyed() {
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods:{
			/*筛选按钮*/
			menuClick() {
				this.config.filter.show = true
			},
			/*获取页面参数*/
			async getConfig() {
				const { result } = await getWebConfig({paramType: 'staffHide'})
				this.formData.maxDate = result.OrderTakeMaxDate
				this.formData.minDate = result.OrderTakeMinDate
				this.formData.beginDate = result.OrderTakeBeginDate
				this.formData.endDate   = result.OrderTakeEndDate
				this.config.produce = result.produce
				await this.getSaleStatisData()
			},
			/*获取数据*/
			async getSaleStatisData() {
				this.orderTakeData = this.$options.data().orderTakeData
				this.config.table.data = this.$options.data().config.table.data
				const { result } = await fetchList(this.formData)
				if(this.config.produce == 1) {
					this.config.table.data.orderTake = result.facOrdSum
				} else {
					this.orderTakeData = result.facOrdSum
				}
				this.config.table.data.cus = result.cusOrdSum
				this.config.table.data.task = result.taskOrdSum
				this.config.table.data.planSum = result.wPlanSum
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
				await this.getSaleStatisData()
			},
			/*设置表格列信息*/
			async setColums() {
				this.config.table.height = window.screen.height - 186
				this.config.table.meterTableHeight = window.screen.height - 508
				const { result } = await fetchColList({tableName: 104})
				this.config.table.columns.cus = result.cusSale
				this.config.table.columns.task = result.taskSale
				this.config.table.columns.meters = result.meterSale
				this.config.table.columns.orderTake = result.ordSale
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('hide/SaleStatis', this.formData)
				}else{
					removeStorage('hide/SaleStatis')
				}
			}
		},
		
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>