<!-- 开票信息 -->
<template>
	<div class="page-color bill-center-pd" :style="'min-height: '+ viewH/16 +'rem;'">
		<!-- 筛选按钮 -->
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<!-- 数据 -->
		<card 
			title="开票信息"
			:extra="formData.beginDate+'~'+formData.endDate"
			:is-shadow="true"
		>
			<div class="card-body-container">
				<div class="card-body-item card-body-item-100">
					<span>上月未开:
						<span class="mg-left-20 blue-color">{{ cardInfo.LastInvAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>本月应开:
						<span class="mg-left-20 gray-color">{{ cardInfo.InvAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>本月已开:
						<span class="mg-left-20 green-color">{{ cardInfo.DNInvAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>本月未开:
						<span class="mg-left-20 red-color">{{ cardInfo.NeedInvAmt }}</span>
					</span>
				</div>
			</div>
		</card>
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
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>

<script>
	import { SwitchCell } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfigJWT } from '@/api/common/webConfig.js'
	import { fetchList } from "@/api/client/customer.js"

	export default {
		components: {
			[SwitchCell.name]: SwitchCell,

			PopupFilter,
			TimeRangePicker,
			DragMenu,
			Card
		},
		data() {
			return {
				/*配置信息*/
				config: {
					filter: {
						show: false
					},
					switch: {
						checked: false
					}
				},
				/*筛选条件*/
				formData: {
					/*数据类型4->开票信息*/
					dataType: 4,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
				},
				/*数据*/
				cardInfo: {
					lastInvAmt: null,
					invAmt: null,
					dnInvAmt: null,
					needInvAmt: null
				}
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '开票信息')
			if( getStorage('client/billCenter') ) {
				let storageData = JSON.parse(getStorage('client/billCenter'))
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
			/*获取页面参数*/
			async getConfig() {
				const { result } = await getWebConfigJWT({paramType: 'clientBill'})
				this.formData.beginDate = result.GetCusBillCenterBeginDate
				this.formData.endDate = result.GetCusBillCenterEndDate
				this.formData.minDate = result.GetCusBillCenterMinDate
				this.formData.maxDate = result.GetCusBillCenterMaxDate
				await this.fetchData()
			},
			/*获取页面数据*/
			async fetchData() {
				this.cardInfo = this.$options.data().cardInfo
				const { result } = await fetchList(this.formData)
				this.cardInfo = result
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.filter.show = false
				this.config.switch.checked = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchData()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client/billCenter', this.formData)
				} else {
					removeStorage('client/billCenter')
				}
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';

	.bill-center-pd {
		padding-top: 0.5rem;
	}
</style>