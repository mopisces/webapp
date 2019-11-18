<template>
	<van-field v-model="result" placeholder="请输入订单号" label="条形码编号" input-align="center" maxlength="12">
	 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" @click="scanQRCode()" v-if="scanValuable"/>
	</van-field>
</template>
<script>
	import wx from 'weixin-js-sdk';
	import { Icon, Field, Toast  } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Toast.name]: Toast,
		},
		props:['scanResult','urlType'],
		data(){
			return {
				result: this.scanResult,
				wxConfig:{},
				scanValuable:false
			}
		},
		methods:{
			setWxConfig(){
				let self = this;
				this.$request.staff.wx.getScanConfig( { urlType:this.urlType } ).then(res=>{
					self.wxConfig = res.result;
				}).then(()=>{
					wx.config({
		                debug     : true,
		                appId     : self.wxConfig.appId,
		                timestamp : self.wxConfig.timestamp,
		                nonceStr  : self.wxConfig.nonceStr,
		                signature : self.wxConfig.signature,
		                jsApiList : ['scanQRCode']
		            });
				})
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
				wx.scanQRCode({
                    needResult: 1,
                    success: function(res){
                    	Toast.success(res.resultStr);
                        self.result = res.resultStr;
                    }
                });
                wx.error((err)=>{
                	Toast.fail('微信扫码失败');
                });
			}
		},
		created(){
			if( sessionStorage.getItem('app_domain') !== null ){
				let domainInfo = JSON.parse(sessionStorage.getItem('app_domain'));
				if( domainInfo.portValuable == 1 ){
					this.scanValuable = true;
				}
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
			scanResult(newV,oldV){
				this.result = newV;
			},
			result(newV,oldV){
				this.$emit("update:scanResult", newV);
			}
		}
	}
</script>