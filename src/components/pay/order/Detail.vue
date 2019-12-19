<template>
	<div>
		<van-row>
			<van-col span="6">
				<van-image width="90" height="90" src="https://img.yzcdn.cn/vant/cat.jpeg" round/>
			</van-col>
			<van-col span="16" offset="4">
				<span style="font-size:13px;font-weight:700;">{{wo.BoardId}}</span>
				<span>,{{wgo.Title}}</span>
				<span>
					下单价格:
					<span style="color: #e01835;">
						¥{{wgo.Price}}/㎡
					</span>&nbsp;
					<span style="color: #999;text-decoration: line-through;">
						¥{{wgo.MarketPrice}}/㎡
					</span>
				<span>
					下单金额&nbsp;
					<span style="color: #e01835;">
						¥{{wgo.Cost}}
					</span>
				</span>
				<span>
					节省金额&nbsp;
					<span style="color: #e01835;">
						¥{{wgo.SaveCost}}
					</span>
				</span>
			</van-col>
		</van-row>
		
	</div>
</template>
<script>
	import { Image, Row, Col } from 'vant';
	export default {
		components:{
			[Image.name]: Image,
			[Row.name]: Row,
			[Col.name]: Col,
		},
		data(){
			return {
				value:''
			}
		},
		methods:{
			
		},
		created(){
			this.$store.commit('client/setHeaderTitle','订单支付信息');
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>