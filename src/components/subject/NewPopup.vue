<template>
	<van-popup v-model="show" :position="position" :style="{ width: '100%',height:'100%' }" >
		<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
			<div class="van-nav-bar__title van-ellipsis">
				{{ title }}
			</div>
		</div>
		<div style="margin-top:46px;"></div>
		<slot name="new-popup-1"></slot>
		<slot name="new-popup-2"></slot>
		<slot name="new-popup-3"></slot>
		<slot name="new-popup-4"></slot>
		<slot name="new-popup-5"></slot>
		<slot name="new-popup-6"></slot>
		<slot name="new-popup-7"></slot>
		<slot name="new-popup-qrcode"></slot>
		<div style="margin-bottom:50px"></div>
		<van-button type="primary" size="large" @click="click()" class="van-tabbar--fixed">{{ buttonText }}</van-button>
	</van-popup>
</template>
<script>
	import { Button, Popup } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup
		},
		props:['leftShow','title','position','isClose'],
		data(){
			return {
				show:this.leftShow,
				buttonText:''
			}
		},
		methods:{
			click(){
				if( this.isClose ){
					this.show = false;
					if( this.isClose == 2 ){
						this.$emit('saveClick');
					}
				}else{
					this.$emit('refreshPopup');
				}
				
			}
		},
		mounted(){

		},
		created(){
			if( this.isClose ){
				this.buttonText = '关闭';
				if( this.isClose == 2 ){
					this.buttonText = '保存';
				}
			}else{
				this.buttonText = '刷新';
			}
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