<template>
	<div>
		<van-popup v-model="popupShow" round  :style="{ height: '100%', width:'80%' }">
			123455
		</van-popup>
	</div>
</template>
<script>
	import { Popup } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
		},
		props:{
			loginShow:{
				default:false
			},
		},
		data(){
			return {
				show:this.loginShow
			}
		},
		methods:{

		},
		created(){
			console.log(this.loginShow)
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
			loginShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:loginShow", newV);
			}
		}
	}
</script>