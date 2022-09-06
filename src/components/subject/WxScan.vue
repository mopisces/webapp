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
			scanQRCode(){
				/*this.$router.push('/common/scanCode');
				return ;*/
				let self = this;
				let postData = {
					urlType:this.urlType
				}
				if( this.urlType == '3' ){
					postData.listNo = this.$route.query.listNo;
					postData.isEdit = this.$route.query.isEdit;
					postData.orderType = this.$route.query.orderType;
				}
				this.$request.staff.wx.scanQrCode( postData ).then(res=>{
					if( res.errorCode == '00000' ){
						submitForm(res.server_url, { jssdk_info:res.result } );
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
			//this.scanValuable   = true;
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