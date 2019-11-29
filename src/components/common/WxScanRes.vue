<template>
	<div>
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
				wxConfig:{},
				result : ''
			}
		},
		methods:{
			setWxConfig(){
				let self = this;
				this.$request.staff.wx.getScanConfig( { urlType:this.urlType } ).then(res=>{
					self.wxConfig = res.result;
					wx.config({
		                debug     : true,
		                appId     : self.wxConfig.appId,
		                timestamp : self.wxConfig.timestamp,
		                nonceStr  : self.wxConfig.nonceStr,
		                signature : self.wxConfig.signature,
		                jsApiList : ['scanQRCode']
		            });
		            let self = this;
					wx.scanQRCode({
						debug:true,
	                    needResult: 1,
	                    success: function(res){
	                    	Toast.success(res.resultStr);
	                        self.result = res.resultStr;
	                    }
	                });
	                wx.error((err)=>{
	                	Toast.fail(err);
	                });
				});
				/*this.$request.staff.wx.getScanConfig( { urlType:this.urlType } ).then(res=>{
					self.wxConfig = res.result;
				}).then(()=>{
					this.$nextTick(()=>{
						wx.config({
			                debug     : true,
			                appId     : self.wxConfig.appId,
			                timestamp : self.wxConfig.timestamp,
			                nonceStr  : self.wxConfig.nonceStr,
			                signature : self.wxConfig.signature,
			                jsApiList : ['scanQRCode']
			            });
			            this.scanQRCode();
					})
				});*/
				/*this.wxConfig = JSON.parse( this.$route.query.config );
				Toast.success(this.$route.path.params.path);*/

				/*wx.config({
	                debug     : true,
	                appId     : this.wxConfig.appId,
	                timestamp : this.wxConfig.timestamp,
	                nonceStr  : this.wxConfig.nonceStr,
	                signature : this.wxConfig.signature,
	                jsApiList : ['scanQRCode']
	            });
	            wx.scanQRCode({
	            	debug: true,
                    needResult: 1,
                    success: function(res){
                    	Toast.success(res.resultStr);
                        self.result = res.resultStr;
                    }
                });
                wx.error((err)=>{
                	Toast.fail('微信扫码失败');
                });*/
			},
			/*scanQRCode(){
				window.alert(JSON.stringify(this.wxConfig));
				wx.config({
	                debug     : true,
	                appId     : this.wxConfig.appId,
	                timestamp : this.wxConfig.timestamp,
	                nonceStr  : this.wxConfig.nonceStr,
	                signature : this.wxConfig.signature,
	                jsApiList : ['scanQRCode']
	            });
				let self = this;
				wx.scanQRCode({
                    needResult: 1,
                    success: function(res){
                    	window.alert(res);
                        self.result = res.resultStr;
                    }
                });
                wx.error((err)=>{
                	window.alert(JSON.stringify(err));
                });
                window.location.href = 'http://test.leaper.ltd:1104'+ this.wxConfig.redirect + '?result='+ encodeURIComponent(this.result) ;
                //this.$router.push({path:'http://test.leaper.ltd:1104' + this.wxConfig.redirect, params: {result: this.result }})
			},
			scanQRCode(){
				if( this.wxConfig.timestamp == undefined || Math.round(new Date().getTime()/1000) >= (this.wxConfig.timestamp + Number(7200)) ){
					this.setWxConfig();
				}else{
					wx.config({
		                debug     : true,
		                appId     : this.wxConfig.appId,
		                timestamp : this.wxConfig.timestamp,
		                nonceStr  : this.wxConfig.nonceStr,
		                signature : this.wxConfig.signature,
		                jsApiList : ['scanQRCode']
		            });
				}
				let self = this;

				wx.ready(()=>{
					wx.checkJsApi({
						jsApiList: [
							'scanQRCode'
						],
					});
					success : (res)=>{
						if (res.checkResult.scanQRCode === true) {
							wx.scanQRCode({
			                    needResult: 1,
			                    scanType: ['qrCode', 'barCode'],
			                    success: function(res){
			                    	self.result = res.resultStr;
			                    	window.location.href = 'http://test.leaper.ltd:1104'+ this.wxConfig.redirect + '?result='+ encodeURIComponent(this.result) ;
			                    }
			                });
						}else {
							alert('抱歉，当前客户端版本不支持扫一扫');
						}
					}

				});
				
                wx.error((err)=>{
                	Toast.fail('微信扫码失败');
                });

			},*/
		},
		created(){
			//this.$store.commit('staff/setHeaderTitle','');
			//window.alert(this.$store.state.staff.wxConfig.appId)
			//console.log( JSON.parse( this.$route.query.config) ) ;
			this.setWxConfig();

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