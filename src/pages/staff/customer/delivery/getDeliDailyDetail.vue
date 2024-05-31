<!-- 客户每日订单详细信息 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
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
			:height="viewH - config.table.commonH"
			even-bg-color="#fafafa"
		>
		</v-table>
		<!-- 客户信息 -->
		<van-popup 
			v-model="config.popup.cust.show" 
			:style="{ width: '95%', backgroundColor: '#f1f1f1', paddingBottom: '0.625rem' }"
			:round="true"
		>
			<card 
				:title="custInfo.cusShortName"
				:extra="custInfo.taskName"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>时间区间:
							<span class="mg-left-20">{{ custInfo.rangeDate }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货单笔数:
							<span class="mg-left-20">{{ custInfo.iCount }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货数量:
							<span class="mg-left-20">{{ custInfo.deliQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>销售面积:
							<span class="mg-left-20">{{ custInfo.tSalesArea }}㎡</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货立方:
							<span class="mg-left-20">{{ custInfo.tVolume }}m³</span>
						</span>
					</div>
				</div>
			</card>
		</van-popup>
		<!-- 筛选弹窗 -->
		<popup-filter 
			:filterShow.sync="config.popup.filter.show" 
			@resetClick="reset"
			@filterClick="filter"
		>
			<div slot="filter-field-1">
				<van-field 
					label="订单编号" 
					v-model="formData.orderId" 
					placeholder="模糊查询" 
					input-align="center"
				></van-field>
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
					label="订单数量" 
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
			</div>
		</popup-filter>
	</div>
</template>
<script>
	/*vant组件*/
	import { Popup, Field, Step, Steps } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义翻页组件*/
	import KarryPrevNext from "@/components/karry/prevNext/KarryPrevNext.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义纸板规格*/
	import KarryBdGauge from "@/components/karry/bdGauge/KarryBdGauge.vue"
	/*api接口*/
	import { fetchList } from "@/api/staff/customer.js"
	import { fetchColList } from "@/api/common/tableColumn.js"

	export default {
		components: {
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Step.name]: Step,
			[Steps.name]: Steps,

			DragMenu,
			PopupFilter,
			TimeRangePicker,
			KarryPrevNext,
			Card,
			KarryBdGauge
		},
		data() {
			return {
				/*页面配置*/
				config: {
					popup: {
						filter: {
							show: false
						},
						cust: {
							show: false
						}
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
								text: '客户',
								iconPath: 'info-o',
								active: false
							}
						]
					},
					/*表格配置*/
					table: {
						/*中间其他部分高度单位px*/
						commonH: 60,
						columns: []
					},
					/*表格数据*/
					indexList: []
				},
				/*客户信息*/
				custInfo: {
					cusShortName: null,
					taskName: null,
					rangeDate: null,
					iCount: null,
					deliQty: null,
					tSalesArea: null,
					tVolume: null
				},
				/*筛选条件*/
				formData: {
					//数据类型 3->获取日期数据 4->获取列表数据
					dataType: 3,
					//内部订单号
					orderId: null,
					//客户订单号
					cusPoNo: null,
					//板长
					bdL: null,
					//板宽
					bdW: null,
					//压线信息
					scoreInfo: null,
					//订单数量
					ordQty: null,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					//送货日期
					dnDate: null,
					//客户
					cusId: null
				}
			}
		},
		async created(){
			await this.$store.commit('staff/setHeaderTitle', '每日送货详细信息')
			if( this.$route.query ) {
				this.formData = Object.assign({}, this.$options.data().formData, this.$route.query)
				await this.fetchDateList()
			} else {
				this.$router.replace('/staff/index/menu')
			}
		},
		async mounted() {
			await this.setColums()
		},
		watch: {
			async dnDateChange(nVal, oVal) {
				this.config.indexList = this.$options.data().config.indexList
				if( nVal ) {
					await this.fetchTableList()
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
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 101})
				this.config.table.columns = result
			},
			/*菜单点击*/
			async trigger({index, item}) {
				if(index == 0) {
					this.config.popup.filter.show = true
				} else {
					this.custInfo = this.$options.data().custInfo
					const { result } = await fetchList({
						dataType: 2,
						//数据分类 1->列表数据 2->员工信息 3->客户信息
						stateType: 3,
						beginDate: this.formData.beginDate,
						endDate: this.formData.endDate
					})
					this.custInfo = result
					this.config.popup.cust.show = true
				}
			},
			/*获取日期列表*/
			async fetchDateList() {
				this.config.indexList = this.$options.data().config.indexList
				this.formData.dataType = 3
				const { result } = await fetchList(this.formData)
				this.$refs.deliDailyDate.complete(result)
			},
			/*获取表格数据*/
			async fetchTableList() {
				this.config.indexList = this.$options.data().config.indexList
				this.formData.dataType = 4
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*重置按钮*/
			async reset() {
				this.formData = Object.assign({}, this.$options.data().formData, this.$route.query)
				this.config.popup.filter.show = false
				await this.fetchDateList()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchDateList()
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>