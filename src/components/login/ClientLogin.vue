<template>
	<div :style="'min-height: '+ viewH/16 +'rem;background-color: #fff;'">
		<div>
			<div style="padding: 5%;  height: 100%;text-align:center;">
				{{ pageInfo.factoryName }}1
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
	//import login from '@/request/staff/login'
	import { Button, Image, Field, Toast, Divider } from 'vant'
	import schema from 'async-validator'
	import CopyRight from '@/components/subject/footer/CopyRight'
	import { getStorage, setStorage, removeStorage } from '@/util/storage'
	import { clearLogin } from '@/util'

	/*api接口*/
	import { getSF, login, quickLogin, getUserInfo, fetchConfig } from '@/api/common/index.js'
	/*后台地址*/
	import { backStageUrl } from '@/config/domain.js'
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
					self.goLogin( self.formData )
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message)
				});				
			},
			async goLogin( data ){
				await this.$store.dispatch('user/login', {
					user_name: data.userName.toUpperCase(),
					user_pass: data.userPass,
					user_type: data.userType,
					sub_fac_id: data.subFactoryId
				})
				setTimeout(async ()=>{
					if( this.$store.getters['user/accessToken'] && this.$store.getters['user/authMap'] ) {
						await this.$store.dispatch('client/permission', this.$store.getters['user/authMap'])
						await this.$router.addRoutes(this.$store.state.client.navList)
						if( this.config.redirect.name ) {
							this.$router.replace({ 
								name: this.config.redirect.name, 
								params: { productId: this.config.redirect.params }
							})
						} else {
							this.$router.push(this.$store.state.client.loginRedirect)
						}
						this.$store.commit('client/setLoginRedirect','/client/index/menu')
					}
				}, 1000)

				await setStorage('jpdn-client-username', data.userName.toUpperCase())
				await setStorage('jpdn-client-userpwd', data.userPass)
				
				/*const { result } = await login({
					user_name: data.userName.toUpperCase(),
					user_pass: data.userPass,
					user_type: data.userType,
					sub_fac_id: data.subFactoryId
				})
				if( result.user_name != getStorage('jpdn-client-username') ) 
					removeStorage()
				this.setLocalInfo(result);
				this.result.userName = result.user_name;*/
				/*let self = this;
				this.$request.login.login.login( data ).then(res=>{
					if( res.result.user_name != getStorage('jpdn-client-username') ) removeStorage();
					self.setLocalInfo(res.result);
					self.result.userName = res.result.user_name;
				});*/
			},
			async quick(){
				/*let self = this;
				this.$request.login.login.quickLogin( this.$route.query.token ).then(res=>{
					if( res.result.user_name != getStorage('jpdn-client-username') ) removeStorage();
					self.setLocalInfo(res.result);
					self.result.userName = res.result.user_name;
				});*/
				const { result } = await quickLogin({
					get_user_secret: this.$route.query.token || null
				})
				await this.$store.commit('user/setUserType', 'client')
				await this.$store.commit("user/setAccessToken", result.access_token)
				await this.$store.dispatch('user/getUserInfo')
				setTimeout(async ()=>{
					if( this.$store.getters['user/accessToken'] && this.$store.getters['user/authMap'] ) {
						await this.$store.dispatch('client/permission', this.$store.getters['user/authMap'])
						await this.$router.addRoutes(this.$store.state.client.navList)
						this.$router.push('/client/index/menu')
					}
				}, 1000)
				/*if( result.user_name != getStorage('jpdn-client-username') ) 
					removeStorage()
				this.setLocalInfo(res.result);
				this.result.userName = result.user_name;*/
			},
			async setLocalInfo( info ){
				await setStorage('jpdn-client-token', info.access_token, 'sessionStorage')
				await setStorage('jpdn-client-refresh', info.refresh_token, 'sessionStorage')
				await setStorage('jpdn-client-username',info.user_name)
				await setStorage('jpdn-client-userpwd', info.user_pwd)
				//await setStorage('jpdn-client-isLogin',1, 'sessionStorage')
				await setStorage('jpdn-login-type', 'client')
				await this.$store.commit('user/setAccessToken', info.access_token)
				await this.$store.commit('user/setUserType', 'client')
				await this.$store.commit('client/setIsLogin', 1)
				await this.getConfig()
				await this.getAuthName()
			},
			async getAuthName(){
				const { result } = await getUserInfo()
				setStorage('client-auth-url', result.available)
				this.$store.dispatch('client/permission', result.available)
				this.$router.addRoutes(this.$store.state.client.navList)

				this.$nextTick(()=>{
					setStorage('jpdn-client-isLogin', 1, 'sessionStorage')
					if( this.config.redirect.name != '' ) {
						this.$store.commit('client/setTabbarActive','group');
						this.$router.replace({ 
							name: this.config.redirect.name, 
							params: { productId: this.config.redirect.params }
						})
					} else {
						this.$store.commit('client/setTabbarActive','menu');
						this.$router.push(this.$store.state.client.loginRedirect);
						this.$store.commit('client/setLoginRedirect','/client/index/menu')
					}
				})
				/*let self = this;
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
							this.$router.push(this.$store.state.client.loginRedirect);
							this.$store.commit('client/setLoginRedirect','/client/index/menu')
						}
					});
				});*/
			},
			registerClick(){
				this.$router.push('/group/register');
			},
			async getLogo(){
				const { result } = await getSF()
				const { factory_info, group_open } = result
				this.config.groupOpen = group_open == 1 ? true : false
				this.pageInfo.factoryName = factory_info.FactoryName
				this.pageInfo.factoryLogo = factory_info.FactoryLogo
				/*let self = this;
				this.$request.staff.login.getSF().then(res=>{
					self.config.groupOpen = res.result.group_open == 1 ? true : false;
					self.pageInfo.factoryLogo = res.result.factory_info.FactoryLogo;
					self.pageInfo.factoryName = res.result.factory_info.FactoryName;
				});*/
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
			async getConfig(){
				const { result } = await fetchConfig()
				setStorage('jpdn_webapp_config',{ selectNeedConfirm: result.BuildRadioNeedConfirm })
				/*this.$request.staff.login.fetchConfig().then(res=>{
					if( res.errorCode == '00000' ){
						setStorage('jpdn_webapp_config',{ selectNeedConfirm:res.result.BuildRadioNeedConfirm });
					}
				});*/
			}
		},
		async created(){
			if( getStorage('jpdn-client-username') ){
				this.formData.userName = getStorage('jpdn-client-username');
			}
			if( getStorage('jpdn-client-userpwd') ){
				this.formData.userPass = getStorage('jpdn-client-userpwd');
			}
			await clearLogin()
			if( typeof (this.$route.query.token) != 'undefined' ){
				if( this.$route.query.token.length > 100 ){
					this.quick()
				}
			}
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.strOrderId = this.$route.query.scanRes;
			}
			if( typeof(this.$route.params.redirectName) != 'undefined' ){
				this.config.redirect.name   = this.$route.params.redirectName;
				this.config.redirect.params = this.$route.params.productId;
			}
			await this.getLogo()
		},
		mounted(){
			this.validator = new schema(this.rules);
			this.$store.commit('client/setTabbarActive', 'clogin')
			this.$store.commit('client/setHeaderTitle', '客户登录')
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			}),
			/*usernameChange(){
				return this.result.userName;
			},*/
			nameUpper:{
				get :function(){
					return this.formData.userName;
				},
				set : function(newV){
					this.formData.userName = newV.toUpperCase();
				}
			},
			loginRedirect: {
				get() {
					return this.$store.state.client.loginRedirect
				},
				set( nVal ) {
					this.$store.commit('client/setLoginRedirect', nVal)
				}
			}
		},
		watch:{
			/*usernameChange( newV, oldV ){
				if( typeof(newV) !== 'undefined' && newV.length > 0 ){
					this.getAuthName( {UserName:newV} );
				}
			}*/
		}
	}
</script>
