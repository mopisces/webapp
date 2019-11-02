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
					<div class="van-col van-col--20">退货原因:{{ item.sumCount }}</div>
				</div>
			</div>
			<div slot="footer" style="text-align: right;">
				<van-button size="small" type="info" @click="config.popup.detailShow = true">订单</van-button>
			</div>
		</van-panel>
		<statis-order-list :show.sync="config.popup.detailShow" :filterForm="filterForm" type="returnQty"></statis-order-list>
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
						filterShow:false,
						detailShow:false
					},
					selectOption:{
						statisType:[
							{ text: '汇总',   value: '0' },
							{ text: '按退货原因' ,value:'1'},
							{ text: '按客户', value: '2' }
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
					beginDate:'2017-11-01',
					endDate:  '2019-11-01',
				}
			}
		},
		methods:{
			onRefresh(){
				this.getOrdReturnSum( {} );
			},
			selectOption( val ){
				console.log(val)
			},
			
			getOrdReturnSum( data ){
				let self = this;
				this.$request.staff.statis.getOrdReturnSum( data ).then(res=>{
					self.panelList = res.result;
				});
			}
		},
		mounted(){
			this.getOrdReturnSum( {} );
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','退货统计');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>