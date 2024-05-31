<!-- 往来统计 -->
<template>
	<div class="page-color statis-contact-pd" :style="'min-height: '+ viewH/16 +'rem;'">
		<!-- 筛选按钮 -->
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<!-- 页面数据 -->
		<card 
			:title="cardInfo.cusShortName+'('+cardInfo.cusId+')'"
			:extra="cardInfo.taskName+'('+cardInfo.taskId+')'"
			:is-shadow="true"
		>
			<div class="card-body-container">
				<div class="card-body-item card-body-item-100">
					<span>上次月结:
						<span>{{ cardInfo.endDate }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-50">
					<span>上期余额:
						<span>{{ cardInfo.lastAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-50">
					<span>确收金额:
						<span>{{ cardInfo.confAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-50">
					<span>调整金额:
						<span>{{ cardInfo.adjustAmt }}</span>
					</span>
				</div>

				<div class="card-body-item card-body-item-50">
					<span>收款金额:
						<span>{{ cardInfo.cusPayAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-50">
					<span>期末欠款:
						<span>{{ cardInfo.curAmt }}</span>
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
	import { getWebConfig } from "@/api/common/webConfig.js"
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
				/*配置*/
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
					/*数据类型3->来往统计*/
					dataType: 3,
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
					cusId: null,
					cusShortName: null,
					taskId: null,
					taskName: null,
					endDate: null,
					lastAmt: null,
					confAmt: null,
					adjustAmt: null,
					cusPayAmt: null,
					curAmt: null
				}
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '往来统计')
			if( getStorage('frec/statisContact') !== null ) {
				let storageData = JSON.parse(getStorage('frec/statisContact'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.fetchList()
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
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'clientFrec'})
				this.formData.maxDate = result.maxDate
				this.formData.minDate = result.minDate
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
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
					setStorage('frec/statisContact', this.formData)
				}else{
					removeStorage('frec/statisContact')
				}
			}
		},
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';

	.statis-contact-pd {
		padding-top: 0.5rem;
	}
</style>