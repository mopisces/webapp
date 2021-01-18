<template>
	<div>
		<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
			<div class="van-nav-bar__title van-ellipsis">{{factory}}</div>
		</div>
		<div>
			<div style="width: 100%; text-align: center;padding-top:25%;">
				<van-image :src="logo" width="80%" height="80%"/>
			</div>
			<div style="margin: 0 auto; float:none;width:80%;padding-top:20%;">
				<van-field v-model="formData.userName" label="用户名" placeholder="请输入登录名" required/>
				<van-field v-model="formData.userPass" type="password" label="密码" placeholder="请输入密码" required></van-field>
				<van-button type="primary" size="normal" style="width:100%;margin-top:5px;" @click="onLogin">登录</van-button>
			</div>
		</div>
		<copy-right></copy-right>
	</div>
</template>
<script>
	import { Button, Image, Field, Toast } from 'vant';
	import schema from 'async-validator';
	import CopyRight from '@/components/subject/footer/CopyRight';
	export default {
		components:{
			[Button.name]: Button,
			[Image.name]: Image,
			[Field.name]: Field,
			[Toast.name]: Toast,

			CopyRight
		},
		data(){
			return {
				config:{
					style:{
						div:''
					},
				},
				formData:{
					userName : '',
					userPass : ''
				},
				validator : {},
				rules:{
					userName : [
						{ type: 'string', required: true, message: '请输入用户名'}
					],
					userPass : [
						{ type: 'string', required: true, message: '请输入密码'},
					]
				},
				logo: require( '../../assets/image/jplogo.png'),
				factory:''
			}
		},
		methods:{
			getLogo(){
				this.$request.sg.login.getFactoryName().then(res=>{
					this.factory = res.result;
				});
			},
			onLogin(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.login( self.formData );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});				
			},
			login(){
				let self = this;
				this.$request.sg.login.login( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						sessionStorage.setItem('jpdn-sg-token',res.result.access_token);
						sessionStorage.setItem('jpdn-sg-root',res.result.root);
						self.$store.dispatch('sg/permission',res.result.root);
						self.$router.push('/sg/monitor/websocket');
						localStorage.setItem("sg-loginInfo",JSON.stringify( this.formData ));
					}
				});
			}
		},
		created(){
			sessionStorage.clear();
			try{
				let loginInfo = JSON.parse(localStorage.getItem("sg-loginInfo"));
				this.formData.userName = loginInfo.userName;
				this.formData.userPass = loginInfo.userPass;
			}catch(err){
				console.log( err )
			}
			let height = window.screen.height;
			this.config.style.div = 'width:100%;height:' + height + 'px';
			this.getLogo();
		},
		mounted(){
			this.validator = new schema(this.rules);
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