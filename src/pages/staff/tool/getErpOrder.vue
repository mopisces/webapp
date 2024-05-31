<!-- erp订单 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<!-- tab头部标签 -->
		<van-sticky :offset-top="46">
			<van-tabs v-model="formData.ordState" @change="change">
				<van-tab title="全部" name="0"></van-tab>
				<van-tab title="未审核" name="1"></van-tab>
				<van-tab title="已审核" name="2"></van-tab>
				<van-tab title="已传单" name="3"></van-tab>
				<van-tab title="已入库" name="4"></van-tab>
				<van-tab title="已送货" name="5"></van-tab>
				<van-tab title="有退货" name="6"></van-tab>
			</van-tabs>
		</van-sticky>
		<!-- 菜单按钮 -->
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
		<van-pull-refresh 
			v-model="config.pullRefresh.reloading" 
			@refresh="pullOnRefresh"
		>
			<van-list 
				v-model="config.list.loading" 
				:finished="config.list.finished" 
				finished-text="没有更多了" 
				:immediate-check="false"
				@load="onLoad"
			>
				<card 
					:title="item.strOrderId" 
					:extra="item.cusPoNo"
					:is-shadow="true"
					v-for="(item,index) in config.indexList" 
					:key="index"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-100">
							<span>客户信息:
								<span class="mg-left-20">{{ item.cusShortName }}({{ item.cusId}})</span>
							</span>
						</div>
						<div 
							v-if="item.matName"
							class="card-body-item card-body-item-100"
						>
							<span>货品名称:
								<span class="mg-left-20">{{ item.matName }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt">规格信息</div>:
							<span class="mg-left-20">{{ item.guiGe }}</span>
							<span class="mg-left-20">{{ item.boardId }}</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>压线信息:
								<span class="mg-left-20">{{ item.scoreInfo }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt blue-color">订单</div>|
							<div class="card-body-txt yellow-color">送货</div>|
							<div v-if=" item.returnQty > 0 " class="card-body-txt red-color">退货</div>:
							<span class="mg-left-20 blue-color">{{ item.ordQty }}</span>
							<span class="mg-left-20 yellow-color">{{ item.deliQty }}</span>
							<span v-if=" item.returnQty > 0 "  class="mg-left-20 red-color">{{ item.returnQty }}</span>
						</div>
						<div v-if="formData.ordState >= 3 " class="card-body-item card-body-item-100">
							<div class="card-body-txt blue-color">传单</div>|
							<div class="card-body-txt green-color">完工</div>:
							<span class="mg-left-20 blue-color">{{ item.schQty || '暂无数据' }}</span>
							<span class="mg-left-20 green-color">{{ item.finishedQty || '暂无数据' }}</span>
						</div>
					</div>
					<div slot="actions" class="card-actions">
						<div class="card-actions-item" @click="detail(item.strOrderId)">
							<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
							<span class="card-actions-item-text blue-color">详情</span>
						</div>
					</div>
				</card>
			</van-list>
		</van-pull-refresh>
		<!-- 筛选弹窗 -->
		<popup-filter 
			:filterShow.sync="config.filter.show" 
			@resetClick="reset" 
			@filterClick="filter"
		>
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="formData.cusId" ></cus-picker>
				<van-field 
					label="订单编号" 
					v-model="formData.orderId" 
					placeholder="精确查询" 
					input-align="center"  
					type="number" 
					maxlength="10"
				></van-field>
				<van-field 
					label="订单数" 
					v-model="formData.ordQty" 
					placeholder="精确查询" 
					input-align="center" 
					type="number" 
					maxlength="10"
				></van-field>
				<karry-bd-gauge 
					:bdL.sync="formData.bdL"
					:bdW.sync="formData.bdW"
				/>
				<karry-box-gauge 
					:boxL.sync="formData.boxL" 
					:boxW.sync="formData.boxW" 
					:boxH.sync="formData.boxH" 
				/>
				<uni-check-box
					label="日期"
					:localdata="config.radio.dateType"
					:radioData.sync="formData.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<!-- 订单详细信息 -->
		<ord-desc 
			:detailShow.sync="config.ordDesc.show"
			:cusOrderId="config.ordDesc.cusOrderId"
		></ord-desc>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon, Field, PullRefresh, List, SwitchCell, Sticky, Tab, Tabs } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义客户筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义订单详细信息组件*/
	import OrdDesc from "@/components/karry/ordDesc/OrdDesc.vue"
	/*自定义纸箱规格组件*/
	import KarryBoxGauge from "@/components/karry/boxGauge/KarryBoxGauge.vue"
	/*自定义纸板规格*/
	import KarryBdGauge from "@/components/karry/bdGauge/KarryBdGauge.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchList } from "@/api/staff/tool.js"
	export default {
		components: {
			[Icon.name]: Icon,
			[Field.name]: Field,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			DragMenu,
			Card,
			PopupFilter,
			CusPicker,
			UniCheckBox,
			TimeRangePicker,
			OrdDesc,
			KarryBoxGauge,
			KarryBdGauge
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*下拉刷新*/
					pullRefresh: {
						reloading: false
					},
					/*上拉加载*/
					list: {
						loading: false,
						finished: false
					},
					/*单选组件*/
					radio: {
						dateType: [
							{title: '订单日期', value: 1},
							{title: '交货日期', value: 2}
						]
					},
					/*记录筛选条件*/
					switch: {
						checked: false
					},
					/*订单详细信息*/
					ordDesc: {
						show: false,
						cusOrderId: null
					},
					/*页面数据*/
					indexList: [],
				},
				/*筛选条件*/
				formData: {
					//数据类型 1->erp订单列表
					dataType: 1,
					/**
					 * 订单类型
					 * erp订单 1->未审核 2->已审核 3->已传单 4->已入库 5->有送货 6->有退货 7->全部
					 */
					ordState: 7,
					//订单编号
					orderId: null,
					//板长
					bdL: null,
					//板宽
					bdW: null,
					//箱长
					boxL: null,
					//箱宽
					boxW: null,
					//箱高
					boxH: null,
					//订单数量
					ordQty: null,
					/**
					 * 日期类型
					 * 1->订单日期 2->交货日期
					 */
					dateType: 1,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					//分页大小
					pageSize: 6,
					//分页当前页
					pageNo: 1
				}
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', 'ERP订单')
			if( getStorage('erp/getOrders') !== null ) {
				let storageData = JSON.parse(getStorage('erp/getOrders'))
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
				viewH: 'page/viewH'
			})
		},
		methods: {
			/*菜单点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*头部tabs改变*/
			async change(name, title) {
				await window.scrollTo(0, 0)
				//this.config.indexList = this.$options.data().config.indexList
				this.formData.pageNo = 1
				await this.fetchData()
			},
			/*获取页面参数*/
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffErp'})
				this.formData.beginDate = result.Wap1GetOrdersBeginDate
				this.formData.endDate = result.Wap1GetOrdersEndDate
				this.formData.maxDate = result.Wap1GetOrdersMaxDate
				this.formData.minDate = result.Wap1GetOrdersMinDate
				await this.fetchData()
			},
			/*获取列表数据*/
			async fetchData() {
				if( !this.formData.beginDate || !this.formData.endDate ) {
					return 
				}
				try {
					const { result } = await fetchList(this.formData)
					if( this.formData.pageNo == 1 ) {
						this.config.indexList = result
					} else {
						result.forEach((item,index)=>{
							this.config.indexList.push(item)
						})
					}
					if( result.length < this.formData.pageSize ) {
						this.config.list.finished = true
					} else {
						this.config.list.finished = false
					}
				} catch(err) {
					this.config.list.finished = true
				} finally {
					this.config.list.loading = false
				}
			},
			/*下拉刷新*/
			async pullOnRefresh() {
				this.formData.pageNo = 1
				await this.fetchData()
				this.config.pullRefresh.reloading = false
			},
			/*上拉加载*/
			async onLoad() {
				await this.formData.pageNo++
				await this.fetchData()
			},
			/*详情点击*/
			detail( strOrderId ) {
				this.config.ordDesc.cusOrderId = strOrderId
				this.config.ordDesc.show = true
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.switch.checked = false
				this.config.filter.show = false
				await this.fetchData()
			},
			/*筛选按钮*/
			async filter() {
				this.formData.pageNo = 1
				await this.fetchData()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('erp/getOrders', this.formData)
				}else{
					removeStorage('erp/getOrders')
				}
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>