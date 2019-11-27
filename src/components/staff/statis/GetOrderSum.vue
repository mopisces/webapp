<template>
	<div>
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption">
			</chart-header-select>
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="onRefresh()">刷新</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.filterShow = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<div v-if="!config.chart.show">
			<van-panel v-for="(item,index) in listInfo" :key="index">
				<div slot="default">
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">坑型:    {{ item.Flutes }}</div>
						<div class="van-col van-col--10">业务编码:{{ item.TaskId }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">业务员:  {{ item.TaskName }}</div>
						<div class="van-col van-col--10">客户编号:{{ item.CusId }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">客户简称:{{ item.CusShortName }}</div>
						<div class="van-col van-col--10">总面积:  {{ item.sumArea }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">总订单面积:{{ item.sumOrdArea }}</div>
						<div class="van-col van-col--10">总体积:    {{ item.sumOrdVol }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">总长度:{{ item.sumLength }}</div>
						<div class="van-col van-col--10">总金额:{{ item.sumAmt }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">订单总数:{{ item.sumQty }}</div>
						<div class="van-col van-col--10">总款数:{{ item.sumCount }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">单坑面积:{{ item.sumArea1 }}</div>
						<div class="van-col van-col--10">单坑长度:{{ item.sumLength1 }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">单坑金额:{{ item.sumAmt1 }}</div>
						<div class="van-col van-col--10">单坑款数:{{ item.sumCount1 }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">双坑面积:{{ item.sumArea2 }}</div>
						<div class="van-col van-col--10">双坑长度:{{ item.sumLength2 }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">双坑金额:{{ item.sumAmt2 }}</div>
						<div class="van-col van-col--10">双坑款数:{{ item.sumCount2 }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">三坑面积:{{ item.sumArea3 }}</div>
						<div class="van-col van-col--10">三坑长度:{{ item.sumLength3 }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">三坑金额:{{ item.sumAmt3 }}</div>
						<div class="van-col van-col--10">三坑款数:{{ item.sumCount3 }}</div>
					</div>
				</div>
				<div slot="footer" style="text-align: right;">
					<van-button size="small" type="info" @click="detailShowClick( item )">订单</van-button>
				</div>
			</van-panel>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;" v-if="finished">
				我也是有底线的
	  		</div>
		</div>
  		<high-chart :options="config.chart" v-if="config.chart.show"></high-chart>
		<statis-order-list :show.sync="config.popup.detailShow" :filterForm="filterForm" type="returnQty" v-if="config.popup.detailShow"></statis-order-list>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.options" title="日期类型"></radio-cell>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
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
					selectOption:{
						statisType:[
							{ text: '汇总',     value: 0, factor:'' },
							{ text: '按坑型',   value: 1, factor:'flutes' },
							{ text: '按客户',   value: 2, factor:'cusId' },
							{ text: '按业务员', value: 3, factor:'taskId' },
						],
						chartType:['all'],
						chartProperties:[
							{ text: '总面积',     value: 'sumArea'},
	                        { text: '总订单面积', value: 'sumOrdArea'},
	                        { text: '总体积',   value: 'sumOrdVol'},
	                        { text: '总长度',   value: 'sumLength'},
	                        { text: '总金额',   value: 'sumAmt'},
	                        { text: '订单总数', value: 'sumQty'},
	                        { text: '总款数',   value: 'sumCount'},
	                        { text: '单坑面积', value: 'sumArea1'},
	                        { text: '单坑长度', value: 'sumLength1'},
	                        { text: '单坑金额', value: 'sumAmt1'},
	                        { text: '单坑款数', value: 'sumCount1'},
	                        { text: '双坑面积', value: 'sumArea2'},
	                        { text: '双坑长度', value: 'sumLength2'},
	                        { text: '双坑金额', value: 'sumAmt2'},
	                        { text: '双坑款数', value: 'sumCount2'},
	                        { text: '三坑面积', value: 'sumArea3'},
	                        { text: '三坑长度', value: 'sumLength3'},
	                        { text: '三坑金额', value: 'sumAmt3'},
	                        { text: '三坑款数', value: 'sumCount3'},
						]
					},
					radio:{
						options:[
							{ title:'订单日期', value:1 },
							{ title:'交货日期', value:2 },
						]
					},
					chart:{
						xTitle  : '',
						yTitle  : '',
						categories : [],
						data  : [],
						chartProperties : '',
						chartType : '',
						show : false
					}
				},
				listInfo:[],
				filterForm:{
					sType       : 1,
					dateType    : 1,
					beginDate   : '',
					endDate     : '',
					statisState : 0,
					limitValue  : '',
					limitFactor : 0
				},
				pageConfig:{
					maxDate : '',
					minDate : '',
				}
			}
		},
		methods:{
			onRefresh(){
				this.getOrderSum( this.filterForm );
			},
			selectOption( val ){
				if( val.chartProperties != '' && val.chartType != '' ){
					this.config.chart.chartProperties = val.chartProperties;
					this.config.chart.chartType       = val.chartType;
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
			},
			getOrderSumConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getOrderSumConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.GetOrderSumBeginDate;
						self.filterForm.endDate = res.result.GetOrderSumEndDate;
					}
					self.pageConfig.minDate = res.result.GetOrderSumMinDate;
					self.pageConfig.maxDate = res.result.GetOrderSumMaxDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.getOrderSum( this.filterForm );
				});
			},
			getOrderSum( data ){
				let self = this;
				this.$request.staff.statis.getOrderSum( data ).then(res=>{
					self.listInfo = res.result;
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
						switch( this.filterForm.limitFactor ){
							case  'flutes' :
								this.config.chart.xTitle = '坑型分布';
								this.config.chart.yTitle = '总面积';
								this.listInfo.forEach((item,index)=>{
									this.config.chart.categories.push(item.Flutes);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							case 'cusId' :
								this.config.chart.xTitle = '客户分布';
								this.config.chart.yTitle = '总面积';
								this.listInfo.forEach((item,index)=>{
									this.config.chart.categories.push(item.CusShortName);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							case 'taskId' :
								this.config.chart.xTitle = '业务员分布';
								this.config.chart.yTitle = '总面积';
								this.listInfo.forEach((item,index)=>{
									this.config.chart.categories.push(item.TaskId);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							default :
								this.config.chart.xTitle = '汇总';
								this.config.chart.yTitle = '总面积';
								this.listInfo.forEach((item,index)=>{
									this.config.chart.categories.push('汇总');
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
						}
						this.config.chart.show = true;
					});
				});
			},
			resetClick(){
				this.filterForm.dateType = 1;
				sessionStorage.removeItem('statis/getOrderSum');
				this.getOrderSumConfig( true );
			},
			filterClick(){
				this.onRefresh();
				this.config.popup.filterShow = false;
			},
			detailShowClick( item ){
				switch( this.filterForm.limitFactor ){
					case 'flutes' :
						this.filterForm.limitValue = item.Flutes;
						break;
					case 'cusId' :
						this.filterForm.limitValue = item.CusId;
						break;
					case 'taskId' :
						this.filterForm.limitValue = item.TaskId;
						break;
					default :
						this.filterForm.limitValue = '';
				}
				this.config.popup.detailShow = true;
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','订单统计');
			if( sessionStorage.getItem('statis/getOrderSum') ){
				let storageData = JSON.parse(sessionStorage.getItem('statis/getOrderSum'));
				this.filterForm = storageData;
				this.config.getConfig          = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getOrderSumConfig();
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switchCell.checked ){
				sessionStorage.setItem('statis/getOrderSum',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('statis/getOrderSum');
			}
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