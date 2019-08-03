<template>
	<div class="container">
		<van-nav-bar title="绍兴合润" left-text="返回" left-arrow @click-left="onClickLeft">
		</van-nav-bar>
		<div style="width:75%;height:75%;position:relative;left:12%;top:10%;">
			<img src="https://img.yzcdn.cn/vant/cat.jpeg" style="width:100%;">	
			<van-cell-group>
				<van-field v-model="loginForm.userName" placeholder="请输入用户名" left-icon="contact" required :error-message="errorMessage.userName"/>
				<van-field v-model="loginForm.userPass" placeholder="请输入密码" left-icon="closed-eye" style="border-top:1px soild;" required :error-message="errorMessage.userPass"/>
			</van-cell-group>
			<van-button type="primary" size="large" style="margin-top:5%;" @click="submitForm">登录</van-button>
		</div>
		
	</div>
</template>
<script >
	import { Image, NavBar, Icon, Button, Field, CellGroup   } from 'vant';
	export default {
		data(){
			return {
				show:true,
				loginForm:{
					userName:'',
					userPass:''
				},
				errorMessage:{
					userName:'',
					userPass:''
				}
			}
		},
		components:{
			[Image.name]:Image,
			[NavBar.name]:NavBar,
			[Icon.name]:Icon,
			[Button.name]:Button ,
			[Field.name]:Field ,
			[CellGroup.name]:CellGroup ,
		},
		created(){

		},
		mounted(){
			document.documentElement.clientWidth
			document.documentElement.clientHeight
		},
		updated(){

		},
		methods:{
			onClickLeft(){
				this.$router.push('/all/login');
			},
			submitForm(){
				console.dir('submit');
			}
		}

	}
</script>
<style >
	.container{
		width:100%;
		height: 100%;
		
	}

</style>