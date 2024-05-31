<!-- 生产分析总计 -->
<template>
	<div :style="'min-height: '+ viewH/16 +'rem;'" class="page-color">
		<van-tabs v-model="formData.dataType" @change="tabsChange">
			<van-tab title="概况" :name="5">
				<card 
					v-for="(item,index) in config.mock.indexList"
					:key="index"
					:title="item.cateName"
					:is-shadow="true"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-100">
							<span>订单面积:
								<span class="mg-left-20">{{ item.sumOrdArea }}㎡</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>订单金额:
								<span class="mg-left-20">{{ item.sumAmt }}元</span>
							</span>
						</div>
					</div>
				</card>
			</van-tab>
			<van-tab title="详细" :name="6">
				<card 
					:title="config.mock.detail.title"
					:is-shadow="true"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-50">
							<span>订单平方:
								<span>{{ config.mock.detail.tOrdArea }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>订单米数:
								<span>{{ config.mock.detail.tOrdLen }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>订单金额:
								<span>{{ config.mock.detail.ordAmt }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>排产平方:
								<span>{{ config.mock.detail.schArea }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>排产米数:
								<span>{{ config.mock.detail.schLen }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>入库平方:
								<span>{{ config.mock.detail.ordInArea }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>入库金额:
								<span>{{ config.mock.detail.ordInAmt }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>送货平方:
								<span>{{ config.mock.detail.dnArea }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>送货金额:
								<span>{{ config.mock.detail.dnAmt }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>退货平方:
								<span>{{ config.mock.detail.reArea }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>退货金额:
								<span>{{ config.mock.detail.reAmt }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>车资运费:
								<span>{{ config.mock.detail.transAmt }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>本期收款:
								<span>{{ config.mock.detail.cusPayAmt }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>折扣调账:
								<span>{{ config.mock.detail.adjustAmt }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>原纸用量:
								<span>{{ config.mock.detail.sUseWt }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-50">
							<span>原纸金额:
								<span>{{ config.mock.detail.sUseAmt }}</span>
							</span>
						</div>
					</div>
				</card>
			</van-tab>
		</van-tabs>
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
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
				<uni-check-box
					v-if="formData.dataType == 6"
					label="日期"
					:localdata="config.radio.dateType"
					:radioData.sync="formData.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<van-switch-cell 
					v-model="config.switch.checked" 
					title="记住筛选条件"
				/>
			</div>
		</popup-filter>
	</div>
</template>

<script>
	/*vant组件*/
	import { Tab, Tabs  } from "vant"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义拖动组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"

	import { fetchList } from "@/api/staff/statis.js"
	export default {
		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			Card,
			PopupFilter,
			TimeRangePicker,
			UniCheckBox,
			DragMenu
		},
		data() {
			return {
				/*页面配置*/
				config: {
					/*筛选弹窗配置*/
					filter: {
						show: false
					},
					/*筛选条件记录*/
					switchCell: {
						checked: false
					},
					/*单选条件*/
					radio: {
						dateType: [
							{ title: '退货日期', value: 3 },
							{ title: '生效日期', value: 4 },
						]
					},
					/*数据*/
					mock: {
						/*概况数据*/
						indexList: [],
						/*详细数据*/
						detail: {}
					},
					switch: {
						checked: false
					},
				},
				/*筛选条件*/
				formData: {
					//数据类型 5->概况 6->详情
					dataType: 5,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					//日期类型
					dateType: 3
				}
			}
		},
		async mounted() {
			await this.$store.commit('staff/setHeaderTitle', '生产分析总计')
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		async created() {
			if( getStorage('statis/getProInfo') !== null ) {
				let storageData = JSON.parse(getStorage('statis/getOrderSum'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getProInfo()
			} else {
				await this.getConfig()
			}
		},
		async destroyed() {
			await this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			/*筛选按钮点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*标签页改变*/
			async tabsChange(name,title) {
				await this.getProInfo()
			},
			/*获取页面参数*/
			async getConfig() {
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				this.formData.beginDate = result.GetProInfoBeginDate
				this.formData.endDate = result.GetProInfoEndDate
				this.formData.maxDate = result.GetProInfoMaxDate
				this.formData.minDate = result.GetProInfoMinDate
				await this.getProInfo()
			},
			/*获取数据列表*/
			async getProInfo() {
				this.config.mock = this.$options.data().config.mock
				const { result } = await fetchList(this.formData)
				if( this.formData.dataType == 5 ) {
					result.forEach((item,index)=> {
						this.config.mock.indexList.push(item)
					})
				} else {
					this.config.mock.detail = result
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
				await this.getProInfo()
			},
			/*记录筛选信息*/
			beforeunloadHandler() {
				if( this.config.switch.checked ){
					setStorage('statis/getProInfo', JSON.stringify(this.formData))
				}else{
					removeStorage('statis/getProInfo')
				}
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>