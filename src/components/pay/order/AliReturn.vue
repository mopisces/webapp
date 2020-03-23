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
			console.log(this.$route.query.out_trade_no)
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