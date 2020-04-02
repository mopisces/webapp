<template>
	<van-field v-model="result" placeholder="请输入订单号" label="条形码编号" input-align="center" maxlength="12">
	 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" @click="scanQRCode()" v-if="scanValuable"/>
	</van-field>
</template>
<script>
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
				scanValuable:false,
				base:''
			}
		},
		methods:{
			scanQRCode(){
				window.location.href = 'http://' + this.base + '/common/wxScan?urlType=' + this.urlType;
			},
			isWX(){
				let self = this;
				this.$request.staff.wx.portValuable().then(res=>{
					if( res.errorCode == '00000' ){
						let ua = window.navigator.userAgent.toLowerCase();
						if( /*ua.match(/MicroMessenger/i) == 'micromessenger' &&*/ res.result.portValuable == 1 ){
							self.scanValuable = true;
							self.base = res.result.app_wx_domain;
						}
					}
				});
			},
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