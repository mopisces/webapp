<template>
	<van-popup :value="leftShow" position="left" :style="{ width: '100%',height:'100%' }" >
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
		<van-button type="primary" size="large" @click="closeLeft()" class="van-tabbar--fixed">大号按钮</van-button>
	</van-popup>
</template>
<script>
	import { Popup, Button } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
			[Button.name]: Button,
		},
		props:{
			leftShow:{
				type:Boolean,
				default:false,
				required:true
			},
			title:{
				type:String,
				defalut:'',
				required:true
			}
		},
		data(){
			return {
				
			}
		},
		methods:{
			closeLeft(){
				this.$emit('closeLeft');
			}
		},
		mounted(){

		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>