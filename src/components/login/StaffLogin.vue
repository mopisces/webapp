<template>
	<div>
		<div>
			<div style="padding: 5%;  height: 100%;text-align:center;">
				{{ pageInfo.factoryName }}
			</div>
			<div style="width: 100%; text-align: center;">
				<van-image :src="pageInfo.factoryLogo" width="40%" height="100%"/>
			</div>
			<div style="margin: 0 auto;width:80%;padding-top:5%;">
				<van-field v-model="nameUpper" label="用户名" placeholder="请输入登录名" required input-align="center"/>
				<van-field v-model="formData.userPass" :type="config.field.type" label="密码" placeholder="请输入密码" required input-align="center" :right-icon="config.field.passIcon" @click-right-icon="eyeClick"></van-field>
				<van-field v-model="formData.subFactory" label="分厂" required
						placeholder="请选择分厂" clickable readonly  @click="config.popup.show = true" v-if="config.field.show">
					<van-icon name="arrow" slot="right-icon"/>
				</van-field>
				<van-button type="primary" size="normal" style="width:100%;margin-top:5px;" @click="onLogin">登录</van-button>
			</div>
			<van-popup v-model="config.popup.show" position="bottom" :style="{ height: '50%' }">
				<van-picker :columns="config.picker.columns" :default-index="config.picker.defaultIndex" show-toolbar @cancel="config.popup.show = false" @confirm="confirm" title="请选择分厂"/>
			</van-popup>
		</div>
		<copy-right></copy-right>
	</div>
</template>
<script>
	import { Button, Icon, Image, Row, Col, Popup, Picker, Field, Toast, Tab, Tabs } from 'vant';
	import schema from 'async-validator';
	import CopyRight from '@/components/subject/footer/CopyRight';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	import { clearLogin } from '@/util';
	/*api接口*/
	import { getSF, login, quickLogin, getUserInfo } from '@/api/common/index.js'
	/*后台地址*/
	import { backStageUrl } from '@/config/domain.js'
	
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Image.name]: Image,
			[Row.name]: Row,
			[Col.name]: Col,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Field.name]: Field,
			[Toast.name]: Toast,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			CopyRight
		},
		data(){
			return {
				config:{
					style:{
						div:''
					},
					popup:{
						show:false
					},
					picker:{
						columns:[],
						defaultIndex:0
					},
					field:{
						show:false,
						type:"text",
						passIcon:"eye-o"
					}
				},
				formData:{
					userType     : 1,
					userName     : '',
					userPass     : '',
					subFactory   : '',
					subFactoryId : ''
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
			confirm(value, index){
				this.formData.subFactory   = value.text + '(' + value.key + ')';
				this.formData.subFactoryId = value.key;
				this.config.popup.show     = false;
			},
			async getSF(){
				const { result } = await getSF()
				const { factory_info, sub_factory } = result
				this.pageInfo.factoryId = factory_info.FactoryId
				this.pageInfo.factoryName = factory_info.FactoryName
				this.pageInfo.factoryLogo = factory_info.FactoryLogo
				this.config.field.show = false
				if( sub_factory.length > 0 ) {
					sub_factory.forEach((item,index)=>{
						this.config.picker.columns.push({text:item.SShortName,key:item.SubFacId});
						if( this.formData.subFactoryId == item.SubFacId ){
							this.config.picker.defaultIndex = index
						}
					})
					this.config.field.show = true
				}

				this.$nextTick(()=>{
					if( this.config.field.show ){
						this.formData.subFactory = this.config.picker.columns[this.config.picker.defaultIndex].text + '(' + this.config.picker.columns[this.config.picker.defaultIndex].key + ')'
						this.formData.subFactoryId = this.config.picker.columns[this.config.picker.defaultIndex].key
					}
				})
				/*let self = this;
				this.$request.staff.login.getSF().then(res=>{
					self.pageInfo.factoryId   = res.result.factory_info.FactoryId;
					self.pageInfo.factoryName = res.result.factory_info.FactoryName;
					self.pageInfo.factoryLogo = res.result.factory_info.FactoryLogo;
					if( res.result.sub_factory.length !== 0 ){
						res.result.sub_factory.forEach((item,index)=>{
							self.config.picker.columns.push({text:item.SShortName,key:item.SubFacId});

							if( self.formData.subFactoryId == item.SubFacId ){
								self.config.picker.defaultIndex = index
							}
						});	
						self.config.field.show = true;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						if( this.config.picker.columns.length > 0 ){
							this.formData.subFactory  = this.config.picker.columns[this.config.picker.defaultIndex].text + '(' + this.config.picker.columns[this.config.picker.defaultIndex].key + ')';
							this.formData.subFactoryId = this.config.picker.columns[this.config.picker.defaultIndex].key;
						}else{
							this.formData.subFactoryId
						}
						
					})
				});*/
			},
			onLogin(){
				let self = this;
				if( this.formData.userType == 0 ){
					this.formData.subFactoryId = '';
				}
				this.validator.validate(this.formData).then(()=>{
					self.login( self.formData );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});				
			},
			async login( data ){
				await this.$store.dispatch('user/login', {
					user_name: data.userName.toUpperCase(),
					user_pass: data.userPass,
					user_type: data.userType,
					sub_fac_id: data.subFactoryId
				})
				setTimeout(async ()=>{
					if( this.$store.getters['user/accessToken'] && this.$store.getters['user/authMap'] ) {
						await this.$store.dispatch('staff/permission', this.$store.getters['user/authMap'])
						await this.$router.addRoutes(this.$store.state.staff.navList)
						this.$router.push('/staff/index/menu')
					}
				}, 1000)

				await setStorage('jpdn-staff-username', data.userName.toUpperCase())
				await setStorage('jpdn-staff-userpwd', data.userPass)
				/*let self = this;
				this.$request.login.login.login( data ).then(res=>{
					if( res.result.user_name != getStorage('jpdn-staff-username') ) removeStorage();
					self.setLocalInfo(res.result);
					self.result.userName = res.result.user_name;
				});*/
				/*const { result } = await login({
					user_name: data.userName.toUpperCase(),
					user_pass: data.userPass,
					user_type: data.userType,
					sub_fac_id: data.subFactoryId
				})
				if( result.user_name != getStorage('jpdn-staff-username') )
					removeStorage()
				await this.setLocalInfo(result)
				this.result.userName = result.user_name

				await this.getAuthName()*/
			},
			async quick(){
				/*let self = this;
				this.$request.login.login.quickLogin( this.$route.query.token ).then(res=>{
					if( res.result.user_name != getStorage('jpdn-staff-username') ) removeStorage();
					self.setLocalInfo(res.result);
					self.result.userName = res.result.user_name;
				});*/
				const { result } = await quickLogin({
					get_user_secret: this.$route.query.token || null
				})
				await this.$store.commit('user/setUserType', 'staff')
				await this.$store.commit("user/setAccessToken", result.access_token)
				await this.$store.dispatch('user/getUserInfo')
				setTimeout(async ()=>{
					if( this.$store.getters['user/accessToken'] && this.$store.getters['user/authMap'] ) {
						await this.$store.dispatch('staff/permission', this.$store.getters['user/authMap'])
						await this.$router.addRoutes(this.$store.state.staff.navList)
						this.$router.push('/staff/index/menu')
					}
				}, 1000)
				
				/*if( result.user_name != getStorage('jpdn-staff-username') ) 
					removeStorage()
				this.setLocalInfo(result)
				this.result.userName = result.user_name

				await this.getAuthName()*/
			},
			async setLocalInfo( info ){
				await setStorage('jpdn-staff-token',info.access_token, 'sessionStorage');
				await setStorage('jpdn-staff-refresh',info.refresh_token, 'sessionStorage');
				await setStorage('jpdn-staff-username',info.user_name);
				await setStorage('jpdn-staff-userpwd',info.user_pwd);
				await setStorage('jpdn-login-type','staff');
				await this.$store.commit('staff/setIsLogin', 1)
				await this.$store.commit('user/setUserType', 'staff')
				await this.$store.commit('user/setAccessToken', info.access_token)
			},
			async getAuthName( data ){
				const { result } = await getUserInfo()
				setStorage('staff-auth-url', result.available)
				this.$store.dispatch('staff/permission', result.available)
				this.$router.addRoutes(this.$store.state.staff.navList)

				this.$nextTick(()=>{
					this.$router.push('/staff/index/menu')
				})
				/*let self = this;
				let authUrl = '';
				this.$request.staff.user.getAuthName( data ).then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					setStorage('staff-auth-url',res.result.available);
					self.$store.dispatch('staff/permission', res.result.available);
					self.$router.addRoutes(self.$store.state.staff.navList);
				}).then(()=>{
					this.$nextTick(()=>{
						this.$router.push('/staff/index/menu');
					});
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
			}
		},
		created(){
			if( getStorage('jpdn-staff-username') ){
				this.formData.userName = getStorage('jpdn-staff-username');
			}
			if( getStorage('jpdn-staff-userpwd') ){
				this.formData.userPass = getStorage('jpdn-staff-userpwd');
			}
			clearLogin();

			this.config.style.div = 'width:100%;height:' + (window.screen.height - 96 ) + 'px';
			if( typeof (this.$route.query.token) != 'undefined' ){
				if( this.$route.query.token.length > 100 ){
					this.quick()
				}
			}
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.strOrderId = this.$route.query.scanRes;
			}
			this.$store.commit('client/setHeaderTitle','员工登陆')
			this.$store.commit('client/setTabbarActive','slogin')
		},
		mounted(){
			this.validator = new schema(this.rules);
			this.getSF();
		},
		updated(){
			
		},
		async destroyed(){
			await setStorage('jpdn-staff-username', this.formData.userName)
			await setStorage('jpdn-staff-userpwd', this.formData.userPass)
		},
		computed:{
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
