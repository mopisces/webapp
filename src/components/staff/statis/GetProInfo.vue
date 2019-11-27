<template>
	<div>
		<van-sticky :offset-top="46">
			<van-dropdown-menu>
				<van-dropdown-item v-model="filterInfo.statis" :options="config.dropMenu.options" />
			</van-dropdown-menu>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<div id="container" v-show="filterInfo.statis === 'charts' "></div>
		<van-cell v-for="(item,index) in data" :key="index" v-show="filterInfo.statis === 'lists'">
			<div slot="title">{{ item.CateName }}</div>
			<div slot="label">
				<p>订单总面积:{{ item.sumOrdArea }}</p>
				<p>总金额:{{ item.sumAmt }}</p>
			</div>
		</van-cell>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import {  Button, Cell, Field, SwitchCell, DropdownMenu, DropdownItem, Sticky } from 'vant';
	import Highcharts from 'highcharts/highstock';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
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
			NewTimePicker
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
						isLoading : false
					},
					popup:{
						filterShow : false,
						timePicker:{
							isFinishLoad : false
						}
					},
					switch:{
						checked : false
					}
				},
				pageConfig:{
					maxDate : '',
					minDate : ''
				},
				filterInfo:{
					statis : 'lists',
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
					beginDate : '',
					endDate   : ''
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
						self.filterForm.beginDate = res.result.GetProInfoBeginDate;
						self.filterForm.endDate = res.result.GetProInfoEndDate;
					}
					self.pageConfig.maxDate = res.result.GetProInfoMaxDate;
					self.pageConfig.minDate = res.result.GetProInfoMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
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
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','生产分析总计');
			if( sessionStorage.getItem('statis/getProInfo') !== null ){
				let storageData = JSON.parse(sessionStorage.getItem('statis/getProInfo'));
				this.filterForm = storageData;
				this.config.getConfig      = false;
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