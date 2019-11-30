<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>
<script>
	import wx from 'weixin-js-sdk';
	import { Toast, Loading   } from 'vant';
	export default {
		components:{
			[Toast.name]: Toast,
			[Loading.name]: Loading,
		},
		data(){
			return {
				redirectUri : 'http://test.leaper.ltd:1104',
				path        : ''
			}
		},
		methods:{
			setWxConfig(){
				let self = this;
				this.$request.staff.wx.getScanConfig( { urlType:this.$route.query.urlType } ).then(res=>{
					Toast.success(res.result.appId);
					wx.config({
		                debug     : true,
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
						debug:true,
	                    needResult: 1,
	                    scanType: ['qrCode', 'barCode'],
	                    success: function(res){
	                    	Toast.success(res.resultStr);
	                    	window.location.href = 'http://test.leaper.ltd:1104' + self.path + '?scanRes=' + res.resultStr;
	                    	
	                    }
	                });

				});
			},
			getRedirectPath( urlType ){
				switch( urlType ){
					case '0' :
						this.path = '/staff/paper/doStockOut';
						break;
					case '1' :
						this.path = '/staff/paper/doRStockIn';
						break;
					case '2' :
						this.path = '/staff/paper/directInStock';
						break;
					case '3' :
						this.path = '/staff/stow/detail';
						break;
					case '4' :
						this.path = '/staff/stock/mStockDetailR';
						break;
					default :
						this.path = '';
				}
			}
		},
		created(){
			this.getRedirectPath( this.$route.query.urlType );
			if( this.path != '' ){
				this.setWxConfig();
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
    }
</style>