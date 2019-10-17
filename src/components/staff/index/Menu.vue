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
				<van-icon class-prefix="iconfont" size="28" :name="item.iconName" slot="icon"/>
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
		data(){	
			return {
				config:{
					gridItem:[
						{text:'用户管理',iconName:'guanwangicon31334',url:''},
						{text:'ERP订单',iconName:'erp',url:''},
						{text:'客户每日订单',iconName:'meiri',url:''},
						{text:'客户信用余额',iconName:'xinyongyue',url:'/staff/cred/wGetCusAmt'},
						{text:'订单统计',iconName:'dingdan2',url:''},
						{text:'退货统计',iconName:'tuihuo1',url:''},
						{text:'传单统计',iconName:'chuandan',url:''},
						{text:'库存统计',iconName:'storage',url:''},
						{text:'生产分析总计',iconName:'shengchan',url:''},
						{text:'原纸采购',iconName:'caigou',url:''},
						{text:'原纸收货',iconName:'che2',url:''},
						{text:'原纸出库',iconName:'ccgl-chukucaozuo-5',url:''},
						{text:'原纸入库',iconName:'ruku',url:''},
						{text:'直接入库',iconName:'ruku2',url:''},
						{text:'原纸库存',iconName:'weishengzhi',url:''},
						{text:'安全库存',iconName:'anquanmenhu',url:'/staff/paper/paperSafe'},
						{text:'扫描装货',iconName:'zhuangche1',url:''},
						{text:'库存修改',iconName:'iconfontzhizuobiaozhunbduan24',url:''},
						{text:'库区面积',iconName:'fangwumianji',url:'/staff/stock/deliveryArea'},
						{text:'订单试算',iconName:'jisuanqi',url:'/staff/calc/index'},
						{text:'收款调账',iconName:'yewutiaozhang',url:'/staff/frec/recAdjust'},
						{text:'客户往来统计',iconName:'kehu',url:'/staff/frec/cusContact'},
					]
				}
			}
		},
		methods:{
			
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