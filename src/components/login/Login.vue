<template>
	<div>
		<van-nav-bar :title="config.title"></van-nav-bar>
		<template v-if="formData.stopped == 1">
			<van-field v-model="formData.userName" label="绑定账号" type="text" placeholder="绑定账号" :disabled="config.button.loading"/>
			<van-field v-if="!config.button.loading" v-model="formData.passWord" label="账号密码" type="password" placeholder="密码"/>
			<van-field v-model="formData.fullName" label="姓名" type="text" placeholder="请填写真实名字,方便后台审核" :disabled="config.button.loading"/>
			<van-field v-model="formData.phone" label="手机号码" type="text" placeholder="请填写联系方式" :disabled="config.button.loading"/>
			<van-button type="primary" size="normal" :loading="config.button.loading" :disabled="config.button.loading" loading-text="审核中..." block @click="bindClick()">
				{{ config.button.text }}
			</van-button>
		</template>
		<template v-if=" formData.stopped == 0 ">
			<template v-if=" config.isMulit ">
				<van-cell-group title="请选择账号">
					<van-cell :title="user.UserName" is-link @click=" mulitClick(user) " v-for="(user,key) in config.userInfo" :key="key" />
				</van-cell-group>
			</template>
			<template v-if=" !config.isMulit && config.showSubFact ">
				<van-radio-group v-model="formData.subFacId">
					<van-cell-group title="请选择分厂">
						<van-cell :title="item.title" clickable @click=" formData.subFacId = item.value " v-for="(item,index) in config.radioInfo" :key="index">
							<template slot="right-icon">
								<van-radio :name="item.value" />
							</template>
						</van-cell>
					</van-cell-group>
				</van-radio-group>
				<van-button type="primary" size="normal" block @click="login()">
					登陆
				</van-button>
			</template>
		</template>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Icon, Field, RadioGroup, Radio, NavBar } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[NavBar.name]: NavBar,
		},
		data(){
			return {
				config:{
					title        : '请选择登陆类型',
					isMulit      : false,
					subFacIdShow : false,
					button       : {
						loading : false,
						text    : '提交审核'
					},
					userInfo  : [],
					radioInfo : [],
					showSubFact : false,
					redirect:{
						name:'',
						params:''
					}
				},
				formData:{
					userName : '',
					passWord : '',
					fullName : '',
					phone    : '',
					stopped  : 1,
					subFacId : '',
					userType : ''
				}
			}
		},
		methods:{
			getWxAuth(){
				this.$request.wechat.config.serverInfo().then((res)=>{
					if( res.errorCode == '00000' ){
						console.log(res)
						//window.location.href = 'http://' + res.result.Frp80PortDomain + '/getCode.html?oriDomain=' + res.result.OriDomain + '&backstagePort=' + res.result.OriPort + '&type=auth&token=auth';
					}
				});
			},
			bindClick(){
				let self = this;
				this.$request.wechat.login.bindAccount( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.button.loading = true;
					}
				});
			},
			mulitClick( user ){
				this.formData.userName = user.UserName;
				this.formData.userType = user.UserType;
				if( this.formData.userType == 0 ){
					this.login( 'client' );
				}else{
					if( this.config.radioInfo.length <= 0 ){
						this.login();
						return ;
					}
					this.config.isMulit     = false;
					this.config.showSubFact = true;
				}
				
			},
			getBindInfo(){
				let self = this;
				this.$request.wechat.config.getBindInfo().then((res)=>{
					if( res.errorCode == '00000' ){
						self.formData.userName = res.result.info.UserName ? res.result.info.UserName : '';
						self.formData.fullName = res.result.info.UserFullName ? res.result.info.UserFullName : '';
						self.formData.phone    = res.result.info.TelNo ? res.result.info.TelNo : '';
						self.formData.stopped  = res.result.info.Stopped ? res.result.info.Stopped : 1 ;
						if( self.formData.stopped == 0 ){
							if( res.result.bind_type == 1 && res.result.factory_info.length > 1){
								self.config.radioInfo  = [];
								res.result.factory_info.forEach((item,index)=>{
									self.config.radioInfo.push({
										title:item.SShortName,
										value:item.SubFacId
									});
								});
							}
							self.config.userInfo = res.result.user_info;
							self.config.isMulit  = true;
						}
						
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.selectShow = false;
						if( this.formData.userName && this.formData.fullName && this.formData.phone ){
							this.config.button.loading = true;
						}
					});
				});
			},
			login( type = 'staff' ){
				let self = this;
				this.$request.wechat.login.wxMulitLogin( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						sessionStorage.setItem('jpdn-' + type + '-token',res.result.access_token);
						sessionStorage.setItem('jpdn-' + type + '-refresh',res.result.refresh_token);
						sessionStorage.setItem('jpdn-' + type + '-username',res.result.user_name);
						if( type == 'staff' ){
							self.getAuthName(1);
						}else{
							self.getAuthName();
						}
						
					}
				});
			},
			getAuthName( type = 0 ){
				let self = this;
				this.$request.staff.user.getAuthName().then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					if( type == 0 ){
						sessionStorage.setItem('client-auth-url',JSON.stringify(res.result.available));
						self.$store.dispatch('client/permission',res.result.available);
						self.$router.addRoutes(self.$store.state.client.navList);
					}else{
						sessionStorage.setItem('staff-auth-url',JSON.stringify(res.result.available));
						self.$store.dispatch('staff/permission', res.result.available);
						self.$router.addRoutes(self.$store.state.staff.navList);
					}
				}).then(()=>{
					this.$nextTick(()=>{
						if( type == 0 ){
							sessionStorage.setItem('jpdn-client-isLogin',true);
							if( this.config.redirect.name != '' ){
								this.$store.commit('client/setTabbarActive','group');
								this.$router.replace({ name : this.config.redirect.name , params : { productId : this.config.redirect.params } }); 
							}else{
								this.$store.commit('client/setTabbarActive','menu');
								this.$router.push('/client/index/menu');
							}
						}else{
							this.$router.push('/staff/index/menu');
						}
					});
				});
			}
		},
		created(){
			sessionStorage.clear();
			if( this.$route.query.isAuth == 1 && this.$route.query.openid){
				sessionStorage.setItem('jpdn_webapp_openid',this.$route.query.openid);
				this.getBindInfo();
			}else{
				this.getWxAuth();
			}
		},
		mounted(){

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