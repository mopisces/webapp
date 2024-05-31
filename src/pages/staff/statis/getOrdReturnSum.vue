<!-- 退货统计 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<div>
			<card 
				v-for="(item,index) in config.indexList" 
				:key="index"
				:title="item.title"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>退货数量:
							<span class="mg-left-20">{{ item.returnQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>销售面积:
							<span class="mg-left-20">{{ item.tSalesArea }}㎡</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>附加费用:
							<span class="mg-left-20">{{ item.returnFee }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>合计金额:
							<span class="mg-left-20">{{ item.amt }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>合计数量:
							<span class="mg-left-20">{{ item.sumCount }}</span>
						</span>
					</div>
				</div>
				<div v-if="formData.stateType != 0" slot="actions" class="card-actions">
					<div class="card-actions-item" @click="detailClick(item)">
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
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件" />
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
	/*自定义拖动菜单组件*/
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
			UniCheckBox,
			TimeRangePicker,
			DragMenu,
			Card
		},
		data(){
			return {
				config: {
					switch: {
						checked: false
					},
					radio: {
						dateType: [
							{ title:'退货日期', value:3 },
							{ title:'生效日期', value:4 },
						],
						stateType: [
							{ title: '汇总', value: 0 },
							{ title: '按退货原因', value: 1 },
							{ title: '按客户', value: 2 }
						],
					},
					filter: {
						show:false,
					},
					indexList: []
				},
				/*筛选条件*/
				formData: {
					//数据类型
					//0->库存统计 1->退货统计 2->传单统计 3->订单统计1
					dataType: 1,
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
					dateType: 3,
					//筛选条件
					filterName: null,
					//筛选内容
					filterVal: null,
				},
			}
		},
		async created(){
			this.$store.commit('staff/setHeaderTitle','退货统计')
			this.$store.commit('staff/setBackPath', '/staff/index/menu')
			if( getStorage('statis/getOrdReturnSum') ){
				let storageData = JSON.parse(getStorage('statis/getOrdReturnSum'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getOrdReturnSum()
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
			/*详情点击*/
			detailClick( item ){
				this.$store.commit('staff/setBackPath', '/staff/statis/getOrdReturnSum')
				var filterVal,
					filterName
				if( this.formData.stateType == 1 ) {
					filterName = 4
					filterVal = item.returnCause
				}else if( this.formData.stateType == 2 ) {
					filterName = 2
					filterVal = item.cusId
				}
				this.$router.push({
					path: '/staff/statis/fetchDetail',
					query: {
						dateType: this.formData.dateType,
						beginDate: this.formData.beginDate,
						endDate: this.formData.endDate,
						filterName: filterName,
						filterVal: filterVal,
						getOrdersType: 2
					} 
				})
			},
			/*筛选按钮点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*获取页面参数*/
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				this.formData.beginDate = result.GetOrdReturnSumBeginDate
				this.formData.endDate = result.GetOrdReturnSumEndDate
				this.formData.minDate = result.GetOrdReturnSumMinDate
				this.formData.maxDate = result.GetOrdReturnSumMaxDate
				await this.getOrdReturnSum()
			},
			/*获取数据列表*/
			async getOrdReturnSum(){
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*重置按钮点击*/
			async reset(){
				this.formData = this.$options.data().formData
				this.config.switch.checked = false	
				this.config.filter.show = false
				await this.getConfig()
			},
			/*筛选按钮点击*/
			async filter(){
				await this.getOrdReturnSum()
			},
			/*存储页面筛选信息*/
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('statis/getOrdReturnSum',this.formData);
				}else{
					removeStorage('statis/getOrdReturnSum');
				}
			}
		},
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>