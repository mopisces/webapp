<!-- 客户每日送货列表 -->
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
		<van-cell-group>
			<van-cell 
				v-for="(item,index) in config.indexList" 
				:key="index" 
				is-link 
				:title="item.title" 
				:value="item.value" 
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
							<span class="mg-left-20">{{ taskInfo.name }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>时间区间:
							<span class="mg-left-20">{{ taskInfo.rangeDate }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货金额:
							<span class="mg-left-20">{{ taskInfo.amt }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>销售面积:
							<span class="mg-left-20">{{ taskInfo.salesArea }}㎡</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货立方:
							<span class="mg-left-20">{{ taskInfo.volume }}m³</span>
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
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
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
			CusPicker,
			PopupFilter,
			TimeRangePicker,
			Card
		},
		data() {
			return {
				/*配置信息*/
				config: {
					/*弹窗配置*/
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
					/*列表数据*/
					indexList: [],
				},
				/*筛选条件*/
				formData: {
					//客户
					cusId: '',
					/*数据类型*/
					dataType: 2,
					//数据分类 1->列表数据 2->员工信息 3->客户信息
					stateType: 1,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
				},
				/*员工信息*/
				taskInfo: {
					name: null,
					rangeDate: null,
					amt: null,
					salesArea: null,
					volume: null,
				}
			}
		},
		async created(){
			await this.$store.commit('staff/setHeaderTitle', '客户每日送货')
			if( getStorage('delivery/GetDNMain') !== null   ){
				let storageData = JSON.parse(getStorage('delivery/GetDNMain'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getData()
			} else {
				await this.getConfig()
			}
			
		},
		mounted() {
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		destroyed() {
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		methods: {
			/*菜单点击*/
			async trigger({index, item}) {
				if( index == 1 ) {
					this.formData.stateType = 2
					await this.getData()
					this.config.popup.task.show = true
				} else {
					this.config.popup.filter.show = true
				}
			},
			/*获取页面参数*/
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffDeli'})
				this.formData.beginDate = result.StaffDeliveryDailyBeginDate
				this.formData.endDate = result.StaffDeliveryDailyEndDate
				this.formData.minDate = result.StaffDeliveryDailyMinDate
				this.formData.maxDate = result.StaffDeliveryDailyMaxDate
				await this.getData()
			},
			/*获取数据*/
			async getData() {
				const { result } = await fetchList(this.formData)
				if( this.formData.stateType == 1 ) {
					this.config.indexList = result
				} 
				if( this.formData.stateType == 2 ) {
					this.taskInfo = result
				}
			},
			/*列表点击*/
			detail(item) {
				this.$store.commit('staff/setBackPath', '/staff/delivery/daily')
				this.$router.push({
					path: '/staff/delivery/getCusOrdersList',
					query: {
						beginDate: this.formData.beginDate,
						endDate: this.formData.endDate,
						maxDate: this.formData.maxDate,
						minDate: this.formData.minDate,
						cusId: item.cusId
					}
				})
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.popup.filter.show = false
				this.config.switch.checked = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				this.formData.stateType = 1
				await this.getData()
			},
			beforeunloadHandler(){
				this.formData.stateType = 1
				if( this.config.switch.checked ){
					setStorage('delivery/GetDNMain', this.formData)
				}else{
					removeStorage('delivery/GetDNMain')
				}
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>