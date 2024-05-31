<!-- 客户信用余额明细 -->
<template>
	<div class="page-color page-use-pd" :style="'min-height: '+ viewH/16 +'rem;'">
		<!-- 菜单 -->
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<!-- 流水明细 -->
		<card 
			:is-shadow="true"
			v-for="(item, idx) in config.indexList" 
			:key="idx"
		>
			<div class="card-body-container">
				<div class="card-item card-body-item-100">
					<div class="card-item-title">{{ item.title }}</div>
					<div class="card-item-title">{{ item.realAmt }}</div>
				</div>
				<div class="card-item card-body-item-100 page-use-pd">
					<div class="card-item-val">{{ item.opDate }}</div>
					<div class="card-item-val-extra">{{ item.curLeftMinAmt }}</div>
				</div>
				<div class="card-item card-body-item-100 page-use-pd">
					<div class="card-item-remark">{{ item.reamark }}</div>
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
				<uni-check-box
					label="订单状态"
					:localdata="config.radio.opType"
					:radioData.sync="formData.opType" 
					:map="{text: 'title', value: 'value'}"
					:multiple="true"
					:min="1"
				>
				</uni-check-box>
				<uni-check-box
					label="隐藏回签"
					:localdata="config.radio.ordState"
					:radioData.sync="formData.ordState" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>

<script>
	import { Cell, Icon, CellGroup, Checkbox, Field, SwitchCell, Dialog, Sticky } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义选择组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchList } from "@/api/client/customer.js"
	export default {
		components: {
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Checkbox.name]: Checkbox,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Dialog.Component.name]: Dialog.Component,
			[Sticky.name]: Sticky,

			PopupFilter,
			DragMenu,
			UniCheckBox,
			TimeRangePicker,
			Card
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*单选条件*/
					radio: {
						opType: [],
						ordState: [
							{ title: '隐藏回签', value: 0 },
							{ title: '显示回签', value: 1 },
						]
					},
					switch: {
						checked: false
					},
					indexList: [],
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 20->客户信用余额明细
					 */
					dataType: 20,
					/*是否回签*/
					ordState: 1,
					/*选择类型*/
					opType: ['全部'],
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
			this.$store.commit('client/setHeaderTitle', '客户信用余额明细')
			if( getStorage('client-statement/bal') !== null ) {
				let storageData = JSON.parse(getStorage('client-statement/bal'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				this.getConfig(false)
			} else {
				this.getConfig(true)
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
			/*获取参数*/
			async getConfig( needTime = true ){
				//this.config.radio = this.$options.data().config.radio
				const { result } = await getWebConfig({paramType: 'clientFrec'})
				if( needTime ) {
					this.formData.maxDate = result.maxDate
					this.formData.minDate = result.minDate
					this.formData.beginDate = result.beginDate
					this.formData.endDate = result.endDate
					this.formData.opType = result.selected
				}
				this.config.radio.opType = result.opType
				await this.fetchData()
			},
			/*获取列表*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
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
					setStorage('client-statement/bal', this.formData)
				}else{
					removeStorage('client-statement/bal')
				}
			}
		},
	}
</script>

<style type="text/css" scoped>
	@import '~@/assets/style/card.css';
	
	.card-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.card-item-title {
		font-size: 0.9rem;
		font-weight: 700;
		line-height: 1rem;
	}

	.card-item-val {
		font-size: 0.875rem;
		padding-top: 0.125rem;
		color: #6a6a6a;
	}

	.card-item-val-extra {
		font-size: 0.9rem;
		padding-top: 0.1rem;
		font-weight: 700;
		color: #969799;
	}

	.page-use-pd {
		padding-top: 0.25rem;
	}

	.card-item-remark {
		font-size: 0.75rem;
		color: #969799;
	}

	.header-container{
		padding-bottom: 0.2rem;
		width: 100%;
		height: 3.625rem;
		background-color: #f1f1f1; 
	}
</style>