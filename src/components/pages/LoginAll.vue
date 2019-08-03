<template>
	<div style="height:100%;">
		<van-nav-bar title="绍兴合润" left-text="返回" left-arrow  @click-left="onClickLeft">
			<div slot="right">
				<van-icon name="replay"/>刷新
			</div>
		</van-nav-bar>
		<van-image width="100%" src="https://img.yzcdn.cn/vant/cat.jpeg">
			<template v-slot:error>加载失败</template>
		</van-image>
		<van-row>
			<van-col span="8">
				<van-image round  src="https://img.yzcdn.cn/vant/cat.jpeg" @click="onClick"></van-image>
			</van-col>
			<van-col span="8">
				<van-image round  src="https://img.yzcdn.cn/vant/cat.jpeg"></van-image>
			</van-col>
			<van-col span="8">
				<van-image round  src="https://img.yzcdn.cn/vant/cat.jpeg"></van-image>
			</van-col>
		</van-row>
		<van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"></van-divider>
		<van-row>
			<van-col span="24" style="text-align:center;">
				<span>杭州利鹏科技有限公司 提供技术支持</span>
			</van-col>
		</van-row>
		<van-row>
			<van-col span="24" style="text-align:center;"> 
				<span>联系电话：18768443628</span>
			</van-col>
		</van-row>
	</div>
</template>
<script >
	import { Image, Row, Col, Divider, NavBar, Icon   } from 'vant';
	export default {
		data(){
			return {}
		},
		components:{
			[Image.name]:Image,
			[Row.name]:Row,
			[Col.name]:Col,
			[Divider.name]:Divider,
			[NavBar.name]:NavBar,
			[Icon.name]:Icon,
		},
		created(){

		},
		mounted(){

		},
		updated(){

		},
		methods:{
			onClick(){
				this.$router.push('/diff/login');
			},
			onClickLeft(){
				this.$router.push('/index');
			}
		}

	}
</script>