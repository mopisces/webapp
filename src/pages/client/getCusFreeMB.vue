<!-- 对账单 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<!-- 头部标签页 -->
		<van-sticky :offset-top="46">
			<van-tabs v-model="formData.ordState" @change="change">
				<van-tab title="送货" name="1"></van-tab>
				<van-tab title="退货" name="2"></van-tab>
				<van-tab title="调账折扣" name="3"></van-tab>
			</van-tabs>
		</van-sticky>
		<!-- 数据列表 -->
		<van-pull-refresh 
			v-model="config.pullRefresh.reloading" 
			@refresh="pullOnRefresh"
		>
			<card 
				:title="item.dnStr" 
				:extra="item.strOrderId"
				:subTitle="item.cusPoNo"
				:is-shadow="true"
				v-for="(item, index) in config.indexList" 
				:key="index"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>生效日期:
							<span class="mg-left-20">{{ item.issueDate }}</span>
						</span>
					</div>
					<div v-if="formData.ordState == 3" class="card-body-item card-body-item-100">
						<span>订单类型:
							<span class="mg-left-20">{{ item.cTypeName }}</span>
						</span>
					</div>
					<div v-if="item.guiGe" class="card-body-item card-body-item-100">
						<span>订单规格:
							<span class="mg-left-20">{{ item.guiGe }}</span>
						</span>
					</div>
					<div v-if="item.deliQty" class="card-body-item card-body-item-100">
						<span>送货数量:
							<span class="mg-left-20">{{ item.deliQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货金额:
							<span class="mg-left-20">{{ item.amount }}元</span>
						</span>
					</div>
				</div>
				<template v-if="formData.ordState != 3">
					<div slot="actions" class="card-actions">
						<div class="card-actions-item" @click="detail(item.strOrderId)">
							<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
							<span class="card-actions-item-text blue-color">详情</span>
						</div>
					</div>
				</template>
			</card>
			<van-divider>{{ config.indexList.length > 0 ? '我也是有底线的' : '暂无数据' }}</van-divider>
		</van-pull-refresh>
		<!-- 筛选弹窗 -->
		<popup-filter 
			:filterShow.sync="config.filter.show" 
			@resetClick="reset" 
			@filterClick="filter"
		>
			<div slot="filter-field-1">
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
	import { Icon, PullRefresh, SwitchCell, Divider, Sticky, Tab, Tabs } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义订单详细信息组件*/
	import OrdDesc from "@/components/karry/ordDesc/OrdDesc.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchList } from "@/api/client/customer.js"
	export default {
		components: {
			[Icon.name]: Icon,
			[PullRefresh.name]: PullRefresh,
			[SwitchCell.name]: SwitchCell,
			[Divider.name]: Divider,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter,
			Card,
			TimeRangePicker,
			DragMenu,
			OrdDesc
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					switch: {
						checked: false
					},
					/*下拉刷新*/
					pullRefresh: {
						reloading: false
					},
					/*订单详情*/
					ordDesc: {
						show: false,
						cusOrderId: null
					},
					/*数据列表*/
					indexList: []
				},
				/*筛选条件*/
				formData: {
					/*数据类型2->对账单*/
					dataType: 2,
					/**
					 * 订单类型
					 * 1->送货 2->退货 3->调账折扣
					 */
					ordState: 1,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
				},
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '对账单')
			if( getStorage('client-order/getCusFreeMB') !== null ) {
				let storageData = JSON.parse(getStorage('client-order/getCusFreeMB'))
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
			/*头部标签改变*/
			async change(name, title) {
				await window.scrollTo(0, 0)
				await this.fetchData()
			},
			/*获取页面参数*/
			async getConfig() {
				const { result } = await getWebConfig({paramType: 'clientCB'})
				this.formData.beginDate = result.GetCusFreeMBBeginDate
				this.formData.endDate = result.GetCusFreeMBEndDate
				this.formData.maxDate = result.GetCusFreeMBMaxDate
				this.formData.minDate = result.GetCusFreeMBMinDate
				await this.fetchData()
			},
			/*获取数据列表*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*下拉刷新*/
			async pullOnRefresh() {
				this.config.indexList = this.$options.data().config.indexList
				await this.fetchData()
				this.config.pullRefresh.reloading = false
			},
			/*详情点击*/
			detail( strOrderId ) {
				this.config.ordDesc.show = true
				this.config.ordDesc.cusOrderId = strOrderId
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.filter.show = false
				this.config.switch.checked = false
				await this.getConfig()
			},
			/*搜索按钮*/
			async filter() {
				await this.fetchData()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client-order/getCusFreeMB', this.formData)
				}else{
					removeStorage('client-order/getCusFreeMB')
				}
			},
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>