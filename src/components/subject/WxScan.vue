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
				scanValuable:true
			}
		},
		methods:{
			scanQRCode(){
				window.location.href = 'http://luodangfrp2.leaper.ltd/common/wxScan?urlType=' + this.urlType;
			},
			isWX(){
				let ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					if( sessionStorage.getItem('app_domain') !== null ){
						let domainInfo = JSON.parse(sessionStorage.getItem('app_domain'));
						if( domainInfo.portValuable == 1 ){
							this.scanValuable = true;
							return true;
						}
					}
				}
				this.scanValuable = false;
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