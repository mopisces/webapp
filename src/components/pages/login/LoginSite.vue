<template>
	<van-grid :border="false" :column-num="3">
		<van-grid-item to="/entrance/login/exact">
			<van-image src="https://img.yzcdn.cn/vant/apple-2.jpg" />
			<span>客户入口</span>
		</van-grid-item>
		<van-grid-item to="/entrance/login/exact">
			<van-image src="https://img.yzcdn.cn/vant/apple-2.jpg" />
			<span>公司人员入口</span>
		</van-grid-item>
		<van-grid-item to="/entrance/login/exact">
			<van-image src="https://img.yzcdn.cn/vant/apple-2.jpg" />
			<span>联系我们</span>
		</van-grid-item>
		<van-grid-item to="/entrance/login/exact">
			<van-image src="https://img.yzcdn.cn/vant/apple-2.jpg" />
			<span>团购纸板</span>
		</van-grid-item>
		<van-grid-item to="/entrance/login/exact">
			<van-image src="https://img.yzcdn.cn/vant/apple-2.jpg" />
			<span>团购纸板</span>
		</van-grid-item>
	</van-grid>
</template>
<script >
	import { Image,  Grid, GridItem  } from 'vant';
	export default {
		data(){
			return {}
		},
		components:{
			[Image.name]:Image,
			[Grid.name]:Grid,
			[GridItem.name]:GridItem,
		},
		created(){

		},
		mounted(){

		},
		updated(){

		},
		methods:{
			onClick(){
				this.$router.push('/entrance/login/exact');
			}
		}

	}
</script>
<style>
	
</style>
