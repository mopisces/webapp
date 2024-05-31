<!-- 每日送货 -->
<template>
	<div>
		<!-- 菜单 -->
		<drag-menu 
			defpositon="rt" 
			:pattern="{icon: 'plus'}"
			:content="config.menu.content"
			@trigger="trigger"
		>
		</drag-menu>
		<karry-prev-next 
			ref="deliDailyDate"
			:value.sync="formData.dnDate" 
			dataType="deliDaily"
		/>
		<v-table  
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;"  
			:columns="config.table.columns" 
			:table-data="config.indexList" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff" 
			:height="viewH" 
			even-bg-color="#fafafa">
		</v-table>
		<!-- 客户信息 -->
		<van-popup 
			v-model="config.popup.show" 
			round 
			:style="{ width: '95%', backgroundColor: '#f1f1f1', paddingBottom: '0.625rem' }"
		>
			<card
				:title="cusInfo.cusName"
				:extra="cusInfo.taskName"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>
							日期区间:
							<span class="mg-left-20">
								{{ cusInfo.rangeDate }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							送货单笔数:
							<span class="mg-left-20">
								{{ cusInfo.iCount }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							送货数量:
							<span class="mg-left-20">
								{{ cusInfo.deliQty }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							销售面积:
							<span class="mg-left-20">
								{{ cusInfo.tSalesArea }}㎡
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							送货立方:
							<span class="mg-left-20">
								{{ cusInfo.tVolume }}m³
							</span>
						</span>
					</div>
				</div>
			</card>
		</van-popup>
		<!-- 筛选弹窗 -->
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<van-field 
					label="订单编号" 
					v-model="formData.orderId" 
					placeholder="模糊查询" 
					input-align="center">
				</van-field>
				<van-field 
					label="客订单号" 
					v-model="formData.cusPoNo" 
					placeholder="模糊查询" 
					input-align="center">
				</van-field>
				<van-field 
					label="压线" 
					v-model="formData.scoreInfo" 
					placeholder="模糊查询" 
					input-align="center">
				</van-field>
				<van-field 
					label="订单数" 
					v-model="formData.ordQty" 
					placeholder="模糊查询" 
					input-align="center" 
					type="number" 
					maxlength="6">
				</van-field>
				<karry-bd-gauge 
					:bdL.sync="formData.bdL"
					:bdW.sync="formData.bdW"
				/>
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>

<script>
	import { Icon, Popup, Field, SwitchCell } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义翻页组件*/
	import KarryPrevNext from "@/components/karry/prevNext/KarryPrevNext.vue"
	/*自定义纸板规格*/
	import KarryBdGauge from "@/components/karry/bdGauge/KarryBdGauge.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { fetchList } from "@/api/client/customer.js"
	export default {
		components: {
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,

			DragMenu,
			PopupFilter,
			TimeRangePicker,
			Card,
			KarryPrevNext,
			KarryBdGauge
		},
		data() {
			return {
				/*配置*/
				config: {
					/*表格配置*/
					table: {
						columns: []
					},
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*客户信息弹窗*/
					popup: {
						show: false
					},
					switch: {
						checked: false
					},
					/*菜单*/
					menu: {
						content: [
							{
								text: '筛选',
								iconPath: 'filter-o',
								active: false
							},
							{
								text: '信息',
								iconPath: 'info-o',
								active: false
							}
						]
					},
					/*表格数据*/
					indexList: [],
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 9->每日送货日期 10->每日送货客户信息 11->每日送货详情
					 */
					dataType: 9,
					/*订单编号*/
					orderId: null,
					/*客订单号*/
					cusPoNo: null,
					/*板长*/
					bdL: null,
					/*板宽*/
					bdW: null,
					/*压线信息*/
					scoreInfo: null,
					/*订单数量*/
					ordQty: null,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					/*送货日期*/
					dnDate: null,
				},
				/*客户信息*/
				cusInfo: {
					cusName: null,
					taskName: null,
					rangeDate: null,
					iCount: 0,
					deliQty: 0,
					tSalesArea: null,
					tVolume: null
				},
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle','每日送货')
			if( getStorage('client-delivery/index') !== null ) {
				let storageData = JSON.parse(getStorage('client-delivery/index'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.fetchData()
			} else {
				await this.getConfig()
			}

		},
		async mounted() {
			await this.setColums()
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		watch: {
			async dnDateChange(nVal, oVal) {
				this.config.indexList = this.$options.data().config.indexList
				if( nVal ) {
					await this.fetchData()
				}
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			}),
			dnDateChange() {
				return this.formData.dnDate
			}
		},
		methods: {
			/*表头配置*/
			async setColums() {
				const { result } = await fetchColList({tableName: 2})
				this.config.table.columns = result
			},
			/*菜单点击*/
			async trigger({index, item}) {
				if( index == 1 ) {
					this.cusInfo = this.$options.data().cusInfo
					this.formData.dataType = 10
					const { result } = await fetchList(this.formData)
					this.cusInfo = result
					this.config.popup.show = true
				} else {
					this.config.filter.show = true
				}
			},
			/*页面配置参数*/
			async getConfig() {
				this.formData = this.$options.data().formData
				const { result } = await getWebConfig({paramType: 'clientDeli'})
				this.formData.beginDate = result.ClientDeliveryDailyBeginDate
				this.formData.endDate = result.ClientDeliveryDailyEndDate
				this.formData.maxDate = result.ClientDeliveryDailyMaxDate
				this.formData.minDate = result.ClientDeliveryDailyMinDate
				await this.fetchDateList()
			},
			/*获取日期列表*/
			async fetchDateList() {
				this.formData.dataType = 9
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.$refs.deliDailyDate.complete(result)
			},
			/*获取列表数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				this.formData.dataType = 11
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*重置按钮*/
			async reset() {
				this.config.filter.show = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchDateList()
			},
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>