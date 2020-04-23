<template>
	<div>
		<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
			<div class="van-nav-bar__title van-ellipsis">生管监控登陆</div>
		</div>
		<div :style="pageInfo.bg">
			<div style="padding-top: 0.875rem;  height: 100%;text-align:center;">
				{{ pageInfo.factoryName }}
			</div>
			<div style="width: 100%; text-align: center;font-size:1.5rem; color: #fff;">
				<van-image :src="pageInfo.factoryLogo" width="40%" height="50%"/>
			</div>
			<div style="margin: 0 auto; float:none;width:80%;">
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
						self.$store.dispatch('sg/permission');
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