<template>
	<div style="padding-bottom:3.125rem;">
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption">
			</chart-header-select>
		</van-sticky>
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
		<div class="page-color" v-if="!config.chart.show">
			<card 
				:title="item.title" 
				:is-shadow="true"
				v-for="(item,index) in listInfo" 
				:key="index"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">总|订单面积:</div>
						<span class="mg-left-20">{{ item.sumArea }}㎡</span>
						<span class="mg-left-20">{{ item.sumOrdArea }}㎡</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt red-color">体积</div>|
						<div class="card-body-txt blue-color">长度</div>:
						<span class="mg-left-20 red-color">{{ item.sumOrdVol }}m³</span>
						<span class="mg-left-20 blue-color">{{ item.sumLength }}m</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">总金额:</div>
						<span class="mg-left-20">{{ item.sumAmt }}元</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt red-color">订单总数</div>|
						<div class="card-body-txt blue-color">总款数:</div>
						<span class="mg-left-20 red-color">{{ item.sumQty }}</span>
						<span class="mg-left-20 blue-color">{{ item.sumCount }}</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">单坑面积|</div>
						<div class="card-body-txt">长度:</div>
						<span class="mg-left-20">{{ item.sumArea1 }}㎡</span>
						<span class="mg-left-20">{{ item.sumLength1 }}m</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">单坑金额|</div>
						<div class="card-body-txt">款数:</div>
						<span class="mg-left-20">{{ item.sumAmt1 }}元</span>
						<span class="mg-left-20">{{ item.sumCount1 }}</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">双坑面积|</div>
						<div class="card-body-txt">长度:</div>
						<span class="mg-left-20">{{ item.sumArea2 }}㎡</span>
						<span class="mg-left-20">{{ item.sumLength2 }}m</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">双坑金额|</div>
						<div class="card-body-txt">款数:</div>
						<span class="mg-left-20">{{ item.sumAmt2 }}元</span>
						<span class="mg-left-20">{{ item.sumCount2 }}</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">三坑面积|</div>
						<div class="card-body-txt">长度:</div>
						<span class="mg-left-20">{{ item.sumArea3 }}㎡</span>
						<span class="mg-left-20">{{ item.sumLength3 }}m</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">三坑金额|</div>
						<div class="card-body-txt">款数:</div>
						<span class="mg-left-20">{{ item.sumAmt3 }}元</span>
						<span class="mg-left-20">{{ item.sumCount3 }}</span>
					</div>
				</div>
				<div slot="actions" class="card-actions">
					<div class="card-actions-item" @click="detailShowClick( item )">
						<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
						<span class="card-actions-item-text blue-color">详情</span>
					</div>
				</div>
			</card>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;" v-if="finished">
				我也是有底线的
	  		</div>
		</div>
  		<high-chart :options="config.chart" v-if="config.chart.show"></high-chart>
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
	import HighChart from '@/components/subject/chart/HighChart';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import Card from '@/components/subject/card/Card.vue'
	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	import DragMenu from '@/components/subject/fab/DragMenu.vue'
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
			HighChart,

			Card,
			UniCheckBox,
			TimeRangePicker,
			DragMenu
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
	                        { text: '总体积',     value: 'sumOrdVol'},
	                        { text: '总长度',     value: 'sumLength'},
	                        { text: '总金额',     value: 'sumAmt'},
	                        { text: '订单总数',   value: 'sumQty'},
	                        { text: '总款数',     value: 'sumCount'},
	                        { text: '单坑面积',   value: 'sumArea1'},
	                        { text: '单坑长度',   value: 'sumLength1'},
	                        { text: '单坑金额',   value: 'sumAmt1'},
	                        { text: '单坑款数',   value: 'sumCount1'},
	                        { text: '双坑面积',   value: 'sumArea2'},
	                        { text: '双坑长度',   value: 'sumLength2'},
	                        { text: '双坑金额',   value: 'sumAmt2'},
	                        { text: '双坑款数',   value: 'sumCount2'},
	                        { text: '三坑面积',   value: 'sumArea3'},
	                        { text: '三坑长度',   value: 'sumLength3'},
	                        { text: '三坑金额',   value: 'sumAmt3'},
	                        { text: '三坑款数',   value: 'sumCount3'},
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
			menuClick() {
				this.config.popup.filterShow = true
			},
			onRefresh(){
				this.getOrderSum( this.filterForm );
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
				this.onRefresh( this.filterForm );
			},
			async getOrderSumConfig( rePages = false ){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				if( this.config.getConfig ) {
					this.filterForm.beginDate = result.GetOrderSumBeginDate
					this.filterForm.endDate = result.GetOrderSumEndDate
				}
				this.pageConfig.minDate = result.GetOrderSumMinDate
				this.pageConfig.maxDate = result.GetOrderSumMaxDate
				//是否加载页面
				if( rePages ) {
					await this.getOrderSum( this.filterForm )
				}
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
						for (var i = this.config.selectOption.chartProperties.length - 1; i >= 0; i--) {
							if( this.config.selectOption.chartProperties[i].value == this.config.chart.chartProperties ){
								this.config.chart.yTitle = this.config.selectOption.chartProperties[i].text;
								break;
							}
						}
						switch( this.filterForm.limitFactor ){
							case  'flutes' :
								this.config.chart.xTitle = '坑型分布';
								this.listInfo.forEach((item,index)=>{
									this.config.chart.categories.push(item.Flutes);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							case 'cusId' :
								this.config.chart.xTitle = '客户分布';
								this.listInfo.forEach((item,index)=>{
									this.config.chart.categories.push(item.CusShortName);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							case 'taskId' :
								this.config.chart.xTitle = '业务员分布';
								this.listInfo.forEach((item,index)=>{
									this.config.chart.categories.push(item.TaskId);
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
								break;
							default :
								this.config.chart.xTitle     = '汇总';
								this.config.chart.categories = ['汇总'];
								this.listInfo.forEach((item,index)=>{
									this.config.chart.data.push(Number(item[this.config.chart.chartProperties]));
								});
						}
						this.config.chart.show = true;
					});
				});
			},
			resetClick(){
				this.config.getConfig = true;
				this.filterForm.dateType = 1;
				removeStorage('statis/getOrderSum');
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
			},
			beforeunloadHandler(){
				if( this.config.switchCell.checked ){
					setStorage('statis/getOrderSum',this.filterForm);
				}else{
					removeStorage('statis/getOrderSum');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','订单统计');
			if( getStorage('statis/getOrderSum') !== null ){
				let storageData = JSON.parse(getStorage('statis/getOrderSum'));
				this.filterForm = storageData;
				this.config.getConfig          = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getOrderSumConfig(true);
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
