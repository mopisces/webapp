<template>
	<div style="padding-bottom:3.125rem;">
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption"></chart-header-select>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<high-chart v-if=" config.chart.show " :options=" config.chart "></high-chart>
		<div class="page-color" v-else>
			<card 
				:title="item.title" 
				:extra="item.sumCount"
				:is-shadow="true"
				v-for="(item,index) in panelList" 
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
						<span class="mg-left-20 red-color">{{ item.AvgTrim }}</span>
						<span class="mg-left-20 green-color">{{ item.AvgPW }}</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>总长度:
							<span class="mg-left-20">{{ item.sumLength }}</span>
						</span>
					</div>
				</div>
			</card>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
				我也是有底线的
	  		</div>
  		</div>
  		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
  			<div slot="filter-field-1">
  				<uni-check-box
					label="完工状态"
					:localdata="config.radio.options"
					:radioData.sync="filterForm.sState" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<uni-check-box
					label="日期"
					:localdata="config.radio.dateType"
					:radioData.sync="filterForm.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
  				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
  				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件" />
  			</div>
  		</popup-filter>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Sticky } from 'vant';
	import ChartHeaderSelect from '@/components/subject/ChartHeaderSelect.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import HighChart from '@/components/subject/chart/HighChart';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import Card from '@/components/subject/card/Card.vue'
	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'

	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			ChartHeaderSelect,
			PopupFilter,
			RadioCell,
			//NewTimePicker,
			HighChart,

			Card,
			UniCheckBox,
			TimeRangePicker
		},
		data(){
			return {
				config:{
					getConfig : true,
					switchCell:{
						checked : false
					},
					popup:{
						filterShow : false,
						chartSelect:{
							show : false
						},
						timePicker:{
							isFinishLoad : false
						}
					},
					selectOption:{
						statisType:[
							{ text: '汇总',     value: '0' },
							{ text: '按生产线', value: '1' },
							{ text: '按门幅',   value: '2' },
							{ text: '按坑型',   value: '3' },
						],
						chartType:['all'],
						chartProperties:[
							{ text: '总订单面积', value: 'sumOrdArea' },
	                        { text: '总长度',     value: 'sumLength' },
	                        { text: '平均修边',   value: 'AvgTrim' },
	                        { text: '平均门幅',   value: 'AvgPW' },
	                        { text: '总款数',     value: 'sumCount' },
						]
					},
					radio:{
						options:[
							{ title:'全部',   value:'0' },
							{ title:'已传',   value:'1' },
							{ title:'已提取', value:'2' },
						],
						dateType:[
							 {title:'生产日期', value:'0' },
						]
					},
					chart :{
						show : false,
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
					beginDate  : '',
					endDate    : '',
					statisType : '0',
					sState     : '0',
					dateType   : '0'
				},
				pageConfig:{
					minDate : '',
					maxDate : '',
				}
			}
		},
		methods:{
			onRefresh(){
				this.getSchSum( this.filterForm );
			},
			selectOption( val ){
				this.config.chart.chartProperties = val.chartProperties;
				this.config.chart.chartType       = val.chartType;
				if( val.statisWay == 0 ){
					this.config.chart.show = false;
				}
				this.filterForm.statisType = val.statisType;
				this.onRefresh();
			},
			async getSchSumConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.GetSchSumBeginDate
					this.filterForm.endDate = result.GetSchSumEndDate
				}
				this.pageConfig.minDate = result.GetSchSumMinDate
				this.pageConfig.maxDate = result.GetSchSumMaxDate
				if( isReset ) return 
				this.getSchSum( this.filterForm )	
			},
			getSchSum( data ){
				let self = this;
				this.$request.staff.statis.getSchSum( data ).then(res=>{
					self.panelList = res.result;
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
						switch( this.filterForm.statisType ){
							case '1' :
								this.config.chart.xTitle = '生产线分布';
								this.panelList.forEach((item,index)=>{
									this.config.chart.categories.push(item.LineId);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							case '2' :
								this.config.chart.xTitle = '门幅分布';
								this.panelList.forEach((item,index)=>{
									this.config.chart.categories.push(item.SPaperWidth);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							case '3' :
							 	this.config.chart.xTitle = '坑型分布';
								this.panelList.forEach((item,index)=>{
									this.config.chart.categories.push(item.Flutes);
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
				this.config.getConfig = true;
				this.filterForm.sState         = '0';
				this.filterForm.dateType       = '0';
				this.config.switchCell.checked = false;
				removeStorage('statis/getSchSum');
				this.getSchSumConfig( true );
			},
			filterClick(){
				this.onRefresh();
				this.config.popup.filterShow = false;
			},
			beforeunloadHandler(){
				if( this.config.switchCell.checked ){
					setStorage('statis/getSchSum',this.filterForm);
				}else{
					removeStorage('statis/getSchSum');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','传单统计');
			if( getStorage('statis/getSchSum') ){
				let storageData = JSON.parse(getStorage('statis/getSchSum'));
				this.filterForm = storageData;
				this.config.getConfig          = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getSchSumConfig();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			/*statisTypeChange(){
				return this.filterForm.statisType;
			}*/
		},
		watch:{
			/*statisTypeChange( newV, oldV ){
				this.onRefresh();
			}*/
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>