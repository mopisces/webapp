<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa" />
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
				config : {}
			}
		},
		methods:{
			getOpenId(){
				let postData = {
					token : this.$route.query.token
				};
				post( 'http://' + this.$route.query.oriDomain + ':' + this.$route.query.backstagePort + '/public/v1/alipay/getOpenId', postData ).then(res=>{
					if( res.errorCode == '00000' ){
						window.location.href = res.result;
					}
				});
			}
		},
		created(){
			if( this.$route.query.token && this.$route.query.oriDomain && this.$route.query.oriPort && this.$route.query.backstagePort  ){
				this.getOpenId();
			}else{
				this.$route.go(-1);
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
        padding-top: 10rem; 
    }
</style>