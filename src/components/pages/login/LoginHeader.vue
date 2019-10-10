<template>
	<div>
		<div class="login-header">
			<van-nav-bar title="绍兴合润" left-text="返回" left-arrow  @click-left="onClickLeft">
				<div slot="right" @click="clickRefresh">
					<van-icon name="replay"/>刷新
				</div>
			</van-nav-bar>
			<img class="user-poster" src="https://img.yzcdn.cn/public_files/2017/10/23/8690bb321356070e0b8c4404d087f8fd.png">
			<van-notice-bar text="联系电话：18768443628" left-icon="volume-o" />
		</div>
		<router-view></router-view>
		<van-divider>Copyright © 2019.</van-divider>
		<van-divider>佳鹏电脑 All rights reserved.</van-divider>	
	</div>
</template>
<script>
	import { NavBar, Icon, Divider, NoticeBar} from 'vant';
	export default {
		data(){
			return {
				isLoading:false,
				active:1
			}
		},
		components:{
			[NavBar.name]:NavBar,
			[Icon.name]:Icon,
			[Divider.name]:Divider,
			[NoticeBar.name]:NoticeBar
		},
		created(){

		},
		mounted(){
			
		},
		updated(){

		},
		methods:{
			onClickLeft(){
				console.dir('left');
			},
			clickRefresh(){
				location.reload(); 
			}
		}

	}
</script>
<style>
	.user-poster{
		width: 100vw;
    	height: 25vh;
    	display: block;
	}
	.login-header{
		width: 100vw;
    	height:45vh;
    	display: block;
	}
	.container{
		width: 100vw;
    	height:55vh;
    	display: block;
	}
	.login-footer{
		width: 100vw;
    	height:25vh;
    	display: block;
	}
</style>