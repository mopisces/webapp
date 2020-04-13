<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>
<script>
	import { Toast, Loading } from 'vant';
	export default {
		components:{
			[Toast.name]: Toast,
			[Loading.name]: Loading,
		},
		data(){
			return {
				config : {},
				redirectDomain:'',
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
						alert(res.err_code+res.err_desc+res.err_msg)
					}
				);
			},
			wxPayJwt(){
				let self = this;
				this.$request.payAll.payAll.wxPayJwt( this.$route.query.token ).then(res=>{
					alert(  JSON.stringify(res.result) )
					if( res.errorCode == '00000' ){
						self.redirectDomain = res.data.redirect_domain;
					}
				}).then(()=>{
					this.wxPayForJsapi();
				});
			},
			wxPayForJsapi(){
				let data = {
					token : this.$route.query.token,
					code  : this.$route.query.code
				};
				let self = this;
				alert( 123 );
				this.$request.payAll.payAll.wxPayForJsapi(data).then(res=>{
					alert(  JSON.stringify(res.result) )
					if( res.errorCode == '00000' ){
						self.config = res.result;
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
				alert(this.$route.query.code);
				this.wxPayJwt();
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