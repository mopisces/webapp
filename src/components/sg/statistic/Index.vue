<template>
	<div>
		<van-sticky :offset-top="46">
			<statis-filter-header :show.sync="config.popup.chartSelect.show" :lineType="lineType" @selectOption="selectOption">
			</statis-filter-header>
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="onRefresh()">刷新</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.filterShow = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
			</div>
		</popup-filter>
		<high-chart :options="config.chart.options" v-if="config.chart.show"></high-chart>
	</div>
</template>
<script>
	import HighChart from '@/components/subject/chart/HighChart';
	import StatisFilterHeader from '@/components/subject/sg/StatisFilterHeader.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import { Button, Field, SwitchCell, Panel, Sticky } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,

			HighChart,
			StatisFilterHeader,
			PopupFilter,
			NewTimePicker
		},
		data(){
			return {
				config:{
					chart:{
						options:{
							categories : [],  //x轴标题
							yTitle     : '', //y轴标题
							data       : [],
							chartProperties:null,
							chartType  : 'sgStatistic',
							series:[]
						},
						show:false
					},
					popup:{
						chartSelect:{
							show:false,
						},
						filterShow:false,
						timePicker:{
							isFinishLoad:false
						},
					},
				},
				lineType:[],
				pageConfig:{
					maxDate : null,
					minDate : null,
				},
				filterForm:{
					beginDate       : null,
					endDate         : null,
					timeType        : 1,
					lineType        : null,
					classType       : 'ALL',
					chartProperties : 'sumArea',
				}
			}
		},
		methods:{
			selectOption(val){
				this.filterForm.timeType = val.timeType;
				this.filterForm.lineType = val.lineType;
				this.filterForm.classType = val.classType;
				this.filterForm.chartProperties = val.chartProperties;
				this.getStatisData();
			},
			getPageConfig(){
				let self = this;
				this.$request.sg.statis.getStatisConfig().then(res=>{
					if( res.errorCode == '00000' ){
						res.result.line.forEach((item)=>{
							self.lineType.push({value:item.value,text:item.text});
						});
						self.pageConfig.maxDate = res.result.date.maxDate;
						self.pageConfig.minDate = res.result.date.minDate;
						self.filterForm.beginDate = res.result.date.beginDate;
						self.filterForm.endDate = res.result.date.endDate;
						self.filterForm.lineType = self.lineType[0].value;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					this.getStatisData();
				});
			},
			getStatisData(){
				this.config.chart.show = false;
				let self = this;
				this.$request.sg.statis.getStatisData( this.filterForm ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.chart.options.data = [];
						self.config.chart.options.categories = [];
						/*res.result.forEach((item,idx)=>{
							self.config.chart.options.categories.push(this.getReBuildDate(item.statis_date));
							self.config.chart.options.data.push(Number(item.statis_data)); 
						});*/
						this.getSeriesData(res.result);
					}
				}).then(()=>{
					this.config.chart.options.chartProperties = this.filterForm.chartProperties;
					this.config.chart.show = true;
				});
			},
			getReBuildDate( date ){
				switch( this.filterForm.timeType ){
					case 2:
						return '第' + date + '周';
						break;
					case 3:
						return date + '月';
						break;
					default:
						return date;
				}
			},
			getSeriesData( res ){
				this.config.chart.options.series = [];
				let trim_sqm = [];  //修边平方     [(良品长度+坏品长度)*修边]
				let shift_cutting_waste_sqm = []; //换单切废平方 [0.8米*换单切废数*门幅]  
				let cutting_waste_sqm = [];  // 切废平方 [0.8米*切废数*门幅]
				let bad_sqm = []; //坏品平方     [坏品长度*(门幅-修边)]
				let good_sqm = []; //良品平方 [良品长度*(门幅-修边)]
				let total_waste_sqm = [];  //总废品面积
				let total_len = []; //总长度 [生产长度+切废长度(切废+换单切废)] 
				let avg_speed = []; //平均车速
				let stops = []; //停次
				switch( this.filterForm.chartProperties ){
					case 'sumArea':
						res.forEach((item,idx)=>{
							good_sqm.push(Number(item.good_sqm));
							total_waste_sqm.push(Number(item.total_waste_sqm));
							this.config.chart.options.categories.push(this.getReBuildDate(item.statis_date));
						});
						this.config.chart.options.series.push({name:'良品平方',data:good_sqm});
						this.config.chart.options.series.push({name:'总废品平方',data:total_waste_sqm});
						break;
					case 'sumLen':
						res.forEach((item,idx)=>{
							total_len.push(Number(item.total_len));
							this.config.chart.options.categories.push(this.getReBuildDate(item.statis_date));
						});
						this.config.chart.options.series.push({name:'总米数',data:total_len});
						break;
					case 'avgSpeed':
						res.forEach((item,idx)=>{
							avg_speed.push(Number(item.avg_speed));
							this.config.chart.options.categories.push(this.getReBuildDate(item.statis_date));
						});
						this.config.chart.options.series.push({name:'平均车速',data:avg_speed});
						break;
					case 'sumLoss':
						res.forEach((item,idx)=>{
							bad_sqm.push(Number(item.bad_sqm));
							trim_sqm.push(Number(item.trim_sqm));
							shift_cutting_waste_sqm.push(Number(item.shift_cutting_waste_sqm));
							cutting_waste_sqm.push(Number(item.cutting_waste_sqm));
							good_sqm.push(Number(item.good_sqm));
							this.config.chart.options.categories.push(this.getReBuildDate(item.statis_date));
						});
						this.config.chart.options.series.push({name:'坏品平方',data:bad_sqm});
						this.config.chart.options.series.push({name:'修边平方',data:trim_sqm});
						this.config.chart.options.series.push({name:'切废平方',data:cutting_waste_sqm});
						this.config.chart.options.series.push({name:'换单切废平方',data:shift_cutting_waste_sqm});
						break;
					case 'sumStops':
						res.forEach((item,idx)=>{
							stops.push(Number(item.stops));
							this.config.chart.options.categories.push(this.getReBuildDate(item.statis_date));
						});
						this.config.chart.options.series.push({name:'停次',data:stops});
					default :
						return false;
				}
			},
			resetClick(){

			},
			filterClick(){
				this.getStatisData();
			},
			onRefresh(){
				this.getStatisData();
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','生产进度');
		},
		mounted(){
			this.getPageConfig();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>