<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>
<script>
	import { Toast, Loading } from 'vant';
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
			wxPayJwt(){
				this.$request.payAll.payAll.wxPayJwt( this.$route.query.token ).then(res=>{
					if( res.errorCode == '00000' ){
						window.location.href = res.result.url;
					}
				})
			}
		},
		created(){
			if( this.$route.query.token  ){
				this.wxPayJwt();
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