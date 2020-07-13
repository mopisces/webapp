<template>
	<div>
		<van-button type="primary" v-if="show" @click="getDistance()">计算距离</van-button>
	</div>
</template>
<script>
	import { submitForm } from '@/util';
	import { Button, Dialog } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
		},
		data(){
			return {
				show:false
			}
		},
		methods:{
			getDistance(){
				this.$request.amap.tableInfo.getDistance().then(res=>{
					if( res.errorCode == '00000' ){
						submitForm(res.server_url, { jssdk_info:res.result } );
					}
				});
			}
		},
		created(){
			if( this.$route.query.distance ){
				let msg = '';
				if( this.$route.query.distance > 500 ){
					msg = '范围之外,距离目标点:' + this.$route.query.distance + '米';
				}else{
					msg = '范围之内,距离目标点:' + this.$route.query.distance + '米';
				}
				Dialog.alert({
					title: '距离测算',
					message: msg
				});
			}else{
				this.show = true;
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