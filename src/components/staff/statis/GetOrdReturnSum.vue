<template>
	<div>
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption">
			</chart-header-select>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<div v-if=" !config.chart.show ">
			<van-panel v-for="(item,index) in panelList" :key="index">
				<div slot="default">
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--20">退货原因:{{ item.ReturnCause }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">客户编号:{{ item.CusId }}</div>
						<div class="van-col van-col--10">客户简称:{{ item.CusShortName }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">退货数:{{ item.ReturnQty }}</div>
						<div class="van-col van-col--10">退货附加费:{{ item.ReturnFee }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--20">销售面积:{{ item.TSalesArea }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--20">金额:{{ item.Amt }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--20">总数:{{ item.sumCount }}</div>
					</div>
				</div>
				<div slot="footer" style="text-align: right;">
					<van-button size="small" type="info" @click="orderClick(item)">订单</van-button>
				</div>
			</van-panel>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;" v-if="finished">
				我也是有底线的
	  		</div>
  		</div>
  		<high-chart v-if="config.chart.show" :options="config.chart"></high-chart>
		<statis-order-list :show.sync="config.popup.detailShow" :filterForm="filterForm" type="returnQty" v-if="config.popup.detailShow"></statis-order-list>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.options" title="日期类型"></radio-cell>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件" />
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
				finished:true,
				config:{
					getConfig:true,
					switchCell:{
						checked:false
					},
					radio:{
						options:[
							{title:'退货日期',value:3},
							{title:'生效日期',value:4},
						]
					},
					popup:{
						chartSelect:{
							show:false
						},
						filterShow:false,
						detailShow:false,
						timePicker:{
							startShow:false,
							endShow:false
						}
					},
					selectOption:{
						statisType:[
							{ text: '汇总', value: 0, factor:'' },
							{ text: '按退货原因', value:1, factor:'returnCause'},
							{ text: '按客户', value: 2, factor:'cusId' }
						],
						chartType:['all'],
						chartProperties:[
							{ text: '退货数',     value:'ReturnQty' },
							{ text: '退货附加费', value: 'ReturnFee' },
							{ text: '销售面积',   value: 'TSalesArea' },
							{ text: '金额',       value: 'Amt' },
							{ text: '总款数',     value: 'sumCount' },
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
				panelList:[],
				filterForm:{
					sType       : 2,
					dateType    : 4,
					beginDate   : '',
					endDate     : '',
					limitFactor : '',
					limitValue  : '',
					statisState : 0,
				},
				pageConfig:{
					minDate:'',
					maxDate:'',
				}
			}
		},
		methods:{
			orderClick( item ){
				switch( this.filterForm.limitFactor ){
					case 'returnCause' :
						this.filterForm.limitValue = item.ReturnCause;
						break;
					case 'cusId' : 
						this.filterForm.limitValue = item.CusId;
						break;
					default :
						this.filterForm.limitValue = '';
				}
				this.config.popup.detailShow = true;
			},
			onRefresh(){
				this.getOrdReturnSum( this.filterForm );
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
					if(this.config.selectOption.statisType[i].value == val.statisType){
						this.filterForm.limitFactor = this.config.selectOption.statisType[i].factor;
						break;
					}
				}
				this.onRefresh();
			},
			getOrdReturnSumConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getOrdReturnSumConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.GetOrdReturnSumBeginDate;
						self.filterForm.endDate = res.result.GetOrdReturnSumEndDate;
					}
					self.pageConfig.minDate = res.result.GetOrdReturnSumMinDate;
					self.pageConfig.maxDate = res.result.GetOrdReturnSumMaxDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.$nextTick(()=>{
						this.getOrdReturnSum( this.filterForm );
					});
				});
			},
			getOrdReturnSum( data ){
				let self = this;
				this.$request.staff.statis.getOrdReturnSum( data ).then(res=>{
					self.panelList = res.result;
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
							case 'returnCause' : 
								this.config.chart.xTitle = '退货原因分布';
								this.panelList.forEach((item,index)=>{
									this.config.chart.categories.push(item.ReturnCause);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							case 'cusId' : 
								this.config.chart.xTitle = '客户分布';
								this.panelList.forEach((item,index)=>{
									this.config.chart.categories.push(item.CusShortName);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							default : 
								this.config.chart.xTitle     = '汇总';
								this.config.chart.categories = ['汇总'];
								this.panelList.forEach((item,index)=>{
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
						}
						this.config.chart.show = true;
					});
				});
			},
			resetClick(){
				this.filterForm.dateType = 4;
				sessionStorage.removeItem('statis/getOrdReturnSum');
				this.getOrdReturnSumConfig( true );
			},
			filterClick(){
				this.onRefresh();
				this.config.popup.filterShow = false;
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','退货统计');
			if( sessionStorage.getItem('statis/getOrdReturnSum') ){
				let storageData = JSON.parse(sessionStorage.getItem('statis/getOrdReturnSum'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getOrdReturnSumConfig();
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switchCell.checked ){
				sessionStorage.setItem('statis/getOrdReturnSum',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('statis/getOrdReturnSum');
			}
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>