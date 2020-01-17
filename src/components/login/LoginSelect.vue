<template>
	<div :style="pageInfo.bg">
		<div style="width:100%;height:5%;position:fixed;top:50px;text-align:center;font-weight:500;font-size:1rem;">
			{{ pageInfo.factoryName }}
		</div>
		<div style="width:100%;height:20%;position:fixed;top:80px;text-align:center;">
			<van-image :src="pageInfo.factoryLogo" width="40%" height="100%"/>
		</div>
		<div style="width: 80%;height:40%;position: fixed;top: 35%;left:10%;text-align:center;">
			<van-tabs v-model="formData.userType" animated>
				<van-tab title="客户登录">
				</van-tab>
				<van-tab title="员工登录">
				</van-tab>
			</van-tabs>
			<van-field v-model="formData.userName" label="用户名" placeholder="请输入登录名" required/>
			<van-field v-model="formData.userPass" type="password" label="密码" placeholder="请输入密码" required></van-field>
			<van-field v-model="formData.subFactory" label="分厂" required
					placeholder="请选择分厂" clickable readonly  @click="config.popup.show = true" v-if="config.field.show && formData.userType == 1 ">
				<van-icon name="arrow" slot="right-icon"/>
			</van-field>
			<van-button type="primary" size="normal" style="width:100%;margin-top:5px;" @click="onLogin">登录</van-button>
			<van-button type="danger" size="normal" style="width:100%;margin-top:5px;" @click="registerClick()">注册</van-button>
		</div>
		<!-- <div class="footer" style="width: 100%;position: fixed;bottom: 1%;">
			<van-row type="flex" justify="center" style="text-align:center;">
				<van-col span="18">Copyright © 2019 杭州利鹏科技有限公司.</van-col>
			</van-row>
			<van-row type="flex" justify="center" style="text-align:center;">
				<van-col span="18">Powered by 杭州利鹏科技有限公司.</van-col>
			</van-row>
			<van-row type="flex" justify="center" style="text-align:center;">
				<van-col span="18">Contact：18768443628</van-col>
			</van-row>
		</div> -->
		<div :style="config.style.div"></div>
		<van-popup v-model="config.popup.show" position="bottom" :style="{ height: '50%' }">
			<van-picker :columns="config.picker.columns" :default-index="0" show-toolbar @cancel="config.popup.show = false" @confirm="confirm" title="请选择分厂"/>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Icon, Image, Row, Col, Popup, Field, Picker, Toast, Tab, Tabs } from 'vant';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Image.name]: Image,
			[Row.name]: Row,
			[Col.name]: Col,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Picker.name]: Picker,
			[Toast.name]: Toast,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
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
						columns:[]
					},
					field:{
						show:false
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
					],
					userType:[
						{ type:'number' , regexp: '/^[0-1]{1}$/', message: '用户类型格式错误'},
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
					console.log(res);
					self.pageInfo.factoryId   = res.result.factory_info.FactoryId;
					self.pageInfo.factoryName = res.result.factory_info.FactoryName;
					if( res.result.sub_factory.length !== 0 ){
						res.result.sub_factory.forEach((item,index)=>{
							self.config.picker.columns.push({text:item.SShortName,key:item.SubFacId});
						});
						self.config.field.show = true;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						if( this.config.picker.columns.length > 0 ){
							this.formData.subFactory  = this.config.picker.columns[0].text + '(' + this.config.picker.columns[0].key + ')';
							this.formData.subFactoryId = this.config.picker.columns[0].key;
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
					sessionStorage.setItem('jpdn-login-token',res.result.access_token);
					sessionStorage.setItem('jpdn-login-refresh',res.result.refresh_token);
					sessionStorage.setItem('jpdn-login-username',res.result.user_name);
					self.result.userName = res.result.user_name;
				});
			},
			quickLogin(){
				let self = this;
				this.$request.login.login.login( this.$route.query.token ).then(res=>{
					sessionStorage.setItem('jpdn-login-token',res.result.access_token);
					sessionStorage.setItem('jpdn-login-refresh',res.result.refresh_token);
					sessionStorage.setItem('jpdn-login-username',res.result.user_name);
					self.result.userName = res.result.user_name;
				});
			},
			getAuthName( data ){
				let self = this;
				this.$request.staff.user.getAuthName( data ).then(res=>{
					sessionStorage.setItem('auth-url',JSON.stringify(res.result.available));
					self.$store.dispatch('staff/permission', res.result.available);
					this.$router.addRoutes(this.$store.state.staff.navList);
				}).then(()=>{
					this.$nextTick(()=>{
						if( this.formData.userType == 1 ){
							this.$router.push('/staff/index/menu');
						}else{
							this.$router.push('/client/index/menu');
						}
					});
				});
			},
			registerClick(){
				this.$router.push('/group/register');
			}
		},
		created(){
			if( sessionStorage.getItem('jpdn-login-username') !== null ){
				this.formData.userName = sessionStorage.getItem('jpdn-login-username')
			}
			sessionStorage.clear();
			this.$store.commit('staff/setHeaderTitle','用户登录');
			this.config.style.div = 'width:100%;height:' + window.screen.height + 'px';
			if( typeof (this.$route.query.token) != 'undefined' ){
				if( this.$route.query.token.length > 100 ){
					this.quickLogin();
				}
			}
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.strOrderId = this.$route.query.scanRes;
			}

		},
		mounted(){
			this.$store.commit('client/setHeaderTitle','登录/注册');
			this.validator = new schema(this.rules);
			this.getSF();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			/*tabActiveChange(){
				return this.formData.userType;
			},*/
			usernameChange(){
				return this.result.userName;
			}
		},
		watch:{
			/*tabActiveChange( newV, oldV ){
				if( newV == 0 ){
					this.formData.userName = 'AQ';
					this.formData.userPass = 'AQ';
				}else{
					this.formData.userName = 'CR';
					this.formData.userPass = 'CR';
				}
			},*/
			usernameChange( newV, oldV ){
				if( typeof(newV) !== 'undefined' && newV.length > 0 ){
					this.getAuthName( {UserName:newV} );
				}
			}
		}
	}
</script>
