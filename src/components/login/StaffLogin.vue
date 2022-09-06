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
			getSF(){
				let self = this;
				this.$request.staff.login.getSF().then(res=>{
					self.pageInfo.factoryId   = res.result.factory_info.FactoryId;
					self.pageInfo.factoryName = res.result.factory_info.FactoryName;
					self.pageInfo.factoryLogo = window.jpdn_domain_imgDomain + res.result.factory_info.FactoryLogo;
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
				});
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
			login( data ){
				let self = this;
				this.$request.login.login.login( data ).then(res=>{
					/*setStorage('jpdn-staff-token',res.result.access_token);
					setStorage('jpdn-staff-refresh',res.result.refresh_token);
					setStorage('jpdn-staff-username',res.result.user_name);
					setStorage('jpdn-staff-userpwd',res.result.user_pwd);
					setStorage('jpdn-staff-isLogin',true);
					setStorage('jpdn-login-type','staff');*/
					if( res.result.user_name != getStorage('jpdn-staff-username') ) removeStorage();
					self.setLocalInfo(res.result);
					self.result.userName = res.result.user_name;
					//localStorage.setItem("staff-loginInfo",JSON.stringify( this.formData ));
				});
			},
			quickLogin(){
				let self = this;
				this.$request.login.login.quickLogin( this.$route.query.token ).then(res=>{
					/*setStorage('jpdn-staff-token',res.result.access_token);
					setStorage('jpdn-staff-refresh',res.result.refresh_token);
					setStorage('jpdn-staff-username',res.result.user_name);
					setStorage('jpdn-staff-userpwd',res.result.user_pwd);
					setStorage('jpdn-staff-isLogin',true);
					setStorage('jpdn-login-type','staff');*/
					if( res.result.user_name != getStorage('jpdn-staff-username') ) removeStorage();
					self.setLocalInfo(res.result);
					self.result.userName = res.result.user_name;
					
				});
			},
			setLocalInfo( $info ){
				setStorage('jpdn-staff-token',$info.access_token, 'sessionStorage');
				setStorage('jpdn-staff-refresh',$info.refresh_token, 'sessionStorage');
				setStorage('jpdn-staff-username',$info.user_name);
				setStorage('jpdn-staff-userpwd',$info.user_pwd);
				setStorage('jpdn-staff-isLogin',1, 'sessionStorage');
				setStorage('jpdn-login-type','staff');
			},
			getAuthName( data ){
				let self = this;
				let authUrl = '';
				this.$request.staff.user.getAuthName( data ).then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					/*res.result.available.forEach((item,index)=>{
						authUrl += item + ',';
					})*/
					setStorage('staff-auth-url',res.result.available);
					self.$store.dispatch('staff/permission', res.result.available);
					self.$router.addRoutes(self.$store.state.staff.navList);
				}).then(()=>{
					this.$nextTick(()=>{
						this.$router.push('/staff/index/menu');
					});
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
			}
		},
		created(){
			/*if( sessionStorage.getItem('jpdn-staff-username') !== null ){
				this.formData.userName = sessionStorage.getItem('jpdn-staff-username')
			}*/
			/*try{
				let loginInfo = JSON.parse(getStorage("staff-loginInfo"));
				if( loginInfo != null ){
					this.formData = loginInfo;
				}
			}catch(err){
				console.log( err )
			}*/
			if( getStorage('jpdn-staff-username') ){
				this.formData.userName = getStorage('jpdn-staff-username');
			}
			if( getStorage('jpdn-staff-userpwd') ){
				this.formData.userPass = getStorage('jpdn-staff-userpwd');
			}
			//setStorage('jpdn-login-type','staff');
			/*setStorage('jpdn-staff-isLogin', 0, 'sessionStorage');
			removeStorage('staff-auth-url');
			removeStorage('jpdn-staff-token', 'sessionStorage');
			removeStorage('jpdn-staff-refresh', 'sessionStorage');
			this.$store.commit('staff/setIsLogin',false);*/

			clearLogin();

			this.config.style.div = 'width:100%;height:' + (window.screen.height - 96 ) + 'px';
			if( typeof (this.$route.query.token) != 'undefined' ){
				if( this.$route.query.token.length > 100 ){
					this.quickLogin();
				}
			}
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.strOrderId = this.$route.query.scanRes;
			}
			this.$store.commit('client/setHeaderTitle','员工登陆');
			this.$store.commit('client/setTabbarActive','slogin');
		},
		mounted(){
			this.validator = new schema(this.rules);
			this.getSF();
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
