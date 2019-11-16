<template>
	<div>
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @selectOption="selectOption"></chart-header-select>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<van-panel v-for="(item,index) in panelList" :key="index">
			<div slot="default">
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">生产线:{{ item.LineId }}</div>
					<div class="van-col van-col--10">门幅:{{ item.SPaperWidth }}</div>
				</div>
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">坑型:{{ item.Flutes }}</div>
					<div class="van-col van-col--10">总订单面积:{{ item.sumOrdArea }}</div>
				</div>
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">总长度:{{ item.sumLength }}</div>
					<div class="van-col van-col--10">平均修边:{{ item.AvgTrim }}</div>
				</div>
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">平均门幅:{{ item.AvgPW }}</div>
					<div class="van-col van-col--10">总款数:{{ item.sumCount }}</div>
				</div>
			</div>
		</van-panel>
		<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
			我也是有底线的
  		</div>
  		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
  			<div slot="filter-field-1">
  				<radio-cell :radioInfo.sync="filterForm.sState" :radioColumns="config.radio.options" title="完工状态"></radio-cell>
  				<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.dateType" title="日期类型"></radio-cell>
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
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,

			ChartHeaderSelect,
			PopupFilter,
			RadioCell,
			NewTimePicker
		},
		data(){
			return {
				config:{
					getConfig:true,
					switchCell:{
						checked:false
					},
					popup:{
						filterShow:false,
						chartSelect:{
							show:false
						},
						timePicker:{
							isFinishLoad:false
						}
					},
					selectOption:{
						statisType:[
							{ text: '汇总', value: '0' },
							{ text: '按生产线', value: '1' },
							{ text: '按门幅', value: '2' },
							{ text: '按坑型', value: '3' },
						],
						chartType:['all'],
						chartProperties:[
							{ text: '总订单面积', value: 'sumOrdArea'},
	                        { text: '总长度', value: 'sumLength'},
	                        { text: '平均修边', value: 'avgTrim'},
	                        { text: '平均门幅', value: 'avgPW'},
	                        { text: '总款数', value: 'sumCount'},
						]
					},
					radio:{
						options:[
							{title:'全部',value:'0'},
							{title:'已传',value:'1'},
							{title:'已提取',value:'2'},
						],
						dateType:[
							{title:'生产日期',value:'0'},
						]
					}
				},
				panelList:[],
				filterForm:{
					beginDate:'2017-11-04',
					endDate:'2019-11-04',
					statisType:'0',
					sState:'0',
					dateType:'0'
				},
				pageConfig:{
					minDate:'',
					maxDate:'',
				}
			}
		},
		methods:{
			onRefresh(){
				this.getSchSum( this.filterForm );
			},
			selectOption( val ){
				this.filterForm.statisType = val.statisType;
			},
			getSchSumConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getSchSumConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.GetSchSumBeginDate;
						self.filterForm.endDate = res.result.GetSchSumEndDate;
					}
					self.pageConfig.minDate = res.result.GetSchSumMinDate;
					self.pageConfig.maxDate = res.result.GetSchSumMaxDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.getSchSum( this.filterForm );
				});;
			},
			getSchSum( data ){
				let self = this;
				this.$request.staff.statis.getSchSum( data ).then(res=>{
					self.panelList = res.result;
				});
			},
			resetClick(){
				this.filterForm.sState = '0';
				this.filterForm.dateType = '0';
				this.config.switchCell.checked = false;
				sessionStorage.removeItem('statis/getSchSum');
				this.getSchSumConfig( true );
			},
			filterClick(){
				this.onRefresh();
				this.config.popup.filterShow = false;
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','传单统计');
			if( sessionStorage.getItem('statis/getSchSum') ){
				let storageData = JSON.parse(sessionStorage.getItem('statis/getSchSum'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.filterForm.statisState = this.config.selectOption.statisType[0].value;
			this.getSchSumConfig();
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switchCell.checked ){
				sessionStorage.setItem('statis/getSchSum',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('statis/getSchSum');
			}
		},
		computed:{
			statisTypeChange(){
				return this.filterForm.statisType;
			}
		},
		watch:{
			statisTypeChange( newV, oldV ){
				this.onRefresh();
			}
		}
	}
</script>