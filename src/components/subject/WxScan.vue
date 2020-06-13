<template>
	<van-field v-model="result" placeholder="请输入订单号" label="条形码编号" input-align="center" maxlength="12">
	 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" @click="scanQRCode()" v-if="scanValuable"/>
	</van-field>
</template>
<script>
	import { Icon, Field, Toast  } from 'vant';
	import { submitForm } from '@/util';
	export default {
		components:{
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Toast.name]: Toast,
		},
		props:['scanResult','urlType'],
		data(){
			return {
				result       : this.scanResult,
				wxConfig     : {},
				scanValuable : false,
				href         : ''
			}
		},
		methods:{
			/*scanQRCode(){
				window.location.href = this.href;
			},
			isWX(){
				let self = this;
				this.$request.staff.wx.portValuable().then(res=>{
					if( res.errorCode == '00000' ){
						let ua = window.navigator.userAgent.toLowerCase();
						if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
							self.scanValuable   = true;
							self.href = 'http://' + res.result.main_domain + '/WxScanResult.html?urlType=' + self.urlType + '&redirectDomain=' + res.result.ori_domain + '&backPort=' + res.result.ori_back_port;
						}
					}
				});
			},*/
			scanQRCode(){
				let self = this;
				this.$request.staff.wx.scanQrCode( this.urlType ).then(res=>{
					if( res.errorCode == '00000' ){
						submitForm(res.server_url, { jssdk_info:res.result } );
						//submitForm(res.server_url, { scan_info:res.result } );
					}
				});
			},
			isWX(){
				let ua = window.navigator.userAgent.toLowerCase();
				if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
					this.scanValuable   = true;
				}
			}
		},
		created(){
			this.isWX();
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