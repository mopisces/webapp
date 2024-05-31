<template>
	<div style="padding-bottom:3.125rem;">
		<van-sticky :offset-top="46">
			<van-dropdown-menu>
				<van-dropdown-item v-model="filterForm.statis" :options="config.dropMenu.options" />
			</van-dropdown-menu>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
			<div style="height:0.5rem;width:100%;"></div>
		</van-sticky>
		<div id="container" v-show="filterForm.statis === 'charts' "></div>
		<van-cell v-for="(item,index) in data" :key="index" v-show="filterForm.statis === 'lists'">
			<div slot="title">
				{{ item.CateName }}
			</div>
			<div slot="label">
				<p>
					<span style="color:#000;">订单总面积:</span>
					<span style="color:#1da02b;">{{ item.sumOrdArea }}</span>
				</p>
				<p>
					<span style="color:#000;">总金额:</span>
					<span style="color:#1da02b;">{{ item.sumAmt }}</span>
				</p>
			</div>
		</van-cell>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				<!-- <new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker> -->
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import {  Button, Cell, Field, SwitchCell, DropdownMenu, DropdownItem, Sticky } from 'vant';
	import Highcharts from 'highcharts/highstock';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

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
			//NewTimePicker,
			TimeRangePicker
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
					endDate   : '',
					statis:'lists'
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
			async getProInfoConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				if( this.config.getConfig ) {
					this.filterForm.beginDate = result.GetProInfoBeginDate
					this.filterForm.endDate = result.GetProInfoEndDate
				}
				this.pageConfig.maxDate = result.GetProInfoMaxDate
				this.pageConfig.minDate = result.GetProInfoMinDate
				if( isReset ) return 
				await this.getProInfo(this.filterForm)
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
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('statis/getProInfo',JSON.stringify(this.filterForm));
				}else{
					removeStorage('statis/getProInfo');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','生产分析总计');
			if( getStorage('statis/getProInfo') !== null ){
				let storageData = JSON.parse(getStorage('statis/getProInfo'));
				this.filterForm = storageData;
				this.config.getConfig      = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.getProInfoConfig();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			chartsType(){
				return this.filterForm.statis;
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