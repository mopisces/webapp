<template>
	<div>
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption">
			</chart-header-select>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
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
					<div class="van-col van-col--10">销售面积:{{ item.TSalesArea }}</div>
					<div class="van-col van-col--10">金额:{{ item.Amt }}</div>
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
		<statis-order-list :show.sync="config.popup.detailShow" :filterForm="filterForm" type="returnQty" v-if="config.popup.detailShow"></statis-order-list>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.options" title="日期类型" slot="filter-field-1"></radio-cell>
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timePicker.startShow = true" slot="filter-field-2"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timePicker.endShow = true" slot="filter-field-3"></van-field>
			<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件" slot="filter-field-4" @change="switchChange"/>
		</popup-filter>
		<time-picker :dateTimeShow.sync="config.popup.timePicker.startShow" :dateTime.sync="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="config.popup.timePicker.startShow = false" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow.sync="config.popup.timePicker.endShow" :dateTime.sync="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="config.popup.timePicker.endShow = false" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Panel, Sticky } from 'vant';
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
			[SwitchCell.name]: SwitchCell,
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
				finished:true,
				config:{
					isInit:true,
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
							{ text: '汇总', value: '0', factor:'' },
							{ text: '按退货原因', value:'1', factor:'returnCause'},
							{ text: '按客户', value: '2', factor:'cusId' }
						],
						chartType:['all'],
						chartProperties:[
							{ text: '退货数', value: '0' },
							{ text: '退货附加费', value: '1' },
							{ text: '销售面积', value: '2' },
							{ text: '金额', value: '3' },
							{ text: '总款数', value: '4' },
						]
					}
				},
				panelList:[],
				filterForm:{
					sType:    2,
					dateType: 4,
					beginDate:'',
					endDate:  '',
					statisState:0,
					limitFactor:'',
					limitValue:''
				},
				pageConfig:{
					minDate:new Date(),
					maxDate:new Date(),
					beginDate:new Date(),
					endDate:new Date()
				}
			}
		},
		methods:{
			orderClick( item ){
				if( this.filterForm.limitFactor ){
					this.filterForm.limitValue = item.ReturnCause;
				}
				this.config.popup.detailShow = true;
			},
			onRefresh(){
				if( this.config.isInit ){
					this.getOrdReturnSumConfig();
				}else{
					this.getOrdReturnSum( this.filterForm );
				}
			},
			selectOption( val ){
				this.filterForm.statisState = val.statisType;
				for (var i = this.config.selectOption.statisType.length - 1; i >= 0; i--) {
					if(this.config.selectOption.statisType[i].value == val.statisType){
						this.filterForm.limitFactor = this.config.selectOption.statisType[i].factor;
						break;
					}
				}
			},
			getOrdReturnSumConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getOrdReturnSumConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.GetOrdReturnSumBeginDate;
						self.filterForm.endDate = res.result.GetOrdReturnSumEndDate;

						self.pageConfig.beginDate = new Date(res.result.GetOrdReturnSumBeginDate);
						self.pageConfig.endDate = new Date(res.result.GetOrdReturnSumEndDate);
					}
					self.pageConfig.minDate = new Date(res.result.GetOrdReturnSumMinDate);
					self.pageConfig.maxDate = new Date(res.result.GetOrdReturnSumMaxDate);
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
			},
			timeBeginConfirm( val ){
				this.filterForm.beginDate = dateTimeFormat(val.value,'yyyy-MM-dd');
				this.config.popup.timePicker.startShow = false;
			},
			timeEndConfirm( val ){
				this.filterForm.endDate = dateTimeFormat(val.value,'yyyy-MM-dd');
				this.config.popup.timePicker.endShow = false;
			},
			switchChange(checked){
				if( checked ){
					sessionStorage.setItem('statis/getOrdReturnSum',JSON.stringify(this.filterForm));
				}else{
					sessionStorage.removeItem('statis/getOrdReturnSum');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','退货统计');
			if( sessionStorage.getItem('statis/getOrdReturnSum') ){
				let storageData = JSON.parse(sessionStorage.getItem('statis/getOrdReturnSum'));
				this.filterForm = storageData;
				this.pageConfig.beginDate = new Date(storageData.beginDate);
				this.pageConfig.endDate   = new Date(storageData.endDate);
				this.config.getConfig = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
		},
		updated(){
			this.config.isInit = false;
		},
		computed:{
			statisStateChange(){
				return this.filterForm.statisState;
			},
			filterFormBeginDateChange(){
				return this.filterForm.beginDate;
			},
			filterFormEndDateChange(){
				return this.filterForm.endDate;
			},
			filterFormDateTypeChange(){
				return this.filterForm.dateType;
			}
		},
		watch:{
			statisStateChange(newV,oldV){
				this.onRefresh( this.filterForm );
			},
			filterFormBeginDateChange(newV,oldV){
				if( !this.config.isInit ){
					this.config.switchCell.checked = false;
				}
			},
			filterFormEndDateChange(newV,oldV){
				if( !this.config.isInit ){
					this.config.switchCell.checked = false;
				}
			},
			filterFormDateTypeChange(newV,oldV){
				if( !this.config.isInit ){
					this.config.switchCell.checked = false;
				}
			}
		}
	}
</script>