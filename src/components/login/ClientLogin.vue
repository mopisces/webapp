<template>
	<div>
		<div>
			<div style="padding: 5%;  height: 100%;text-align:center;">
				{{ pageInfo.factoryName }}
			</div>
			<div style="width: 100%; text-align: center;">
				<van-image :src="pageInfo.factoryLogo" width="40%" height="50%"/>
			</div>
			<div style="margin: 0 auto;width:80%;padding-top:5%;">
				<van-field v-model="nameUpper" label="用户名" placeholder="请输入登录名" required input-align="center"/>
				<van-field v-model="formData.userPass" :type="config.field.type" label="密码" placeholder="请输入密码" required input-align="center" :right-icon="config.field.passIcon" @click-right-icon="eyeClick"/>
				<van-button type="primary" size="normal" style="width:100%;margin-top:5px;" @click="onLogin">登录</van-button>
				<van-button type="danger" size="normal" style="width:100%;margin-top:5px;" @click="registerClick()" v-if=" config.groupOpen ">注册</van-button>
			</div>
		</div>
		<copy-right></copy-right>
	</div>
</template>
<script>
	import login from '@/request/staff/login';
	import { Button, Image, Field, Toast, Divider } from 'vant';
	import schema from 'async-validator';
	import CopyRight from '@/components/subject/footer/CopyRight';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	import { clearLogin } from '@/util';
	export default {
		components:{
			[Button.name]: Button,
			[Image.name]: Image,
			[Field.name]: Field,
			[Toast.name]: Toast,
			[Divider.name]: Divider,

			CopyRight
		},
		data(){
			return {
				config:{
					style:{
						div:''
					},
					redirect:{
						name   : '',
						params : ''
					},
					field:{
						passIcon:'eye-o',
						type:'text'
					},
					groupOpen : ''
				},
				formData:{
					userType     : 0,
					userName     : '',
					userPass     : '',
					subFactoryId : '',
				},
				pageInfo:{
					factoryId:'',
					factoryLogo:'',
					factoryName:'',
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
					/*setStorage('jpdn-client-token',res.result.access_token);
					setStorage('jpdn-client-refresh',res.result.refresh_token);
					setStorage('jpdn-client-username',res.result.user_name);
					setStorage('jpdn-client-userpwd',res.result.user_pwd);
					setStorage('jpdn-client-isLogin',true);*/
					if( res.result.user_name != getStorage('jpdn-client-username') ) removeStorage();
					self.setLocalInfo(res.result);
					self.result.userName = res.result.user_name;
					//localStorage.setItem("client-loginInfo",JSON.stringify( this.formData ));
				});
			},
			quickLogin(){
				let self = this;
				this.$request.login.login.quickLogin( this.$route.query.token ).then(res=>{
					/*setStorage('jpdn-client-token',res.result.access_token);
					setStorage('jpdn-client-refresh',res.result.refresh_token);
					setStorage('jpdn-client-username',res.result.user_name);
					setStorage('jpdn-client-userpwd',res.result.user_pwd);
					setStorage('jpdn-client-isLogin',true);*/
					if( res.result.user_name != getStorage('jpdn-client-username') ) removeStorage();
					self.setLocalInfo(res.result);
					self.result.userName = res.result.user_name;
				});
			},
			async setLocalInfo( $info ){
				setStorage('jpdn-client-token',$info.access_token, 'sessionStorage');
				setStorage('jpdn-client-refresh',$info.refresh_token, 'sessionStorage');
				setStorage('jpdn-client-username',$info.user_name);
				setStorage('jpdn-client-userpwd',$info.user_pwd);
				setStorage('jpdn-client-isLogin',1, 'sessionStorage');
				setStorage('jpdn-login-type','client');
				await this.fetchConfig();
			},
			getAuthName( data ){
				let self = this;
				this.$request.staff.user.getAuthName( data ).then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					setStorage('client-auth-url',res.result.available);
					self.$store.dispatch('client/permission',res.result.available);
					self.$router.addRoutes(self.$store.state.client.navList);
				}).then(()=>{
					this.$nextTick(()=>{
						setStorage('jpdn-client-isLogin',1, 'sessionStorage');
						if( this.config.redirect.name != '' ){
							this.$store.commit('client/setTabbarActive','group');
							this.$router.replace({ name : this.config.redirect.name , params : { productId : this.config.redirect.params } }); 
						}else{
							this.$store.commit('client/setTabbarActive','menu');
							//this.$router.push('/client/index/menu');
							this.$router.push(this.$store.state.client.loginRedirect);
							this.$store.commit('client/setLoginRedirect','/client/index/menu')
						}
					});
				});
			},
			registerClick(){
				this.$router.push('/group/register');
			},
			getLogo(){
				let self = this;
				this.$request.staff.login.getSF().then(res=>{
					self.config.groupOpen = res.result.group_open == 1 ? true : false;
					self.pageInfo.factoryLogo = window.jpdn_domain_imgDomain + res.result.factory_info.FactoryLogo;
					self.pageInfo.factoryName = res.result.factory_info.FactoryName;
				});
			},
			eyeClick(){
				if( this.config.field.passIcon == 'eye-o'  ){
					this.config.field.passIcon = 'closed-eye';
					this.config.field.type = 'password';
				}else{
					this.config.field.passIcon = 'eye-o';
					this.config.field.type = 'text';
				}
			},
			fetchConfig(){
				this.$request.staff.login.fetchConfig().then(res=>{
					if( res.errorCode == '00000' ){
						setStorage('jpdn_webapp_config',{ selectNeedConfirm:res.result.BuildRadioNeedConfirm });
					}
				});
			}
		},
		created(){
			if( getStorage('jpdn-client-username') ){
				this.formData.userName = getStorage('jpdn-client-username');
			}
			if( getStorage('jpdn-client-userpwd') ){
				this.formData.userPass = getStorage('jpdn-client-userpwd');
			}
			/*setStorage('jpdn-client-isLogin',0,'sessionStorage');
			removeStorage('client-auth-url');
			removeStorage('jpdn-client-token', 'sessionStorage');
			removeStorage('jpdn-client-refresh', 'sessionStorage');
			this.$store.commit('client/setIsLogin',false);*/
			clearLogin();
			let height = window.screen.height - 96;
			this.config.style.div = 'width:100%;height:' + height + 'px';
			if( typeof (this.$route.query.token) != 'undefined' ){
				if( this.$route.query.token.length > 100 ){
					this.quickLogin();
				}
			}
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.strOrderId = this.$route.query.scanRes;
			}
			if( typeof(this.$route.params.redirectName) != 'undefined' ){
				this.config.redirect.name   = this.$route.params.redirectName;
				this.config.redirect.params = this.$route.params.productId;
			}
			this.getLogo();
			this.$store.commit('client/setHeaderTitle','客户登录');
			this.$store.commit('client/setTabbarActive','clogin');
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
