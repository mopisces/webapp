<template>
	<div>
		<div id="qrcode" class="qrcode"></div>
	</div>
</template>
<script>
	import QRCode from 'qrcodejs2';
	import { post } from '@/request/request';
	export default {
		data(){
			return {
				value:''
			}
		},
		methods:{
			getQrcode(){
				let self = this;
				post('http://test.leaper.ltd:1110/public/v1/staff/WxQrCode').then((res)=>{
					document.getElementById('qrcode').innerHTML = '';
					new QRCode('qrcode',{
						text         : 'http://luodangfrp2.leaper.ltd/getCode.html?token='+ res.result +'&oriDomain=test.leaper.ltd&backstagePort=1110&type=auth',
				     	colorDark    : '#000000',
				      	colorLight   : '#ffffff',
				      	correctLevel : QRCode.CorrectLevel.H
					});
				});
			}
		},
		created(){
			this.getQrcode();
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
	.qrcode img{
		margin:50% auto;
		width:60%;
	}
</style>