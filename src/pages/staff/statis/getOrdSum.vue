<!-- 订单统计1 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
		<div>
			<card 
				:title="item.title" 
				:is-shadow="true"
				v-for="(item,index) in config.indexList" 
				:key="index"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">总|订单面积:</div>
						<span class="mg-left-20">{{ item.sumArea }}㎡</span>
						<span class="mg-left-20">{{ item.sumOrdArea }}㎡</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt red-color">体积</div>|
						<div class="card-body-txt blue-color">长度</div>:
						<span class="mg-left-20 red-color">{{ item.sumOrdVol }}m³</span>
						<span class="mg-left-20 blue-color">{{ item.sumLength }}m</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">总金额:</div>
						<span class="mg-left-20">{{ item.sumAmt }}元</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt red-color">订单总数</div>|
						<div class="card-body-txt blue-color">总款数:</div>
						<span class="mg-left-20 red-color">{{ item.sumQty }}</span>
						<span class="mg-left-20 blue-color">{{ item.sumCount }}</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">单坑面积|</div>
						<div class="card-body-txt">长度:</div>
						<span class="mg-left-20">{{ item.sumArea1 }}㎡</span>
						<span class="mg-left-20">{{ item.sumLength1 }}m</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">单坑金额|</div>
						<div class="card-body-txt">款数:</div>
						<span class="mg-left-20">{{ item.sumAmt1 }}元</span>
						<span class="mg-left-20">{{ item.sumCount1 }}</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">双坑面积|</div>
						<div class="card-body-txt">长度:</div>
						<span class="mg-left-20">{{ item.sumArea2 }}㎡</span>
						<span class="mg-left-20">{{ item.sumLength2 }}m</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">双坑金额|</div>
						<div class="card-body-txt">款数:</div>
						<span class="mg-left-20">{{ item.sumAmt2 }}元</span>
						<span class="mg-left-20">{{ item.sumCount2 }}</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">三坑面积|</div>
						<div class="card-body-txt">长度:</div>
						<span class="mg-left-20">{{ item.sumArea3 }}㎡</span>
						<span class="mg-left-20">{{ item.sumLength3 }}m</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">三坑金额|</div>
						<div class="card-body-txt">款数:</div>
						<span class="mg-left-20">{{ item.sumAmt3 }}元</span>
						<span class="mg-left-20">{{ item.sumCount3 }}</span>
					</div>
				</div>
				<div  v-if="formData.stateType != 0" slot="actions" class="card-actions">
					<div class="card-actions-item" @click="detailClick( item )">
						<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
						<span class="card-actions-item-text blue-color">详情</span>
					</div>
				</div>
			</card>
			<van-divider>{{ config.indexList.length > 0 ? '我也是有底线的' : '暂无数据' }}</van-divider>
		</div>
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<uni-check-box
					label="日期"
					:localdata="config.radio.dateType"
					:radioData.sync="formData.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<uni-check-box
					label="统计类型"
					:localdata="config.radio.stateType"
					:radioData.sync="formData.stateType" 
					:map="{ text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	/*vant组件*/
	import { Icon, SwitchCell, Divider } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义拖动组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"

	import { fetchList } from "@/api/staff/statis.js"
	export default {
		components:{
			[Icon.name]: Icon,
			[SwitchCell.name]: SwitchCell,
			[Divider.name]: Divider,

			PopupFilter,

			Card,
			UniCheckBox,
			TimeRangePicker,
			DragMenu
		},
		data(){
			return {
				config:{
					switch: {
						checked : false,
					},
					filter: {
						show : false,
					},
					indexList: [],
					radio: {
						dateType:[
							{ title: '订单日期', value: 1 },
							{ title: '交货日期', value: 2 },
						],
						stateType: [
							{ title: '汇总', value: 0 },
							{ title: '按坑型', value: 1 },
							{ title: '按客户', value: 2 },
							{ title: '按业务员', value: 3 },
						]
					},
					
				},
				formData: {
					//数据类型
					//0->库存统计 1->退货统计 2->传单统计 3->订单统计1
					dataType: 3,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					//统计类型
					stateType: 0,
					//日期类型
					dateType: 1
				}
			}
		},
		async created(){
			this.$store.commit('staff/setHeaderTitle', '订单统计')
			this.$store.commit('staff/setBackPath', '/staff/index/menu')
			if( getStorage('statis/getOrderSum') !== null ){
				let storageData = JSON.parse(getStorage('statis/getOrderSum'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getOrderSum()
			} else {
				await this.getConfig()
			}
		},
		mounted(){
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		destroyed(){
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods:{
			/*筛选点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*详情点击*/
			detailClick( item ){
				this.$store.commit('staff/setBackPath', '/staff/statis/getOrderSum')
				var filterVal
				if( this.formData.stateType == 1 ) {
					filterVal = item.flutes
				}else if( this.formData.stateType == 2 ) {
					filterVal = item.cusId
				}else if(  this.formData.stateType == 3  ) {
					filterVal = item.taskId
				}
				this.$router.push({
					path: '/staff/statis/fetchDetail',
					query: {
						dateType: this.formData.dateType,
						beginDate: this.formData.beginDate,
						endDate: this.formData.endDate,
						filterName: this.formData.stateType,
						filterVal: filterVal,
						getOrdersType: 1
					} 
				})
			},
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				this.formData.beginDate = result.GetOrderSumBeginDate
				this.formData.endDate = result.GetOrderSumEndDate
				this.formData.minDate = result.GetOrderSumMinDate
				this.formData.maxDate = result.GetOrderSumMaxDate
				await this.getOrderSum()
			},
			async getOrderSum() {
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			async reset() {
				this.formData = this.$options.data().formData
				this.config.switch.checked = false
				this.config.filter.show = false
				await this.getConfig()
			},
			async filter() {
				this.config.filter.show = false
				await this.getOrderSum()
			},
			beforeunloadHandler() {
				if( this.config.switch.checked ){
					setStorage('statis/getOrderSum',this.filterForm)
				}else{
					removeStorage('statis/getOrderSum')
				}
			}
		},
		
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>
