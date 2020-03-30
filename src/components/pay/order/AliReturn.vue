<template>
	<div>
		跳转中......
	</div>
</template>
<script>
export default {
		data(){
			return {
				formData:{
					outTradeNo : '',
					tradeNo    : ''
				}
			}
		},
		methods:{
			getOrderId(){
				let self = this;
				this.$request.client.paymentAll.getOrderId( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$router.push({
							name:'payDetail',
							params:{
								orderId : res.result
							}
						});
					}
				});
			}
		},
		created(){
			this.formData.outTradeNo = this.$route.query.out_trade_no;
			this.formData.tradeNo    = this.$route.query.trade_no;
			this.getOrderId();
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