<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>
<script>
	import { Dialog, Loading, Toast  } from 'vant';
	import { post } from '@/request/request';
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
				getConfig    : false,
				orderId      : '',
				returnDomain : '',
				backstagePath: ''
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
			wxPayForJsapi(){
				let postData = {
					token : this.$route.query.token,
					code  : this.$route.query.code
				};
				let self = this;
				post(this.backstagePath + '/public/v1/alipay/wxPayForJsapi', postData).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.appId     = res.result.appId;
						self.config.timeStamp = res.result.timeStamp;
						self.config.nonceStr  = res.result.nonceStr;
						self.config.package   = res.result.package;
						self.config.signType  = res.result.signType;
						self.config.paySign   = res.result.paySign;
						window.orderId        = res.result.orderId;
						window.returnDomain   = res.result.return_domain;
						self.getConfig        = true;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.isReady();
					});
				});
			},
			isReady(){
				if( !this.getConfig ){
					Toast.fail('获取支付信息失败');
					this.$router.go(-2);
				}
				this.time = setInterval(() =>{
					if (typeof WeixinJSBridge != "undefined"){
						this.jsApiCall(this.config);
						clearInterval(this.time);
					}
				},500);
			}
		},
		created(){
			if( this.$route.query.token && this.$route.query.oriDomain && this.$route.query.backstagePort && this.$route.query.code  ){
				this.backstagePath = 'http://' + this.$route.query.oriDomain + ':' + this.$route.query.backstagePort;
				this.wxPayForJsapi();
			}else{
				Toast.fail( '参数错误' );
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
{"signType":"MD5","appId":"wx8f9065d8c32ab018","timeStamp":"'1586911474'","package":"prepay_id=wx1508443448054579b1e064071009597700","nonceStr":"14m0z9342897me0j4la34r6akcctw81m","paySign":"E4EEE8D26DB464E8E8B909762C47B30B","orderId":"20200415002","return_domain":"http://test.leaper.ltd:1104"}