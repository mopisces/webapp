<!-- 传单统计 -->
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
				:title="item.title" 
				:extra="item.sumCount"
				:is-shadow="true"
				v-for="(item,index) in config.indexList" 
				:key="index"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>订单面积:
							<span class="mg-left-20">{{ item.sumOrdArea }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>总长度:
							<span class="mg-left-20">{{ item.sumLength }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt red-color">平均修边</div>|
						<div class="card-body-txt green-color">门幅</div>:
						<span class="mg-left-20 red-color">{{ item.avgTrim }}</span>
						<span class="mg-left-20 green-color">{{ item.avgPW }}</span>
					</div>
				</div>
			</card>
			<van-divider>我也是有底线的</van-divider>
  		</div>
  		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
  			<div slot="filter-field-1">
  				<uni-check-box
					label="完工状态"
					:localdata="config.radio.sState"
					:radioData.sync="formData.sState" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
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
	import { SwitchCell, Divider } from 'vant';
	/*自定义筛选组件*/
	import PopupFilter from '@/components/subject/PopupFilter.vue'
	/*自定义卡片组件*/
	import Card from '@/components/subject/card/Card.vue'
	/*自定义单选组件*/
	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	/*自定义日期区间组件*/
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*自定义拖动菜单组件*/
	import DragMenu from '@/components/subject/fab/DragMenu.vue'
	/*本次存储方法*/
	import { getStorage, setStorage, removeStorage } from '@/util/storage'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	import { fetchList } from '@/api/staff/statis.js'
	export default {
		components:{
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
						checked: false
					},
					filter: {
						show: false,
					},
					indexList: [],
					radio:{
						sState:[
							{ title: '全部', value: 0 },
							{ title: '已传', value: 1 },
							{ title: '已提取', value: 2 },
						],
						dateType:[
							{title:'生产日期', value: 6 },
						],
						stateType: [
							{ title: '汇总', value: 0 },
							{ title: '按生产线', value: 1 },
							{ title: '按门幅', value: 2 },
							{ title: '按坑型', value: 3 },
						]
					},
				},
				/*筛选条件*/
				formData: {
					//数据类型
					//0->库存统计 1->退货统计 2->传单统计 3->订单统计1
					dataType: 2,
					//开始日期
					beginDate: '',
					//结束日期
					endDate: '',
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					//统计类型
					stateType: 0,
					//完工状态
					sState: 0,
					//日期类型
					dateType: 6,
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','传单统计')
			if( getStorage('statis/getSchSum') ){
				let storageData = JSON.parse(getStorage('statis/getSchSum')) || {}
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.getSchSum()
				this.config.switch.checked = true
			} else {
				this.getConfig()
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
			/*筛选按钮点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*获取页面参数*/
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				this.formData.beginDate = result.GetSchSumBeginDate
				this.formData.endDate = result.GetSchSumEndDate
				this.formData.minDate = result.GetSchSumMinDate
				this.formData.maxDate = result.GetSchSumMaxDate
				this.getSchSum()	
			},
			/*获取列表数据*/
			async getSchSum(){
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
				await this.getSchSum()
			},
			/*存储页面筛选信息*/
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('statis/getSchSum',this.formData)
				}else{
					removeStorage('statis/getSchSum')
				}
			}
		},
		
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>