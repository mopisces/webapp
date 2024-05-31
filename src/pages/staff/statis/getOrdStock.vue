<!-- 库存统计 -->
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
		<div class="page-color">
			<card 
				:title="item.title" 
				:is-shadow="true"
				v-for="(item,index) in config.indexList" 
				:key="index"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>库存数量:
							<span class="mg-left-20">{{ item.stockQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>库存面积:
							<span class="mg-left-20">{{ item.stockArea }}㎡</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>库存金额:
							<span class="mg-left-20">{{ item.stockAmt }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>合计数量:
							<span class="mg-left-20">{{ sumCount }}</span>
						</span>
					</div>
				</div>
				<template v-if="formData.stateType != 0">
					<div slot="actions" class="card-actions">
						<div class="card-actions-item" @click="detailClick(item)">
							<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
							<span class="card-actions-item-text blue-color">订单</span>
						</div>
					</div>
				</template>
				
			</card>
			<van-divider>{{ config.indexList.length > 0 ? '我也是有底线的' : '暂无数据' }}</van-divider>
  		</div>
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="formData.cusId"></cus-picker>
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
				<van-field 
					label="在库超期天数" 
					input-align="center" 
					v-model="formData.remainDay" 
					type="number">
				</van-field>
				<van-field 
					label="交货超期天数" 
					input-align="center" 
					v-model="formData.diffDay" 
					type="number"
				></van-field>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	/*vant组件*/
	import { Icon, Field, SwitchCell, Divider } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
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
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Divider.name]: Divider,

			PopupFilter,
			CusPicker,
			
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
					radio: {
						dateType: [
							{ title: '订单日期', value:1 },
							{ title: '交货日期', value:2 },
						],
						stateType: [
							{ title: '汇总', value: 0 },
							{ title: '按客户', value:1  },
						]
					},
					indexList: []
				},
				/*筛选条件*/
				formData: {
					//数据类型
					//0->库存统计 1->退货统计 2->传单统计 3->订单统计1
					dataType: 0,
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
					dateType: 1,
					//在库超期天数
					remainDay: 0,
					//交货超期天数
					diffDay: 0,
					//客户名称
					cusId: '',
				}
			}
		},
		async created() {
			this.$store.commit('staff/setHeaderTitle','库存统计')
			this.$store.commit('staff/setBackPath', '/staff/index/menu')
			if( getStorage('statis/getOrdStock') ){
				let storageData = JSON.parse(getStorage('statis/getOrdStock'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getOrdStock()
			} else {
				this.getConfig()
			}
		},
		mounted() {
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		destroyed() {
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			/*筛选点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*详情点击*/
			detailClick( item ){
				this.$store.commit('staff/setBackPath', '/staff/statis/getOrdStock')
				this.$router.push({
					path: '/staff/statis/fetchDetail',
					query: {
						dateType: this.formData.dateType,
						beginDate: this.formData.beginDate,
						endDate: this.formData.endDate,
						filterName: 2,
						filterVal: item.cusId,
						getOrdersType: 3,
						remainDay: this.formData.remainDay,
						diffDay: this.formData.diffDay
					} 
				})
			},
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				this.formData.beginDate = result.GetOrdStockBeginDate
				this.formData.endDate = result.GetOrdStockEndDate
				this.formData.remainDay = result.GetOrdStockiDiffDDay
				this.formData.diffDay = result.GetOrdStockiRemainDay
				this.formData.maxDate = result.GetOrdStockMaxDate
				this.formData.minDate = result.GetOrdStockMinDate
				await this.getOrdStock()
			},
			async getOrdStock(){
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			async reset(){
				this.formData = this.$options.data().formData
				this.config.switch.checked = false
				this.config.filter.show = false
				removeStorage('statis/getOrdStock')
				await this.getConfig()
				
			},
			async filter(){
				await this.getOrdStock()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('statis/getOrdStock', JSON.stringify(this.formData))
				}else{
					removeStorage('statis/getOrdStock')
				}
			}
		},
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>