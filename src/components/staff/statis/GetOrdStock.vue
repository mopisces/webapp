<template>
	<div>
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption">
			</chart-header-select>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<high-chart v-if=" config.chart.show " :options="config.chart"></high-chart>
		<div v-else>
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
					<van-button size="small" type="info" @click="detailShowClick(item)">订单</van-button>
				</div>
			</van-panel>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;" v-if="finished">
				我也是有底线的
	  		</div>
  		</div>
		<statis-order-list :show.sync="config.popup.detailShow" :filterForm="filterForm" type="stockQty" v-if="config.popup.detailShow"></statis-order-list>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.options" title="日期类型"></radio-cell>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-field label="在库超期天数" input-align="center" v-model="filterForm.remainDay" slot="filter-field-4" type="number"></van-field>
				<van-field label="交货超期天数" input-align="center" v-model="filterForm.diffDay" type="number"></van-field>
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Panel, Sticky } from 'vant';
	import ChartHeaderSelect from '@/components/subject/ChartHeaderSelect.vue';
	import StatisOrderList from '@/components/subject/StatisOrderList.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import HighChart from '@/components/subject/chart/HighChart';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,

			ChartHeaderSelect,
			StatisOrderList,
			PopupFilter,
			RadioCell,
			NewTimePicker,
			HighChart
		},
		data(){
			return {
				finished : false,
				config:{
					getConfig : true,
					switchCell:{
						checked : false,
					},
					selectOption:{
						statisType:[
							{ text: '汇总',   value: 0, factor:'' },
							{ text: '按客户', value: 1, factor:'cusId' }
						],
						chartType:['all'],
						chartProperties:[
							{ text: '库存数',   value: 'StockQty'},
	                        { text: '库存面积', value: 'StockArea'},
	                        { text: '库存金额', value: 'StockAmt'},
	                        { text: '总款数',   value: 'sumCount'},
						]
					},
					popup:{
						filterShow : false,
						detailShow : false,
						chartSelect:{
							show : false
						},
						timePicker:{
							isFinishLoad : false
						}
					},
					radio:{
						options:[
							{ title:'订单日期', value:1 },
							{ title:'交货日期', value:2 },
						]
					},
					chart:{
						show            : false,
						xTitle          : '',
						yTitle          : '',
						categories      : [],
						data            : [],
						chartProperties : '',
						chartType       : '',
					}
				},
				info:{
					panelList:[],
				},
				filterForm:{
					sType       : 3,
					dateType    : 1,
					beginDate   : '',
					endDate     : '',
					remainDay   : 0,
					diffDay     : 0,
					statisState : 0,
					limitFactor : '',
					limitValue  : ''
				},
				pageConfig:{
					maxDate : '',
					minDate : ''
				}
			}
		},
		methods:{
			onRefresh(){
				this.getOrdStock( this.filterForm );
			},
			selectOption( val ){
				if( val.chartProperties != '' && val.chartType != '' ){
					this.config.chart.chartProperties = val.chartProperties;
					this.config.chart.chartType       = val.chartType;
					//this.config.chart.show            = true;
				}else{
					this.config.chart.show = false;
				}
				this.filterForm.statisState = val.statisType;
				for (var i = this.config.selectOption.statisType.length - 1; i >= 0; i--) {
					if(this.config.selectOption.statisType[i].value  == val.statisType){
						this.filterForm.limitFactor = this.config.selectOption.statisType[i].factor;
						break;
					}
				}
				this.onRefresh( this.filterForm );
			},
			getOrdStockConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getOrdStockConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.date_info.GetOrdStockBeginDate;
						self.filterForm.endDate   = res.result.date_info.GetOrdStockEndDate;
						self.filterForm.remainDay = res.result.limit_data.GetOrdStockiDiffDDay;
						self.filterForm.diffDay   = res.result.limit_data.GetOrdStockiRemainDay;
					}
					self.pageConfig.maxDate   = res.result.date_info.GetOrdStockMaxDate;
					self.pageConfig.minDate   = res.result.date_info.GetOrdStockMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
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
					this.finished = false;
					if( res.result == null || res.result.length < 6 ){
						this.finished = true;
					}
				}).then(()=>{
					this.config.chart.show = false;
					if(this.config.chart.chartProperties == '' || this.config.chart.chartType == ''){return ;
					}
					this.config.chart.data       = [];
					this.config.chart.categories = [];
					this.$nextTick(()=>{
						for (var i = this.config.selectOption.chartProperties.length - 1; i >= 0; i--) {
							if( this.config.selectOption.chartProperties[i].value == this.config.chart.chartProperties ){
								this.config.chart.yTitle = this.config.selectOption.chartProperties[i].text;
								break;
							}
						}
						switch( this.filterForm.limitFactor ){
							case 'cusId' :
								this.config.chart.xTitle = '坑型分布';
								this.info.panelList.forEach((item,index)=>{
									this.config.chart.categories.push(item.CusShortName);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							default : 
								this.config.chart.xTitle     = '汇总';
								this.config.chart.categories = ['汇总'];
								this.info.panelList.forEach((item,index)=>{
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
						}
						this.config.chart.show = true;
					});
				});
			},
			resetClick(){
				this.filterForm.dateType  = 1;
				this.filterForm.diffDay   = 0;
				this.filterForm.remainDay = 0;
				sessionStorage.removeItem('statis/getOrdStock');
				this.getOrdStockConfig( true );
			},
			filterClick(){
				this.onRefresh();
				this.config.popup.filterShow = false;
			},
			detailShowClick( item ){
				switch( this.filterForm.limitFactor ){
					case 'cusId' :
						console.log(1)
						this.filterForm.limitValue = item.CusId;
						break;
					default :
						this.filterForm.limitValue = '';
				}
				this.config.popup.detailShow = true;
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','库存统计');
			if( sessionStorage.getItem('statis/getOrdStock') ){
				let storageData = JSON.parse(sessionStorage.getItem('statis/getOrdStock'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getOrdStockConfig();
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switchCell.checked ){
				sessionStorage.setItem('statis/getOrdStock',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('statis/getOrdStock');
			}
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>
