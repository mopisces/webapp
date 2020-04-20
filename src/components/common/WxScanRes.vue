<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>
<script>
	import wx from 'weixin-js-sdk';
	import { Toast, Loading } from 'vant';
	export default {
		components:{
			[Toast.name]: Toast,
			[Loading.name]: Loading,
		},
		data(){
			return {
				path : ''
			}
		},
		methods:{
			setWxConfig(){
				let self = this;
				this.$request.staff.wx.getScanConfig( { urlType:this.$route.query.urlType, domain:this.$route.query.redirectDomain, port:this.$route.query.redirectPort} ).then(res=>{
					wx.config({
		                debug     : false,
		                appId     : res.result.appId,
		                timestamp : res.result.timestamp,
		                nonceStr  : res.result.nonceStr,
		                signature : res.result.signature,
		                jsApiList : ['scanQRCode']
		            });

				}).then(()=>{
					this.$nextTick(()=>{
						wx.error((err)=>{
							console.log(err)
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
			                    	window.location.href = self.path + '?scanRes=' + scanRes;
			                    }
			                });

						});
					})
				});

				
			},
			getRedirectPath( urlType ){
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
			}
		},
		created(){
			this.path = 'http://' + this.$route.query.redirectDomain + ':' + this.$route.query.redirectPort;
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