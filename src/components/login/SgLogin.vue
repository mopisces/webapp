<template>
	<div>
		<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
			<div class="van-nav-bar__title van-ellipsis">生管监控登陆</div>
		</div>
		<div :style="pageInfo.bg">
			<div style="width:100%;height:5%;position:fixed;top:10%;text-align:center;font-weight:500;font-size:1rem;">
				{{ pageInfo.factoryName }}
			</div>
			<div style="width:100%;height:20%;position:fixed;top:20%;text-align:center;">
				<van-image :src="pageInfo.factoryLogo" width="40%" height="100%"/>
			</div>
			<div style="width: 80%;height:40%;position: fixed;top: 45%;left:10%;text-align:center;">
				<van-field v-model="formData.userName" label="用户名" placeholder="请输入登录名" required/>
				<van-field v-model="formData.userPass" type="password" label="密码" placeholder="请输入密码" required></van-field>
				<van-button type="primary" size="normal" style="width:100%;margin-top:5px;" @click="onLogin">登录</van-button>
			</div>
			<div :style="config.style.div"></div>
		</div>
	</div>
</template>
<script>
	import { Button, Image, Field, Toast } from 'vant';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Image.name]: Image,
			[Field.name]: Field,
			[Toast.name]: Toast,
		},
		data(){
			return {
				config:{
					style:{
						div:''
					},
				},
				pageInfo:{
					factoryName : '123',
					factoryLogo : '',
					bg:'background: url('+ this.$store.state.common.imgUrl + 'bg.png' +') no-repeat;background-size:cover;width:100%;height:100%;'
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
				}
			}
		},
		methods:{
			getLogo(){
				let self = this;
				this.$request.staff.login.getSF().then(res=>{
					self.pageInfo.factoryLogo = this.$store.state.common.imgUrl + res.result.factory_info.FactoryLogo;
					self.pageInfo.factoryName = res.result.factory_info.FactoryName;
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
						self.$router.push('/sg/menu');
						sessionStorage.setItem('jpdn-sg-root',res.result.root);
					}
				});
			}
		},
		created(){
			sessionStorage.clear();
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