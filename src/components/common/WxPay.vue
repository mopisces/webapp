<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>
<script>
	import { Dialog, Loading, Toast  } from 'vant';
	export default {
		components:{
			[Dialog.name]: Dialog,
			[Loading.name]: Loading,
			[Toast.name]: Toast,
		},
		data(){
			return {
				config : {
					debug     : true,
					appId     : '',
					timeStamp : '',
					nonceStr  : '',
					package   : '',
					signType  : '',
					paySign   : ''
				},
				redirectDomain:'',
				orderId:'',
				returnDomain:'',
			}
		},
		methods:{
			callWxPay( config ){
				if (typeof WeixinJSBridge == "undefined"){
					if( document.addEventListener ){
						document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					}else if (document.attachEvent){
						document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
						document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					}
				}else{
					this.jsApiCall( this.config );
				}
			},
			jsApiCall( config ){
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest',
					config,
					function (res){
						let message = '';
						if( res.err_msg === "get_brand_wcpay_request:ok" ){
							message = '支付成功';
						}else{
							message = '支付失败';
						}
						Dialog.alert({
							message     : message
						}).then(()=>{
							window.location.href = window.returnDomain + '/client/pay/detail?orderId=' + window.orderId;
						});
					}
				);
			},
			wxPayJwt(){
				let self = this;
				this.$request.payAll.payAll.wxPayJwt( this.$route.query.token ).then(res=>{
					if( res.errorCode == '00000' ){
						self.redirectDomain = res.result.data.redirect_domain;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.wxPayForJsapi();
					});
				});
			},
			wxPayForJsapi(){
				let data = {
					token : this.$route.query.token,
					code  : this.$route.query.code
				};
				let self = this;
				this.$request.payAll.payAll.wxPayForJsapi(data).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.appId     = res.result.appId;
						self.config.timeStamp = res.result.timeStamp;
						self.config.nonceStr  = res.result.nonceStr;
						self.config.package   = res.result.package;
						self.config.signType  = res.result.signType;
						self.config.paySign   = res.result.paySign;
						window.orderId = res.result.orderId;
						window.returnDomain = res.result.return_domain;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.isReady();
					});
				});	
			},
			isReady(){
				this.time = setInterval(() =>{
					if (typeof WeixinJSBridge != "undefined"){
						this.jsApiCall(this.config);
						clearInterval(this.time);
					}
				},500);
			}
		},
		created(){
			if( this.$route.query.token && this.$route.query.code ){
				this.wxPayJwt();
			}else{
				Toast.fail( JSON.stringify( this.$route.query ) )
			}
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
<style>
	.content{
        width:100%;
        height:100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 10rem; 
    }
</style>