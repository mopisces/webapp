<!-- 客户每日订单列表 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
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
				is-link 
				:title="item.cusShortName+'('+item.cusId+')'" 
				:value="item.ordAmt" 
				@click="detail(item)"
			/>
		</van-cell-group>
		<!-- 员工信息 -->
		<van-popup 
			v-model="config.popup.task.show" 
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
						<span>日期区间:
							<span class="mg-left-20">{{ taskInfo.rangeDate }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>下单金额:
							<span class="mg-left-20">{{ taskInfo.ordAmt }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>下单米数:
							<span class="mg-left-20">{{ taskInfo.tLength }}m</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>下单平方:
							<span class="mg-left-20">{{ taskInfo.tSalesArea }}㎡</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>客户统计:
							<span class="mg-left-20">{{ taskInfo.cusCount }}(本日)</span>
							<span class="mg-left-20">{{ taskInfo.monthCusCount }}(本月)</span>
							<span class="mg-left-20">{{ taskInfo.dayDiff }}</span>
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
				<cus-picker :cusName.sync="formData.cusId" ref="cusPicker"></cus-picker>
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
	import { Cell, CellGroup, Popup, SwitchCell } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchList } from "@/api/staff/customer.js"
	export default {
		components: {
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Popup.name]: Popup,
			[SwitchCell.name]: SwitchCell,

			DragMenu,
			PopupFilter,
			CusPicker,
			TimeRangePicker,
			Card
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
								text: '员工',
								iconPath: 'info-o',
								active: false
							}
						]
					},
					/*弹出层*/
					popup: {
						filter: {
							show: false
						},
						task: {
							show: false
						}
					},
					switch: {
						checked: false
					},
					/*列表数据*/
					indexList: []
				},
				/*筛选条件*/
				formData: {
					//客户
					cusId: '',
					//数据类型 5->获取列表数据
					dataType: 5,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
				},
				/*客户信息*/
				taskInfo: {
					taskName: null,
					rangeDate: null,
					ordAmt: null,
					tLength: null,
					tSalesArea: null,
					cusCount: 0,
					monthCusCount: 0,
					dayDiff: 0,
				}
			}
		},
		mounted() {
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '客户每日订单')
			if( getStorage('daily/wGetCusorder') !== null   ){
				let storageData = JSON.parse( getStorage('daily/wGetCusorder') )
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getData()
			} else {
				await this.getConfig()
			}
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
			async trigger({index, item}) {
				if( index == 1 ) {
					this.taskInfo = this.$options.data().taskInfo
					this.formData.dataType = 6
					const { result } = await fetchList(this.formData)
					this.taskInfo = Object.assign({}, this.taskInfo, result)
					this.config.popup.task.show = true
				} else {
					this.config.popup.filter.show = true
				}
			},
			/*获取页面参数*/
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffDaily'})
				this.formData.beginDate = result.WGetCusOrderBeginDate
				this.formData.endDate   = result.WGetCusOrderEndDate
				this.formData.minDate = result.WGetCusOrderMinDate
				this.formData.maxDate = result.WGetCusOrderMaxDate
				await this.getData()
			},
			/*获取列表数据*/
			async getData() {
				this.formData.dataType = 5
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.popup.filter.show = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				await this.getData()
			},
			/*列表点击*/
			detail(item) {
				this.$store.commit('staff/setBackPath', '/staff/daily/wGetCusOrder')
				this.$router.push({
					path: '/staff/daily/getOrdersP',
					query: {
						beginDate: this.formData.beginDate,
						endDate: this.formData.endDate,
						maxDate: this.formData.maxDate,
						minDate: this.formData.minDate,
						cusId: item.cusId
					}
				})
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('daily/wGetCusorder', this.formData)
				}else{
					removeStorage('daily/wGetCusorder')
				}
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>