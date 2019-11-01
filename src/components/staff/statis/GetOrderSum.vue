<template>
	<div>
		<van-sticky :offset-top="46">
			<chart-header-select :show.sync="config.popup.chartSelect.show" :statisType="config.selectOption.statisType" :chartType="config.selectOption.chartType" :chartProperties="config.selectOption.chartProperties" @statusCloseClick="statusCloseClick" @chartTypeInside="chartTypeInside">
			</chart-header-select>
		
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%">刷新</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
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
				<van-button size="small" type="info" @click="detailShowClick()">订单</van-button>
			</div>
		</van-panel>
		<statis-order-list :show.sync="config.popup.detail.show" :filterForm="filterForm"></statis-order-list>
	</div>
</template>
<script>
	import { Button, Panel, Sticky } from 'vant';
	import ChartHeaderSelect from '@/components/subject/ChartHeaderSelect.vue';
	import StatisOrderList from '@/components/subject/StatisOrderList.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,

			ChartHeaderSelect,
			StatisOrderList
		},
		data(){
			return {
				config:{
					popup:{
						chartSelect:{
							show:false
						},
						rightFilter:{
							show:false
						},
						detail:{
							show:false
						}
					},
					selectOption:{
						statisType:[
							{ text: '汇总', value: '0' },
							{ text: '按坑型', value: '1' },
							{ text: '按客户', value: '2' },
							{ text: '按业务员', value: '3' },
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
					}
				},
				listInfo:[],
				filterForm:{
					sType:    1,
					dateType: 1,
					beginDate:'2017-11-01',
					endDate:  '2019-11-01',
				}
			}
		},
		methods:{
			statusCloseClick( val ){
				if( val.isClose === 1 ){
					this.config.popup.chartSelect.show = false;
				}else{
					this.config.popup.chartSelect.show = true;
				}
			},
			chartTypeInside( data ){
				this.config.selectOption.chartType = data;
			},
			getOrderSum( data ){
				let self = this;
				this.$request.staff.statis.getOrderSum( data ).then(res=>{
					self.listInfo = res.result;
				});
			},
			detailShowClick(){
				this.config.popup.detail.show = true;
				console.log('detailShowClick');
			}
		},
		mounted(){
			this.getOrderSum({});
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','订单统计');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>