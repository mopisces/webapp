<template>
	<div>
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption">
			</chart-header-select>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<van-panel v-for="(item,index) in info.panelList" :key="index">
			<div slot="default">
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">客户编号:{{ item.CusId }}</div>
					<div class="van-col van-col--10">客户简称:{{ item.CusShortName }}</div>
				</div>
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">库存数:{{ item.StockQty }}</div>
					<div class="van-col van-col--10">库存面积:{{ item.StockArea }}</div>
				</div>
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">库存金额:{{ item.StockAmt }}</div>
					<div class="van-col van-col--10">总数:{{ item.sumCount }}</div>
				</div>
			</div>
			<div slot="footer" style="text-align: right;">
				<van-button size="small" type="info" @click="config.popup.detailShow = true">订单</van-button>
			</div>
		</van-panel>
		<statis-order-list :show.sync="config.popup.detailShow" :filterForm="filterForm" type="stockQty" v-if="config.popup.detailShow"></statis-order-list>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.options" title="日期类型" slot="filter-field-1"></radio-cell>
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timePicker.startShow = true" slot="filter-field-2"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timePicker.endShow = true" slot="filter-field-3"></van-field>
			<van-field label="在库超期天数" input-align="center" v-model="filterForm.remainDay" slot="filter-field-4" type="number"></van-field>
			<van-field label="交货超期天数" input-align="center" v-model="filterForm.diffDay" slot="filter-field-5" type="number"></van-field>
		</popup-filter>
		<time-picker :dateTimeShow.sync="config.popup.timePicker.startShow" :dateTime.sync="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="config.popup.timePicker.startShow = false" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow.sync="config.popup.timePicker.endShow" :dateTime.sync="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="config.popup.timePicker.endShow = false" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import { Button, Field, Panel, Sticky } from 'vant';
	import ChartHeaderSelect from '@/components/subject/ChartHeaderSelect.vue';
	import StatisOrderList from '@/components/subject/StatisOrderList.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,

			ChartHeaderSelect,
			StatisOrderList,
			PopupFilter,
			RadioCell,
			TimePicker
		},
		data(){
			return {
				config:{
					selectOption:{
						statisType:[
							{ text: '汇总',   value: 0, factor:'' },
							{ text: '按客户', value: 1, factor:'cusId' }
						],
						chartType:['all'],
						chartProperties:[
							{ text: '库存数', value: 'stockQty'},
	                        { text: '库存面积', value: 'stockArea'},
	                        { text: '库存金额', value: 'stockAmt'},
	                        { text: '总款数', value: 'sumCount'},
						]
					},
					popup:{
						filterShow:false,
						detailShow:false,
						chartSelect:{
							show:false
						},
						timePicker:{
							startShow:false,
							endShow:false
						}
					},
					radio:{
						options:[
							{title:'订单日期',value:1},
							{title:'交货日期',value:2},
						]
					}
				},
				info:{
					panelList:[],
				},
				filterForm:{
					sType:    3,
					dateType: 1,
					beginDate:'',
					endDate:  '',
					remainDay:0,
					diffDay:0,
					statisState:0
				},
				pageConfig:{
					beginDate:new Date(),
					endDate:new Date(),
					maxDate:new Date(),
					minData:new Date()
				}
			}
		},
		methods:{
			onRefresh(){
				this.getOrdStock( this.filterForm );
			},
			selectOption( val ){
				this.filterForm.statisState = val.statisType;
			},
			getOrdStockConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getOrdStockConfig().then(res=>{
					self.pageConfig.beginDate = new Date(res.result.date_info.GetOrdStockBeginDate);
					self.pageConfig.endDate   = new Date(res.result.date_info.GetOrdStockEndDate);
					self.pageConfig.maxDate   = new Date(res.result.date_info.GetOrdStockMaxDate);
					self.pageConfig.minData   = new Date(res.result.date_info.GetOrdStockMinDate);

					self.filterForm.beginDate = res.result.date_info.GetOrdStockBeginDate;
					self.filterForm.endDate   = res.result.date_info.GetOrdStockEndDate;
					self.filterForm.remainDay = res.result.limit_data.GetOrdStockiDiffDDay;
					self.filterForm.diffDay   = res.result.limit_data.GetOrdStockiRemainDay;

				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.getOrdStock( this.filterForm );
				});
			},
			getOrdStock( data ){
				let self = this;
				this.$request.staff.statis.getOrdStock( data ).then(res=>{
					self.info.panelList = res.result;
				});
			},
			resetClick(){
				this.getOrdStockConfig( true );
			},
			filterClick(){
				this.onRefresh();
				this.config.popup.filterShow = false;
			},
			timeBeginConfirm( value ){
				this.filterForm.beginDate = dateTimeFormat(value.value,'yyyy-MM-dd');
				this.config.popup.timePicker.startShow = false;
			},
			timeEndConfirm( value ){
				this.filterForm.endDate = dateTimeFormat(value.value,'yyyy-MM-dd');
				this.config.popup.timePicker.endShow = false;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getOrdStockConfig();
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','库存统计');
		},
		computed:{
			statisStateChange(){
				return this.filterForm.statisState;
			}
		},
		watch:{
			statisStateChange(newV,oldV){
				this.onRefresh( this.filterForm );
			}
		}
	}
</script>
