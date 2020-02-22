<template>
	<div :style="pageInfo.bg">
		<div style="width:100%;height:5%;position:fixed;top:50px;text-align:center;font-weight:500;font-size:1rem;">
			{{ pageInfo.factoryName }}
		</div>
		<div style="width:100%;height:20%;position:fixed;top:80px;text-align:center;">
			<van-image :src="pageInfo.factoryLogo" width="40%" height="100%"/>
		</div>
		<div style="width: 80%;height:40%;position: fixed;top: 35%;left:10%;text-align:center;">
			<van-field v-model="nameUpper" label="用户名" placeholder="请输入登录名" required/>
			<van-field v-model="formData.userPass" type="password" label="密码" placeholder="请输入密码" required></van-field>
			<van-button type="primary" size="normal" style="width:100%;margin-top:5px;" @click="onLogin">登录</van-button>
			<van-button type="danger" size="normal" style="width:100%;margin-top:5px;" @click="registerClick()">注册</van-button>
		</div>
		<div :style="config.style.div"></div>
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
				formData:{
					userType     : 0,
					userName     : '',
					userPass     : '',
					subFactoryId : '',
				},
				pageInfo:{
					factoryId:'',
					factoryLogo:require('@/assets/logo.png'),
					factoryName:'',
					bg:'background: url('+ require('@/assets/bg.png') +') no-repeat;background-size:cover;width:100%;height:100%;'
				},
				validator:{},
				rules:{
					userName:[
						{ type: 'string', required: true, message: '请输入用户名'},
						{ regexp: '/^[a-zA-Z0-9]{2,12}$/', message: '用户名格式错误'},
					],
					userPass:[
						{ type: 'string', required: true, message: '请输入密码'},
						{ regexp: '/^[a-zA-Z0-9]{2,12}$/', message: '密码格式错误'},
					]
				},
				result:{
					userName : '',
					authName : ''
				}
			}
		},
		methods:{
			onLogin(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.login( self.formData );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});				
			},
			login( data ){
				let self = this;
				this.$request.login.login.login( data ).then(res=>{
					sessionStorage.setItem('jpdn-client-token',res.result.access_token);
					sessionStorage.setItem('jpdn-client-refresh',res.result.refresh_token);
					sessionStorage.setItem('jpdn-client-username',res.result.user_name);
					self.result.userName = res.result.user_name;
				});
			},
			quickLogin(){
				let self = this;
				this.$request.login.login.quickLogin( this.$route.query.token ).then(res=>{
					sessionStorage.setItem('jpdn-client-token',res.result.access_token);
					sessionStorage.setItem('jpdn-client-refresh',res.result.refresh_token);
					sessionStorage.setItem('jpdn-client-username',res.result.user_name);
					self.result.userName = res.result.user_name;
				});
			},
			getAuthName( data ){
				this.$store.dispatch('client/permission');
				console.log(this.$store.state.client.navList);
				this.$router.addRoutes(this.$store.state.client.navList);
				this.$router.push('/client/index/menu');
			},
			registerClick(){
				this.$router.push('/group/register');
			}
		},
		created(){
			if( sessionStorage.getItem('jpdn-client-username') !== null ){
				this.formData.userName = sessionStorage.getItem('jpdn-client-username')
			}
			sessionStorage.clear();
			this.$store.commit('common/setTitle','客户登录');
			this.config.style.div = 'width:100%;height:' + window.screen.height + 'px';
			if( typeof (this.$route.query.token) != 'undefined' ){
				if( this.$route.query.token.length > 100 ){
					this.quickLogin();
				}
			}
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.strOrderId = this.$route.query.scanRes;
			}
			this.$store.commit('common/setType','client');
			this.$store.commit('common/setTitle','客户登录');
			this.$store.commit('common/setIndexActive','clogin');
		},
		mounted(){
			this.validator = new schema(this.rules);
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			usernameChange(){
				return this.result.userName;
			},
			nameUpper:{
				get :function(){
					return this.formData.userName;
				},
				set : function(newV){
					this.formData.userName = newV.toUpperCase();
				}
			}
		},
		watch:{
			usernameChange( newV, oldV ){
				if( typeof(newV) !== 'undefined' && newV.length > 0 ){
					this.getAuthName( {UserName:newV} );
				}
			}
		}
	}
</script>
