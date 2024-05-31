<template>
	<div style="padding-bottom:3.125rem;">
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption">
			</chart-header-select>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<div class="page-color" v-if=" !config.chart.show ">
			<card 
				v-for="(item,index) in panelList" 
				:key="index"
				:title="item.title"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>退货数量:
							<span class="mg-left-20">{{ item.ReturnQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>销售面积:
							<span class="mg-left-20">{{ item.TSalesArea }}㎡</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>附加费用:
							<span class="mg-left-20">{{ item.ReturnFee }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>合计金额:
							<span class="mg-left-20">{{ item.Amt }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>合计数量:
							<span class="mg-left-20">{{ item.sumCount }}</span>
						</span>
					</div>
				</div>
				<div slot="actions" class="card-actions">
					<div class="card-actions-item" @click="orderClick(item)">
						<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
						<span class="card-actions-item-text blue-color">详情</span>
					</div>
				</div>
			</card>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
				我也是有底线的
	  		</div>
  		</div>
  		<high-chart v-if="config.chart.show" :options="config.chart"></high-chart>
		<statis-order-list :show.sync="config.popup.detailShow" :filterForm="filterForm" type="returnQty" v-if="config.popup.detailShow"></statis-order-list>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
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
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon,  Field, SwitchCell, Sticky } from 'vant';
	import ChartHeaderSelect from '@/components/subject/ChartHeaderSelect.vue';
	import StatisOrderList from '@/components/subject/StatisOrderList.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
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
			
			Card,
			UniCheckBox,
			TimeRangePicker
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
				this.config.chart.chartProperties = val.chartProperties;
				this.config.chart.chartType       = val.chartType;
				if( val.statisWay == 0 ){
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
			async getOrdReturnSumConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				if(this.config.getConfig) {
					this.filterForm.beginDate = result.GetOrdReturnSumBeginDate
					this.filterForm.endDate = result.GetOrdReturnSumEndDate
				}
				this.pageConfig.minDate = result.GetOrdReturnSumMinDate
				this.pageConfig.maxDate = result.GetOrdReturnSumMaxDate
				if( isReset ) return 
				await this.getOrdReturnSum( this.filterForm )
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
				this.config.getConfig = true;
				this.filterForm.dateType = 4;
				removeStorage('statis/getOrdReturnSum');
				this.getOrdReturnSumConfig( true );
			},
			filterClick(){
				this.onRefresh();
				this.config.popup.filterShow = false;
			},
			beforeunloadHandler(){
				if( this.config.switchCell.checked ){
					setStorage('statis/getOrdReturnSum',this.filterForm);
				}else{
					removeStorage('statis/getOrdReturnSum');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','退货统计');
			if( getStorage('statis/getOrdReturnSum') ){
				let storageData = JSON.parse(getStorage('statis/getOrdReturnSum'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getOrdReturnSumConfig();
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