<!-- 每日订单 -->
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
			:height="viewH" 
			even-bg-color="#fafafa" 
			@on-custom-comp="detail">
		</v-table>
		<!-- 客户信息弹窗 -->
		<van-popup 
			v-model="config.popup.cusInfo.show" 
			round 
			:style="{  width: '95%', backgroundColor: '#f1f1f1', paddingBottom: '0.625rem' }"
		>
			<card
				:title="cusInfo.cusName"
				:subTitle="cusInfo.merchandiser"
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
						<div class="card-body-txt blue-color">下单</div>|
						<div class="card-body-txt red-color">未排</div>|
						<div class="card-body-txt green-color">已排</div>:
						<span class="mg-left-20 blue-color">{{ cusInfo.ordCount }}</span>笔
						<span class="mg-left-20 red-color">{{ cusInfo.unSelCount }}</span>笔
						<span class="mg-left-20 green-color">{{ cusInfo.selCount }}</span>笔
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt green-color">下单</div>|
						<div class="card-body-txt blue-color">生产</div>:
						<span class="mg-left-20 green-color">{{ cusInfo.tOrdVol }}</span>m³
						<span class="mg-left-20 blue-color">{{ cusInfo.tProVol }}</span>m³
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt yellow-color">库存</div>|
						<div class="card-body-txt red-color">未送</div>:
						<span class="mg-left-20 yellow-color">{{ cusInfo.tStockVol }}</span>m³
						<span class="mg-left-20 red-color">{{ cusInfo.tUnDeliVol }}</span>m³
					</div>
					<div 
						v-if="formData.showOrdAmt == 1" 
						class="card-body-item card-body-item-100"
					>
						<span>
							排单未送:
							<span class="mg-left-20 red-color">{{ cusInfo.ordAmt }}</span>元
						</span>
					</div>
				</div>
			</card>
		</van-popup>
		<!-- 订单信息弹窗 -->
		<van-popup 
			v-model="config.popup.ordInfo.show" 
			round 
			:style="{ width: '98%', backgroundColor: '#f1f1f1', paddingBottom: '0.625rem' }"
		>
			<div style="margin: 1rem 0.2rem 0rem 0.2rem;">
				<van-steps :active="config.step.active"  style="width:100%;">
					<van-step v-for="(item,index) in config.step.status" :key="index">{{ item.value }}</van-step>
				</van-steps>
			</div>
			<card
				:title="ordInfo.CusPoNo"
				:extra="ordInfo.OrderId"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>
							规格信息:
							<span class="mg-left-20">
								{{ ordInfo.guige }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							压线信息:
							<span class="mg-left-20">
								{{ ordInfo.ScoreInfo }}
							</span>
							<span class="mg-left-20">
								{{ ordInfo.BoardName }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							订单数量:
							<span class="mg-left-20">
								{{ ordInfo.OrdQty }}
							</span>
						</span>
					</div>
					
					<div
						v-if="ordInfo.InTime" 
						class="card-body-item card-body-item-100"
					>
						<span>
							完工时间:
							<span class="mg-left-20">
								{{ ordInfo.InTime }}
							</span>
						</span>
					</div>
					<div 
						v-if="ordInfo.TimeToGo"  
						class="card-body-item card-body-item-100"
					>
						<span>
							送货时间:
							<span class="mg-left-20">
								{{ ordInfo.TimeToGo }}
							</span>
						</span>
					</div>
					<div 
						v-if="ordInfo.ConfQty"  
						class="card-body-item card-body-item-100"
					>
						<span>
							回签数量:
							<span class="mg-left-20">
								{{ ordInfo.ConfQty }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							送货司机:
							<span v-if="ordInfo.CarPName" class="mg-left-20">
								{{ ordInfo.CarPName }}
							</span>
							<span v-if="ordInfo.Phone" class="mg-left-20">
								<a :href="'tel:' + ordInfo.Phone">{{ ordInfo.Phone }}</a>
							</span>
							<span v-if="ordInfo.CarNo" class="mg-left-20">
								{{ ordInfo.CarNo }}
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
				<karry-box-gauge 
					:boxL.sync="formData.boxL" 
					:boxW.sync="formData.boxW" 
					:boxH.sync="formData.boxH" 
				/>
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<uni-check-box
					label="订单状态"
					:localdata="config.radio.sState"
					:radioData.sync="formData.sState" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>

<script>
	import { Popup, Field, SwitchCell, Step, Steps, Sticky } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义单选按钮*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义翻页组件*/
	import KarryPrevNext from "@/components/karry/prevNext/KarryPrevNext.vue"
	/*自定义纸板规格*/
	import KarryBdGauge from "@/components/karry/bdGauge/KarryBdGauge.vue"
	/*自定义纸箱规格组件*/
	import KarryBoxGauge from "@/components/karry/boxGauge/KarryBoxGauge.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { fetchList } from "@/api/client/customer.js"

	export default {
		components: {
			[Popup.name]: Popup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Step.name]: Step,
			[Steps.name]: Steps,
			[Sticky.name]: Sticky,

			DragMenu,
			PopupFilter,
			TimeRangePicker,
			UniCheckBox,
			Card,
			KarryPrevNext,
			KarryBdGauge,
			KarryBoxGauge
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*弹窗配置*/
					popup:{
						cusInfo: {
							show: false,
						},
						ordInfo: {
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
								text: '信息',
								iconPath: 'info-o',
								active: false
							}
						]
					},
					/*单选*/
					radio: {
						sState: []
					},
					/*表格配置*/
					table: {
						columns: [],
					},
					/*表格数据*/
					indexList: [],
					
					/*步骤条*/
					step: {
						active: 0,
						status: []
					},
					switch: {
						checked: false
					},
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 12->每日订单日期 13->每日订单客户信息 14->每日订单详情
					 */
					dataType: 12,
					/*订单编号*/
					orderId: null,
					/*客订单号*/
					cusPoNo: null,
					/*板长*/
					bdL: null,
					/*板宽*/
					bdW: null,
					//箱长
					boxL: null,
					//箱宽
					boxW: null,
					//箱宽
					boxH: null,
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
					/*订单日期*/
					ordDate: null,
					sState: '全部',
					/*是否显示金额*/
					showOrdAmt: 0,
				},
				/*客户信息*/
				cusInfo: {
					/*区间日期*/
					rangeDate: null,
					cusName: null,
					taskName: null,
					merchandiser: null,
					ordCount: null,
					unSelCount: null,
					selCount: null,
					tOrdVol: null,
					tProVol: null,
					tStockVol: null,
					tUnDeliVol: null,
					ordAmt: null
				},
				/*订单信息*/
				ordInfo: {
					OrderId: null,
					CusPoNo: null,
					guige: null,
					ScoreInfo: null,
					BoardName: null,
					OrdQty: null,
					sstate: null,
					InTime: null,
					TimeToGo: null,
					ConfQty: null,
					CarPName: null,
					Phone: null,
					CarNo: null
				}
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '每日订单')
			if( getStorage('client-daily/getOrdersP') !== null ) {
				let storageData = JSON.parse(getStorage('client-daily/getOrdersP'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.setColums()
				await this.getConfig(false)
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
		watch: {
			async ordDateChange(nVal, oVal) {
				this.config.indexList = this.$options.data().config.indexList
				if( nVal ) {
					await this.fetchData()
				}
			}
		},
		computed:{
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
			}),
			ordDateChange() {
				return this.formData.ordDate
			}
		},
		methods: {
			async trigger({index, item}) {
				if( index == 1 ) {
					this.cusInfo = this.$options.data().cusInfo
					this.formData.dataType = 13
					const { result } = await fetchList(this.formData)
					this.cusInfo = result
					this.config.popup.cusInfo.show = true
				} else {
					this.config.filter.show = true
				}
			},
			async getConfig( needDate=true ) {
				this.config.radio.sState = this.$options.data().config.radio.sState
				const { result } = await getWebConfig({paramType: 'clientOM'})
				this.formData.showOrdAmt = result.WGetCusOrderShowAmt
				await this.setColums()
				this.config.radio.sState = result.sState
				this.config.step.status = result.stepStatus
				if( needDate ) {
					this.formData.beginDate = result.GetOrdersPBeginDate
					this.formData.endDate = result.GetOrdersPEndDate
					this.formData.maxDate = result.GetOrdersPMaxDate
					this.formData.minDate = result.GetOrdersPMinDate
				}
				await this.fetchDateList()
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName:0})
				this.config.table.columns = result
				this.config.table.columns.map(col=> {
					if( col.field == 'OrdAmt' ) {
						col.formatter = (rowData)=>{
							if( rowData.sstate == '未审核' ){
								return '<span style="color:#ddd;">' + rowData.OrdAmt + '</span>'
							}else{
								return rowData.OrdAmt
							}
						}
					}
					return col
				})
			},
			/*获取日期数据*/
			async fetchDateList() {
				this.config.indexList = this.$options.data().config.indexList
				this.formData.dataType = 12
				const { result } = await fetchList(this.formData)
				this.$refs.dailyDate.complete(result)
			},
			/*获取列表数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				this.formData.dataType = 14
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*详情点击*/
			detail( params ) {
				if( params.type == 'clacAmtOrd' ) {
					if( this.config.indexList[this.config.indexList.length-1].guige != '汇总金额' ) {
						var total = 0
						this.config.indexList.forEach((item,index)=>{
							total += parseFloat(item.OrdAmt)
						})
						this.config.indexList.push({
							guige: '汇总金额',
							OrdQty: '----',
							OrdAmt: total.toFixed(2),
							sstate: '----',
							last: 1
						})
					}
				} else {
					this.ordInfo = this.$options.data().ordInfo
					this.config.step.active = this.$options.data().config.step.active
					this.ordInfo = this.config.indexList[ params.index ]
					let active = this.config.step.status.findIndex(item=> item.value == this.ordInfo.sstate)
					this.config.step.active = active >= 0? active:0
					this.config.popup.ordInfo.show = true
				}
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
				await this.fetchDateList()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client-daily/getOrdersP', this.formData)
				}else{
					removeStorage('client-daily/getOrdersP')
				}
			}
		},
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>