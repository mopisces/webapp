<template>
	<van-cell-group>
		<van-field v-model="loginForm.userName" placeholder="请输入用户名" left-icon="contact" required :error-message="errorMessage.userName"/>
		<van-field v-model="loginForm.userPass" placeholder="请输入密码" left-icon="closed-eye" style="border-top:1px soild;" required :error-message="errorMessage.userPass"/>
		<van-button type="primary" size="large" @click="submitForm">登录</van-button>
	</van-cell-group>
</template>
<script >
	import { Button, Field, CellGroup  } from 'vant';
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
					userPass:'',
					radio:''
				}
			}
		},
		components:{
			[Button.name]:Button ,
			[Field.name]:Field ,
			[CellGroup.name]:CellGroup ,
		},
		created(){

		},
		mounted(){
		},
		updated(){

		},
		methods:{
			submitForm(){
				console.dir('submit');
			}
		}

	}
</script>
<style>
	
</style>