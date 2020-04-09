<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>
<script>
	import wx from 'weixin-js-sdk';
	import base from '@/request/base';
	import { Toast, Loading   } from 'vant';
	export default {
		components:{
			[Toast.name]: Toast,
			[Loading.name]: Loading,
		},
		data(){
			return {
				redirectUri : base.wxRediect,
				path        : ''
			}
		},
		methods:{
			setWxConfig(){
				let self = this;
				this.$request.staff.wx.getScanConfig( { urlType:this.$route.query.urlType } ).then(res=>{
					wx.config({
		                debug     : false,
		                appId     : res.result.appId,
		                timestamp : res.result.timestamp,
		                nonceStr  : res.result.nonceStr,
		                signature : res.result.signature,
		                jsApiList : ['scanQRCode']
		            });				
				});

				wx.error((err)=>{
                	Toast.fail(err);
                });

				wx.ready(()=>{
					wx.checkJsApi({
						jsApiList: [
							'scanQRCode'
						],
					});
					wx.scanQRCode({
						debug:false,
	                    needResult: 1,
	                    scanType: ['qrCode', 'barCode'],
	                    success: function(res){
	                    	let scanRes;
	                    	if( res.resultStr.indexOf(",") != -1 ){
	                    		scanRes = res.resultStr.split(',')[1];
	                    	}else{
	                    		scanRes = res.resultStr;	
	                    	}
	                    	window.location.href = 'http://' + self.path + '?scanRes=' + scanRes;
	                    }
	                });

				});
			},
			getRedirectPath( urlType ){
				
				let self = this;
				this.$request.staff.wx.portValuable().then(res=>{
					if( res.errorCode == '00000' && res.result.portValuable == '1' ){
						this.path = res.result.app_normal_domain + ':' + res.result.app_normal_port;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						switch( urlType ){
							case '0' :
								this.path += '/staff/paper/doStockOut';
								break;
							case '1' :
								this.path += '/staff/paper/doRStockIn';
								break;
							case '2' :
								this.path += '/staff/paper/directInStock';
								break;
							case '3' :
								this.path += '/staff/stow/detail';
								break;
							case '4' :
								this.path += '/staff/stock/mStockDetailR';
								break;
							default :
								this.path += '';
						}
						this.setWxConfig();
					});
				});
			}
		},
		created(){
			this.getRedirectPath( this.$route.query.urlType );
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