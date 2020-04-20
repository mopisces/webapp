<template>
	<div class="content">
		<van-loading type="spinner" color="#1989fa">
			微信授权
		</van-loading>
	</div>
</template>
<script>
	import { Toast, Loading } from 'vant';
	import { post,get } from '@/request/request';
	export default {
		components:{
			[Toast.name]: Toast,
			[Loading.name]: Loading,
		},
		data(){
			return {
				info:{
					oriDomain: 'test.leaper.ltd',
					backstagePort : '1110'
				}
			}
		},
		methods:{
			getAuth(){
				let self = this;
				this.$request.payAll.payAll.wechatPay( data ).then(res=>{
					if( res.errorCode == '00000' ){
						let url = 'http://' + res.result.server_info.Frp80PortDomain + '/getCode.html?token=' + res.result.token + '&oriDomain=' + res.result.server_info.OriDomain + '&oriPort=' + res.result.server_info.OriPort + '&backstagePort=' + res.result.server_info.BackstagePort + '&type=auth';
						window.location.href = url;
					}
				});
			}
		},
		created(){
			this.getAuth();
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
{"message":"Request failed with status code 500","name":"Error","stack":"Error: Request failed with status code 500\n    at e.exports (https://cdn.bootcss.com/axios/0.19.0/axios.min.js:8:6410)\n    at e.exports (https://cdn.bootcss.com/axios/0.19.0/axios.min.js:8:6257)\n    at XMLHttpRequest.d.onreadystatechange (https://cdn.bootcss.com/axios/0.19.0/axios.min.js:8:5142)","config":{"url":"http://test.leaper.ltd:1110/public/v1/alipay/getWxUserInfo","method":"post","data":"code=001zSJMw1UGELf0UyeKw1UMoMw1zSJMY","headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded;charset=UTF-8","Authentication":""},"transformRequest":[null],"transformResponse":[null],"timeout":5000,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"cancelToken":{"promise":{}}}}