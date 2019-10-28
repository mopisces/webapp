<template>
	<div>
		<div class="vant-row">
			<div class="van-col van-col--6">
				<div class="van-tabbar-item" style="height:44px;">账号：AQ</div>
			</div>
			<div class="van-col van-col--8">
				<van-button type="info"  plain hairline round>
					<van-icon class-prefix="iconfont" size="16" name="iconfontmima"/>
					更改密码
				</van-button>
			</div>
			<div class="van-col van-col--10">
				<van-button type="info"  plain hairline round >
					<van-icon class-prefix="iconfont" size="16" name="erweima2"/>
					登录二维码
				</van-button>
			</div>
		</div>
			
		<van-grid square :gutter="10" :column-num="3">
			<van-grid-item v-for="(item,index) in config.gridItem" :key="index" :to="item.url" :text="item.text">
				<van-icon class-prefix="iconfont" size="28" :name="item.iconName" slot="icon" :color="item.state"/>
			</van-grid-item>
		</van-grid>
	</div>
</template>
<script>
	import { Grid, GridItem, Icon, Cell, Button  } from 'vant';
	export default {
		components:{
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,
			[Icon.name]: Icon,
			[Cell.name]: Cell,
			[Button.name]: Button,

		},
		/*
		state: #0bf147 -> 已完成, #eff30c -> 正在开发 , #0b27f1 -> 未开发 
		 */
		data(){	
			return {
				config:{
					gridItem:[
						{text:'用户管理',iconName:'guanwangicon31334',url:'',state:'#0b27f1'},
						{text:'ERP订单',iconName:'erp',url:'/staff/erp/getOrders',state:'#0bf147'},
						{text:'客户每日订单',iconName:'meiri',url:'/staff/daily/wGetCusOrder',state:'#eff30c'},
						{text:'客户信用余额',iconName:'xinyongyue',url:'/staff/cred/wGetCusAmt',state:'#0bf147'},
						{text:'订单统计',iconName:'dingdan2',url:'',state:'#0b27f1'},
						{text:'退货统计',iconName:'tuihuo1',url:'',state:'#0b27f1'},
						{text:'传单统计',iconName:'chuandan',url:'',state:'#0b27f1'},
						{text:'库存统计',iconName:'storage',url:'/staff/statis/getOrdStock',state:'#eff30c'},
						{text:'生产分析总计',iconName:'shengchan',url:'/staff/statis/getProInfo',state:'#0bf147'},
						{text:'原纸采购',iconName:'caigou',url:'/staff/paperbuy/wGetPOMain',state:'#eff30c'},
						{text:'原纸收货',iconName:'che2',url:'/staff/paperbuy/wGetPOIn',state:'#0bf147'},
						{text:'原纸出库',iconName:'ccgl-chukucaozuo-5',url:'/staff/paper/doStockOut',state:'#eff30c'},
						{text:'原纸入库',iconName:'ruku',url:'/staff/paper/doRStockIn',state:'#eff30c'},
						{text:'直接入库',iconName:'ruku2',url:'/staff/paper/directInStock',state:'#eff30c'},
						{text:'原纸库存',iconName:'weishengzhi',url:'/staff/paper/getSStocks',state:'#0bf147'},
						{text:'安全库存',iconName:'anquanmenhu',url:'/staff/paper/paperSafe',state:'#0bf147'},
						{text:'扫描装货',iconName:'zhuangche1',url:'/staff/stow/lists',state:'#eff30c'},
						{text:'库存修改',iconName:'iconfontzhizuobiaozhunbduan24',url:'',state:'#0b27f1'},
						{text:'库区面积',iconName:'fangwumianji',url:'/staff/stock/deliveryArea',state:'#0bf147'},
						{text:'订单试算',iconName:'jisuanqi',url:'/staff/calc/index',state:'#eff30c'},
						{text:'收款调账',iconName:'yewutiaozhang',url:'/staff/frec/recAdjust',state:'#0bf147'},
						{text:'客户往来统计',iconName:'kehu',url:'/staff/frec/cusContact',state:'#0bf147'},
					]
				}
			}
		},
		methods:{
			
		},
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','菜单页面');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>