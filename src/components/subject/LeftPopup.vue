<template>
	<van-popup v-model="show" position="left" :style="{ width: '100%',height:'100%' }" >
		<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
			<div class="van-nav-bar__title van-ellipsis">
				{{ title }}
			</div>
		</div>
		<div style="margin-top:46px;"></div>
		<slot name="left-popup-1"></slot>
		<slot name="left-popup-2"></slot>
		<slot name="left-popup-3"></slot>
		<slot name="left-popup-4"></slot>
		<slot name="left-popup-5"></slot>
		<slot name="left-popup-6"></slot>
		<slot name="left-popup-7"></slot>
		<div style="margin-bottom:50px"></div>
		<van-button type="primary" size="large" @click="closeLeft()" class="van-tabbar--fixed">关闭</van-button>
	</van-popup>
</template>
<script>
	import { Button, Popup } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup
		},
		props:['leftShow','title'],
		data(){
			return {
				show:this.leftShow,
			}
		},
		methods:{
			closeLeft(){
				this.show = false;
			}
		},
		mounted(){

		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			leftShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:leftShow", newV);
			}
		}
	}
</script>