<!-- 客户每日订单详情 -->
<template>
	<div>
		<drag-menu 
			defpositon="rt" 
			:pattern="{icon: 'plus'}"
			:content="config.menu.content"
			@trigger="trigger"
		>
		</drag-menu>
		<karry-prev-next 
			ref="dailyDate"
			:value.sync="formData.ordDate" 
			dataType="dailyOrd"
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
			:row-click="rowClick"
		>
		</v-table>
		<!-- 详细信息 -->
		<van-popup 
			v-model="config.popup.rowData.show" 
			:style="{ width: '95%', backgroundColor: '#f1f1f1', paddingBottom: '0.625rem' }"
			:round="true"
		>
			<card 
				:title="rowData.orderId"
				:extra="rowData.cusPoNo"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>材质名称:
							<span class="mg-left-20">{{ rowData.boardName }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>规格信息:
							<span class="mg-left-20">{{ rowData.guige }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>压线信息:
							<span class="mg-left-20">{{ rowData.scoreInfo }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>订单数量:
							<span class="mg-left-20">{{ rowData.ordQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>下单日期:
							<span class="mg-left-20">{{ rowData.orderDate }}</span>
						</span>
					</div>
					<div v-if="rowData.inTime" class="card-body-item card-body-item-100">
						<span>完工时间:
							<span class="mg-left-20">{{ rowData.inTime }}</span>
						</span>
					</div>
					<div v-if="rowData.timeToGo" class="card-body-item card-body-item-100">
						<span>送货时间:
							<span class="mg-left-20">{{ rowData.timeToGo }}</span>
						</span>
					</div>
					<div v-if="rowData.confQty" class="card-body-item card-body-item-100">
						<span>回签数量:
							<span class="mg-left-20">{{ rowData.confQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货司机:
							<span v-if="rowData.carPName" class="mg-left-20">{{ rowData.carPName }}</span>
							<a  v-if="rowData.phone" :href="'tel:'+rowData.phone">
								<span  class="mg-left-20" >
									{{ rowData.phone }}
								</span>
							</a>
							<span v-if="rowData.carNo" class="mg-left-20">{{ rowData.carNo }}</span>
						</span>
					</div>
				</div>
			</card>
		</van-popup>
		<!-- 客户信息 -->
		<van-popup 
			v-model="config.popup.cust.show" 
			:style="{ width: '95%', height: '13.3rem', backgroundColor: '#f1f1f1' }"
			:round="true"
		>
			<card 
				:title="custInfo.cusShortName"
				:subTitle="custInfo.merchandiser"
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
						<div class="card-body-txt blue-color">下单</div>|
						<div class="card-body-txt red-color">未排</div>|
						<div class="card-body-txt green-color">已排</div>:
						<span class="mg-left-20 blue-color">{{ custInfo.ordCount }}笔</span>
						<span class="mg-left-20 red-color">{{ custInfo.unSelCount }}笔</span>
						<span class="mg-left-20 green-color">{{ custInfo.selCount }}笔</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt blue-color">下单</div>|
						<div class="card-body-txt green-color">生产</div>:
						<span class="mg-left-20 blue-color">{{ custInfo.tOrdVol }}m³</span>
						<span class="mg-left-20 green-color">{{ custInfo.tProVol }}m³</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt yellow-color">库存</div>|
						<div class="card-body-txt red-color">未送</div>:
						<span class="mg-left-20 yellow-color">{{ custInfo.tStockVol }}m³</span>
						<span class="mg-left-20 red-color">{{ custInfo.tUnDeliVol }}m³</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>排单未送:
							<span class="mg-left-20">{{ custInfo.ordAmt }}元</span>
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
				<uni-check-box
					label="订单状态"
					:localdata="config.radio.ordState"
					:radioData.sync="formData.ordState" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
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
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义翻页组件*/
	import KarryPrevNext from "@/components/karry/prevNext/KarryPrevNext.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义纸板规格*/
	import KarryBdGauge from "@/components/karry/bdGauge/KarryBdGauge.vue"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { fetchList } from "@/api/staff/customer.js"
	export default {
		components: {
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Step.name]: Step,
			[Steps.name]: Steps,

			DragMenu,
			PopupFilter,
			TimeRangePicker,
			UniCheckBox,
			KarryPrevNext,
			Card,
			KarryBdGauge
		},
		data() {
			return {
				/*配置*/
				config: {
					/*菜单配置*/
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
					/*弹出框*/
					popup: {
						filter: {
							show: false
						},
						cust: {
							show: false
						},
						rowData: {
							show: false
						}
					},
					/*表格配置*/
					table: {
						commonH: 60,
						columns: []
					},
					/*单选配置*/
					radio: {
						ordState: []
					},
					/*状态可选*/
					step: [],
					/*列表数据*/
					indexList: [],
					/*是否显示金额*/
					showOrdAmt: false
				},
				/*客户信息*/
				custInfo: {
					cusShortName: null,
					merchandiser: null,
					taskName: null,
					rangeDate: null,
					ordCount: null,
					unSelCount: null,
					selCount: null,
					tOrdVol: null,
					tProVol: null,
					tStockVol: null,
					tUnDeliVol: null,
					ordAmt: null
				},
				/*筛选信息*/
				formData: {
					//数据类型 7->获取日期列表 8->获取表格数据
					dataType: 7,
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
					/*订单日期*/
					ordDate: null,
					/*订单类型*/
					ordState: '全部',
					//客户
					cusId: null
				},
				/*选中数据*/
				rowData: {

				}
			}
		},
		async created(){
			await this.$store.commit('staff/setHeaderTitle', '每日订单详细信息')
			await this.setColums()
			if( this.$route.query ) {
				this.formData = Object.assign({}, this.$options.data().formData, this.$route.query)
				await this.getConfig()
			} else {
				this.$router.replace('/staff/index/menu')
			}
		},
		watch: {
			async ordDateChange(nVal, oVal) {
				this.config.indexList = this.$options.data().config.indexList
				if( nVal ) {
					await this.fetchTableData()
				}
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			}),
			ordDateChange() {
				return this.formData.ordDate
			}
		},
		methods: {
			/*菜单点击*/
			async trigger({index, item}) {
				if( index == 0 ) {
					this.config.popup.filter.show = true
				} else {
					this.formData.dataType = 9
					this.custInfo = this.$options.data().custInfo
					const { result } = await fetchList(this.formData)
					this.custInfo = result
					this.config.popup.cust.show = true
				}
			},
			/*获取页面参数*/
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffDaily'})
				result.daily_order_status.forEach((item,index)=>{
					this.config.radio.ordState.push({ title:item, value:item })
					if( item != '全部' ){
						this.config.step.push({ title:item, value:item })
					}
				})
				this.config.showOrdAmt = result.WGetCusOrderShowAmt == 1 ? true : false
				await this.fetchDateList()
			},
			/*获取日期列表*/
			async fetchDateList() {
				await this.$refs.dailyDate.complete([])
				this.config.indexList = this.$options.data().config.indexList
				this.formData.dataType = 7 
			 	const { result } = await fetchList(this.formData)
			 	await this.$refs.dailyDate.complete(result)
			},
			/*获取表格数据*/
			async fetchTableData() {
				this.config.indexList = this.$options.data().config.indexList
				this.formData.dataType = 8 
			 	const { result } = await fetchList(this.formData)
			 	this.config.indexList = result
			},
			rowClick(rowIndex,rowData,column){
				this.rowData = this.$options.data().rowData
				this.rowData = rowData
				this.config.popup.rowData.show = true
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 102})
				this.config.table.columns = result
				this.config.table.columns.map(col=> {
					if( col.field == 'sstate' ) {
						col.formatter = (rowData)=>{
							return '<span style="color:#0bf147">' + rowData.sstate + '</span>';
						}
					}
					return col
				})
			},
			/*电话点击*/
			phoneClick(tel){
				window.location.tel = 'tel://' + tel
			},
			/*重置按钮*/
			async reset() {
				this.formData = Object.assign({}, this.$options.data().formData, this.$route.query)
				await this.fetchDateList()
				this.config.popup.filter.show = false
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
