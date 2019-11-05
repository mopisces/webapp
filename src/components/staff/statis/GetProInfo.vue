<template>
	<div>
		<van-sticky :offset-top="46">
			<van-dropdown-menu>
				<van-dropdown-item v-model="filterInfo.statis" :options="config.dropMenu.options" />
			</van-dropdown-menu>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<div id="container" v-show="filterInfo.statis === 'charts' " :options="options"></div>
		<van-cell v-for="(item,index) in data" :key="index" v-show="filterInfo.statis === 'lists'">
			<div slot="title">{{ item.CateName }}</div>
			<div slot="label">
				<p>订单总面积:{{ item.sumOrdArea }}</p>
				<p>总金额:{{ item.sumAmt }}</p>
			</div>
		</van-cell>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timeShow.start = true" slot="filter-field-1"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timeShow.end = true" slot="filter-field-2"></van-field>
			<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-3"/>
		</popup-filter>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.start" :dateTime.sync="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.end" :dateTime.sync="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import {  Button, Cell, Field, SwitchCell, DropdownMenu, DropdownItem, Sticky } from 'vant';
	import Highcharts from 'highcharts/highstock';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[Sticky.name]: Sticky,

			PopupFilter,
			TimePicker
		},
		data(){
			return {
				data:[],
				config:{
					getConfig:true,
					dropMenu:{
						options:[
							{ text: '列表', value: 'lists' },
        					{ text: '图表', value: 'charts' },
        				]
					},
					pull:{
						isLoading:false
					},
					popup:{
						filterShow:false,
						timeShow:{
							start:false,
							end:false
						}
					},
					switch:{
						checked:false
					}
				},
				pageConfig:{
					maxDate:new Date(),
					minDate:new Date(),
					beginDate:new Date(),
					endDate:new Date()
				},
				filterInfo:{
					statis:'lists',
				},
				options:{
					chart: {
		                type: 'column'
		            },
		            title: {
		                text: ''                 // 标题
		            },
		            xAxis: {
		                categories: []   // x 轴分类
		            },
		            yAxis: {
		                title: {
		                    text: ''                // y 轴标题
		                }
		            },
		            series: [{                              // 数据列
		                name: '总订单面积(㎡)',                        // 数据列名
		                data: []                     // 数据
		            }, {
		                name: '总金额(元)',
		                data: []
		            }],
		            credits:{
		            	enabled:false
		            }
				},
				filterForm:{
					beginDate:'',
					endDate:''
				}
			}
		},
		methods:{
			onRefresh(){
				this.getProInfo( this.filterForm );
			},
			drawCharts(){
				new Highcharts.chart('container', this.options);
			},
			getProInfoConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getProInfoConfig().then(res=>{
					if( this.config.getConfig ){
						self.pageConfig.beginDate = new Date(res.result.GetProInfoBeginDate);
						self.pageConfig.endDate = new Date(res.result.GetProInfoEndDate);
						self.filterForm.beginDate = res.result.GetProInfoBeginDate;
						self.filterForm.endDate = res.result.GetProInfoEndDate;
					}
					self.pageConfig.maxDate = new Date(res.result.GetProInfoMaxDate);
					self.pageConfig.minDate = new Date(res.result.GetProInfoMinDate);
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.getProInfo(this.filterForm);
				});
			},
			getProInfo( data ){
				let self = this;
				this.$request.staff.statis.getProInfo( data ).then(res=>{
					self.options.xAxis.categories = [];
					self.options.series[0].data = [];
					self.options.series[1].data = [];

					self.data = res.result;
					res.result.forEach((item,index)=>{
						self.options.xAxis.categories.push(item.CateName);
						self.options.series[0].data.push(Number(item.sumOrdArea));
						self.options.series[1].data.push(Number(item.sumAmt));
					});
				});
			},
			resetClick(){

				this.config.getConfig = true;
				getProInfoConfig( true );
			},
			filterClick(){
				this.getProInfo( this.filterForm );
				this.config.popup.filterShow = false;	
			},

			timePickerCancel(){
				this.config.popup.timeShow.start = false;
				this.config.popup.timeShow.end = false;
			},
			timeBeginConfirm( value ){
				this.filterForm.beginDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.timePickerCancel();
			},
			timeEndConfirm( value ){
				this.filterForm.endDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.timePickerCancel();
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','生产分析总计');
			if( sessionStorage.getItem('statis/getProInfo') !== null ){
				let storageData = JSON.parse(sessionStorage.getItem('statis/getProInfo'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.getProInfoConfig();
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('statis/getProInfo',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('statis/getProInfo');
			}
		},
		computed:{
			chartsType(){
				return this.filterInfo.statis;
			}
		},
		watch:{
			chartsType(newVal,oldVal){
				this.drawCharts();
			}
		}
	}
</script>
<style>
	.van-dropdown-menu__title{
		line-height: 0.9rem;
	}
</style>