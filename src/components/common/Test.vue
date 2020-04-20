<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa">
			微信授权
		</van-loading>
	</div>
</template>
<script>
	import { Toast, Loading } from 'vant';
	import { post } from '@/request/request';
	export default {
		components:{
			[Toast.name]: Toast,
			[Loading.name]: Loading,
		},
		data(){
			return {
				info:{
					oriDomain     : 'test.leaper.ltd',
					backstagePort : '1110'
				}
			}
		},
		methods:{
			getCode(){
				let postData = {
					code_type : 'auth'
				};
				post( 'http://' + this.info.oriDomain + ':' + this.info.backstagePort + '/public/v1/alipay/getCode',postData).then(res=>{
					if( res.errorCode == '00000' ){
						window.location.href = res.result;
					}
				});
			},
			getConfig(){
				
			}
		},
		created(){
			this.getCode();
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