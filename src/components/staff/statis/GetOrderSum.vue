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
				<van-button size="small" type="info" @click="config.popup.detailShow = true">订单</van-button>
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
				finished:false,
				config:{
					getConfig:true,
					isInit:true,
					switchCell:{
						checked:false,
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
					selectOption:{
						statisType:[
							{ text: '汇总', value: 0, factor:'' },
							{ text: '按坑型', value: 1, factor:'flutes' },
							{ text: '按客户', value: 2, factor:'cusId' },
							{ text: '按业务员', value: 3, factor:'taskId' },
						],
						chartType:['all'],
						chartProperties:[
							{ text: '总面积', value: 'sumArea'},
	                        { text: '总订单面积', value: 'sumOrdArea'},
	                        { text: '总体积', value: 'sumOrdVol'},
	                        { text: '总长度', value: 'sumLength'},
	                        { text: '总金额', value: 'sumAmt'},
	                        { text: '订单总数', value: 'sumQty'},
	                        { text: '总款数', value: 'sumCount'},
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
							{title:'订单日期',value:1},
							{title:'交货日期',value:2},
						]
					}
				},
				listInfo:[],
				filterForm:{
					sType:    1,
					dateType: 1,
					beginDate:'',
					endDate:  '',
					statisState:0
				},
				pageConfig:{
					beginDate:new Date(),
					endDate:new Date(),
					maxDate:new Date(),
					minDate:new Date(),
				}
			}
		},
		methods:{
			onRefresh(){
				this.getOrderSum( this.filterForm );
			},
			selectOption( val ){
				this.filterForm.statisState = val.statisType;
			},
			getOrderSumConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getOrderSumConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.GetOrderSumBeginDate;
						self.filterForm.endDate = res.result.GetOrderSumEndDate;

						self.pageConfig.beginDate = new Date(res.result.GetOrderSumBeginDate);
						self.pageConfig.endDate = new Date(res.result.GetOrderSumEndDate);
					}
					self.pageConfig.minDate = new Date(res.result.GetOrderSumMinDate);
					self.pageConfig.maxDate = new Date(res.result.GetOrderSumMaxDate);
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
			timeBeginConfirm( val ){
				this.filterForm.beginDate = dateTimeFormat(val.value,'yyyy-MM-dd');
				this.config.popup.timePicker.startShow = false;
			},
			timeEndConfirm( val ){
				this.filterForm.endDate = dateTimeFormat(val.value,'yyyy-MM-dd');
				this.config.popup.timePicker.endShow = false;
			},
			switchChange( checked ){
				if( checked ){
					sessionStorage.setItem('statis/getOrderSum',JSON.stringify(this.filterForm));
				}else{
					sessionStorage.removeItem('statis/getOrderSum');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','订单统计');
			if( sessionStorage.getItem('statis/getOrderSum') ){
				let storageData = JSON.parse(sessionStorage.getItem('statis/getOrderSum'));
				this.filterForm = storageData;
				this.pageConfig.beginDate = new Date(storageData.beginDate);
				this.pageConfig.endDate = new Date(storageData.endDate);
				this.config.getConfig = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getOrderSumConfig();
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