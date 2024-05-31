<!-- 客户信用余额 -->
<template>
	<div :style="'min-height: '+ viewH/16 +'rem;'" class="page-color">
		<drag-menu 
			defpositon="rt" 
			:pattern="{icon: 'plus'}"
			:content="config.menu.content"
			@trigger="trigger"
		>
		</drag-menu>
		<van-cell-group>
			<van-cell 
				v-for="(item,index) in config.indexList"
				:key="index"
				:title="item.cusName" 
				:value="item.leftMinAmtCond + '/' + item.minAmtCond" 
				@click="detail(item)" 
			/>
		</van-cell-group>
		<!-- 员工信息 -->
		<van-popup 
			v-model="config.popup.staff.show" 
			:style="{ width: '95%', backgroundColor: '#f1f1f1', paddingBottom: '0.625rem' }"
			:round="true"
		>
			<card 
				title="员工信息"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>员工信息:
							<span class="mg-left-20">{{ taskInfo.taskName }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>欠款合计:
							<span class="mg-left-20">{{ taskInfo.totalAmt }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>查询时间:
							<span class="mg-left-20">{{ taskInfo.queryTime }}</span>
						</span>
					</div>
				</div>
			</card>
		</van-popup>
		<!-- 客户信息 -->
		<van-popup 
			v-model="config.popup.cust.show" 
			:style="{ width: '95%', backgroundColor: '#f1f1f1', paddingBottom: '0.625rem' }" 
			:round="true"
		>
			<card 
				:title="rowData.cusName"
				:extra="rowData.taskName"
				:subTitle="'查询时间:'+rowData.queryTime"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>是否停单:
							<span class="mg-left-20">{{ rowData.stopped }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>是否月结:
							<span class="mg-left-20">{{ rowData.settleDay }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>下单未送:
							<span class="mg-left-20">{{ rowData.ordNeedAmt }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>信用额度:
							<span class="mg-left-20">{{ rowData.minAmtCond }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>当前欠款:
							<span class="mg-left-20">{{ rowData.curAmt }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>信用余额:
							<span class="mg-left-20">{{ rowData.leftMinAmtCond }}元</span>
						</span>
					</div>
				</div>
			</card>
		</van-popup>
		<popup-filter 
			:filterShow.sync="config.popup.filter.show" 
			@resetClick="reset" 
			@filterClick="filter"
		>
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="formData.cusId" ></cus-picker>
				<uni-check-box
					label="是否停单"
					:localdata="config.radio.stopped"
					:radioData.sync="formData.stopped" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<uni-check-box
					label="是否月结"
					:localdata="config.radio.settleDay"
					:radioData.sync="formData.settleDay" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
			</div>
		</popup-filter>
	</div>
</template>

<script>
	/*vant组件*/
	import { Popup, Cell, CellGroup } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
	/*自定义客户筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*api接口*/
	import { fetchList } from "@/api/staff/customer.js"
	export default {
		components: {
			[Popup.name]: Popup,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,

			DragMenu,
			Card,
			CusPicker,
			PopupFilter,
			UniCheckBox
		},
		data() {
			return {
				/*配置信息*/
				config: {
					/*菜单*/
					menu: {
						content: [
							{
								text: '筛选',
								iconPath: 'filter-o',
								active: false
							},
							{
								text: '员工',
								iconPath: 'info-o',
								active: false
							}
						]
					},
					/*弹窗配置*/
					popup: {
						staff: {
							show: false
						},
						cust: {
							show: false
						},
						filter: {
							show: false
						}
					},
					/*单选配置*/
					radio: {
						stopped: [
							{ title:'全部' ,value:2 },
							{ title:'是' ,value:0 },
							{ title:'否' ,value:1 }
						],
						settleDay: [
							{ title:'全部' ,value:2 },
							{ title:'是' ,value:0 },
							{ title:'否' ,value:1 },
						]
					},
					/*列表数据*/
					indexList: []
				},
				/*员工信息*/
				taskInfo: {
					taskName: null,
					totalAmt: 0,
					queryTime: null
				},
				/*筛选条件*/
				formData: {
					/*客户*/
					cusId: null,
					/*数据类型*/
					dataType: 1,
					/*是否停单 0->是1->否2->全部*/
					stopped: 2,
					/*是否月结 0->是1->否2->全部*/
					settleDay: 2
				},
				/*客户详情*/
				rowData: {
					cusName: null,
					taskName: null,
					queryTime: null,
					stopped: null,
					settleDay: null,
					ordNeedAmt: null,
					minAmtCond: null,
					curAmt: null,
					leftMinAmtCond: null
				}
			}
		},
		async created(){
			await this.$store.commit('staff/setHeaderTitle', '客户信用余额')
			await this.fetchDataList()
		},
		methods: {
			/*菜单点击*/
			trigger({index, item}) {
				if( index == 0 ) {
					this.config.popup.filter.show = true
				} else {
					this.config.popup.staff.show = true
				}
			},
			/*列表点击*/
			detail( item ) {
				this.rowData = this.$options.data().rowData
				this.rowData = Object.assign({}, this.$options.data().rowData, item)
				this.config.popup.cust.show = true
			},
			/*获取列表数据*/
			async fetchDataList() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result.list
				this.taskInfo = result.taskInfo
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.popup.filter.show = false
				await this.fetchDataList()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchDataList()
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>