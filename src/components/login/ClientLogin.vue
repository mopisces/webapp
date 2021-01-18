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
					sessionStorage.setItem('jpdn-client-token',res.result.access_token);
					sessionStorage.setItem('jpdn-client-refresh',res.result.refresh_token);
					sessionStorage.setItem('jpdn-client-username',res.result.user_name);
					self.result.userName = res.result.user_name;
					localStorage.setItem("client-loginInfo",JSON.stringify( this.formData ));
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
				let self = this;
				this.$request.staff.user.getAuthName( data ).then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					sessionStorage.setItem('client-auth-url',JSON.stringify(res.result.available));
					self.$store.dispatch('client/permission',res.result.available);
					self.$router.addRoutes(self.$store.state.client.navList);
				}).then(()=>{
					this.$nextTick(()=>{
						sessionStorage.setItem('jpdn-client-isLogin',true);
						if( this.config.redirect.name != '' ){
							this.$store.commit('client/setTabbarActive','group');
							this.$router.replace({ name : this.config.redirect.name , params : { productId : this.config.redirect.params } }); 
						}else{
							this.$store.commit('client/setTabbarActive','menu');
							this.$router.push('/client/index/menu');
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
			}
		},
		created(){
			/*if( sessionStorage.getItem('jpdn-client-username') !== null ){
				this.formData.userName = sessionStorage.getItem('jpdn-client-username')
			}*/
			try{
				let loginInfo = JSON.parse(localStorage.getItem("client-loginInfo"));
				if( loginInfo != null ){
					this.formData = loginInfo;
				}
			}catch(err){
				console.log( err )
			}
			sessionStorage.clear();
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
