<template>
	<div>
		跳转中......
	</div>
</template>
<script>
export default {
		data(){
			return {
				value:''
			}
		},
		methods:{

		},
		created(){
			let orderId = this.$route.query.out_trade_no;
			this.$router.push({
				name:'payDetail',
				params:{
					orderId : orderId
				}
			});
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
<!-- http://localhost:1103/client/alipay/return?charset=UTF-8&out_trade_no=5e69e8960cef3&method=alipay.trade.wap.pay.return&total_amount=0.01&sign=ZmXLO5K2znzoNSowAp4uLIcsmxg1%2BxVlbB%2Bv%2BVosLtk0wRTJ6aqbkLuQgseF%2BGrWR0soWuofLy8%2FSjx7tsPnUIMZkyJVQrxc%2BthLNZDICGitg9kWgjhTHK5RJLqwCmhOFk9xe%2Fys2CJO567cb7H6ushj8uzJfMLNAUwQizDOOBpHBVuP4BxvgzyfnO%2FXjH5i5cEr1TqkN4rfsPkqcBsPjKbhgA0fi52izPLK7n7yoAl9sGZLpzDKNZmn%2Bf1%2Ff8cNIjy4YVU26rDGFPJRU9oP%2FiLnzk8EUsDeO12tacIH%2F4WI46VLlBhq%2Fv%2FWer9J4ZuSP8SE%2BlEpk0UweVvLJwS5Tw%3D%3D&trade_no=2020031222001446261428375554&auth_app_id=2019052365360173&version=1.0&app_id=2019052365360173&sign_type=RSA2&seller_id=2088531297386848&timestamp=2020-03-12+15%3A45%3A46 -->