<template>
	<van-pull-refresh v-model="config.reloading" @refresh="pullOnRefresh">
		<van-list v-model="config.loading" :finished="config.finished"  finished-text="没有更多了" @load="onLoad">
			<van-panel v-for="(item,index) in panelList" :key="index">
				<div slot="default">
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--20">货品名称:{{ item.MatName }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--20">订单编号:{{ item.strOrderId }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">客订单号:{{ item.CusPoNo }}</div>
						<div class="van-col van-col--10">材质:{{ item.BoardId }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">客户:{{ item.CusId}}</div>
						<div class="van-col van-col--10">客户简称:{{ item.CusShortName }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--20">规格:{{ item.GuiGe }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--20">压线:{{ item.ScoreInfo }}</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--6">订单数:{{ item.OrdQty }}</div>
						<div class="van-col van-col--6">送货数:{{ item.DeliQty }}</div>
						<div class="van-col van-col--6">退货数:{{ item.ReturnQty }}</div>
					</div>
				</div>
			</van-panel>
		</van-list>
	</van-pull-refresh>
</template>
<script>
	import { List, PullRefresh, Panel } from 'vant';
	export default {
		components:{
			[List.name]: List,
			[PullRefresh.name]: PullRefresh,
			[Panel.name]: Panel,
		},
		props:['panelList'],
		data(){
			return {
				config:{
					reloading:false,
					loading:false,
					finished:false,
				}
			}
		},
		methods:{
			pullOnRefresh(){
				
			}
		},
		mounted(){

		},
		created(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>