<template>
	<div style="padding-bottom:3.125rem;">
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption">
			</chart-header-select>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<high-chart v-if=" config.chart.show " :options="config.chart"></high-chart>
		<div class="page-color" v-else>
			<card 
				:title="item.title" 
				:is-shadow="true"
				v-for="(item,index) in info.panelList" 
				:key="index"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>库存数量:
							<span class="mg-left-20">{{ item.StockQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>库存面积:
							<span class="mg-left-20">{{ item.StockArea }}㎡</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>库存金额:
							<span class="mg-left-20">{{ item.StockAmt}}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>合计数量:
							<span class="mg-left-20">{{ sumCount }}</span>
						</span>
					</div>
				</div>
				<template v-if="filterForm.statisState!=0">
					<div slot="actions" class="card-actions">
						<div class="card-actions-item" @click="detailShowClick(item)">
							<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
							<span class="card-actions-item-text blue-color">订单</span>
						</div>
					</div>
				</template>
				
			</card>
			<!-- <van-panel v-for="(item,index) in info.panelList" :key="index" style="font-size:0.8125rem;background-color:#f5f7fa;margin:0 0.5rem 0.1rem 0.5rem;">
				<div slot="default" style="padding:0.5rem;">
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">客户编号:
							<span style="color:#1da02b;">{{ item.CusId }}</span>
						</div>
						<div class="van-col van-col--12">
							客户简称:
							<span style="color:#1da02b;">{{ item.CusShortName }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--22">
							库存数:
							<span style="color:#1da02b;">{{ item.StockQty }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--22">
							库存面积:
							<span style="color:#1da02b;">{{ item.StockArea }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--22">
							库存金额:
							<span style="color:#1da02b;">{{ item.StockAmt }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--22">
							总数:
							<span style="color:#1da02b;">{{ item.sumCount }}</span>
						</div>
					</div>
				</div>
				<div slot="footer" style="text-align: right;">
					<van-button size="mini" type="info" @click="detailShowClick(item)">订单</van-button>
				</div>
			</van-panel> -->
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;" v-if="finished">
				我也是有底线的1
	  		</div>
  		</div>
		<statis-order-list :show.sync="config.popup.detailShow" :filterForm="filterForm" type="stockQty" v-if="config.popup.detailShow"></statis-order-list>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="filterForm.cusName"></cus-picker>
				<!-- <radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.options" title="日期类型"></radio-cell> -->
				<uni-check-box
					label="日期"
					:localdata="config.radio.options"
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
				<!-- <new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker> -->
				<van-field label="在库超期天数" input-align="center" v-model="filterForm.remainDay" slot="filter-field-4" type="number"></van-field>
				<van-field label="交货超期天数" input-align="center" v-model="filterForm.diffDay" type="number"></van-field>
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Field, SwitchCell, Sticky } from 'vant';
	import ChartHeaderSelect from '@/components/subject/ChartHeaderSelect.vue';
	import StatisOrderList from '@/components/subject/StatisOrderList.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import HighChart from '@/components/subject/chart/HighChart';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import Card from '@/components/subject/card/Card.vue'
	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'

	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			ChartHeaderSelect,
			StatisOrderList,
			PopupFilter,
			RadioCell,
			//NewTimePicker,
			HighChart,
			CusPicker,
			
			Card,
			UniCheckBox,
			TimeRangePicker
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
					cusName     : '',
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
				this.config.chart.chartProperties = val.chartProperties;
				this.config.chart.chartType       = val.chartType;
				if( val.statisWay == 0 ){
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
			async getOrdStockConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				if(this.config.getConfig) {
					this.filterForm.beginDate = result.GetOrdStockBeginDate
					this.filterForm.endDate = result.GetOrdStockEndDate
					this.filterForm.remainDay = result.GetOrdStockiDiffDDay
					this.filterForm.diffDay = result.GetOrdStockiRemainDay
				}
				this.pageConfig.maxDate = result.GetOrdStockMaxDate
				this.pageConfig.minDate = result.GetOrdStockMinDate
				if( isReset ) return 
				await this.getOrdStock( this.filterForm )
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
				this.config.getConfig = true;
				this.filterForm.dateType  = 1;
				this.filterForm.diffDay   = 0;
				this.filterForm.remainDay = 0;
				removeStorage('statis/getOrdStock');
				this.getOrdStockConfig( true );
			},
			filterClick(){
				this.onRefresh();
				this.config.popup.filterShow = false;
			},
			detailShowClick( item ){
				switch( this.filterForm.limitFactor ){
					case 'cusId' :
						this.filterForm.limitValue = item.CusId;
						break;
					default :
						this.filterForm.limitValue = '';
				}
				this.config.popup.detailShow = true;
			},
			beforeunloadHandler(){
				if( this.config.switchCell.checked ){
					setStorage('statis/getOrdStock',JSON.stringify(this.filterForm));
				}else{
					removeStorage('statis/getOrdStock');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','库存统计');
			if( getStorage('statis/getOrdStock') ){
				let storageData = JSON.parse(getStorage('statis/getOrdStock'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getOrdStockConfig();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>