<template>
	<div>
		<van-nav-bar title="登陆/绑定" ></van-nav-bar>
		<div v-if="config.pageShow">
			<template v-if="formData.stopped == 1">
				<van-field v-model="formData.userName" label="绑定账号" type="text" placeholder="绑定账号" :disabled="config.button.loading"/>
				<van-field v-if="!config.button.loading" v-model="passWord" label="账号密码" type="password" placeholder="密码"/>
				<van-field v-model="formData.fullName" label="姓名" type="text" placeholder="请填写真实名字,方便后台审核" :disabled="config.button.loading"/>
				<van-field v-model="formData.phone" label="手机号码" type="text" placeholder="请填写联系方式" :disabled="config.button.loading"/>
				<van-button type="primary" size="normal" :loading="config.button.loading" :disabled="config.button.loading" loading-text="审核中..." block @click="submitClick()">
					{{ config.button.text }}
				</van-button>
			</template>
			<template v-if=" formData.stopped == 0 && formData.userType == 1 ">
				<van-radio-group v-model="radio">
					<van-cell-group>
						<van-cell :title="item.title" clickable @click="formData.subFacId = item.value " v-for="(item,index) in config.radioInfo" :index="index">
							<template slot="right-icon">
								<van-radio :name="item.value" />
							</template>
						</van-cell>
					</van-cell-group>
				</van-radio-group>
				<van-button type="primary" size="normal" block @click="onLogin">
					登陆
				</van-button>
			</template>
		</div>
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
					button:{
						loading : false,
						text    : '提交审核'
					},
					radioInfo:[],
					pageShow:false,
					redirect:{
						name   : '',
						params : ''
					}
				},
				formData:{
					userName : '',
					passWord : '',
					fullName : '',
					phone    : '',
					userType : '',
					subFacId : '',
					stopped  : 1
				},
				radio:'1'
			}
		},
		methods:{
			getWxAuth(){
				window.location.href = 'http://luodangfrp2.leaper.ltd/getCode.html?token=123&oriDomain=test.leaper.ltd&backstagePort=1110&type=auth';
			},
			getInfo(){

			},
			submitClick(){
				let self = this;
				this.$request.wechat.login.bindAccount( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.button.loading = true;
					}
				});
			},
			init(){
				//let openid = localStorage.getItem('jpdn_webapp_openid');
				let openid = sessionStorage.getItem('jpdn_webapp_openid');
				if( openid ){
					let self = this;
					this.$request.wechat.login.checkUserInfo( openid ).then(res=>{
						self.formData.userName = res.result.UserName;
						self.formData.fullName = res.result.UserFullName;
						self.formData.phone    = res.result.TelNo;
						self.formData.userType = res.result.UserType;
						self.formData.stopped  = res.result.Stopped;
						if( res.result.Stopped == '1' && res.result.UserName){
							self.config.button.loading = true;
						}else if( res.result.UserType == '1' ){
							res.result.factory_info.forEach((item,index)=>{
								self.config.radioInfo.push({
									title:item.SShortName,
									value:item.SubFacId
								});
							})
						}else if( res.result.UserType == '0' ){
							sessionStorage.setItem('jpdn-client-token',res.result.token_info.access_token);
							sessionStorage.setItem('jpdn-client-refresh',res.result.token_info.refresh_token);
							sessionStorage.setItem('jpdn-client-username',res.result.token_info.user_name);
							self.getAuthName();
						}
					}).then(()=>{
						this.$nextTick(()=>{
							this.config.pageShow = true;
						});
					});
				}
			},
			getAuthName( ){
				let self = this;
				this.$request.staff.user.getAuthName().then(res=>{
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
		},
		created(){
			/*this.init();
			return ;*/
			if( this.$route.query.isAuth == 1 && this.$route.query.openid){
				sessionStorage.setItem('jpdn_webapp_openid',this.$route.query.openid);
				this.init();
			}else{
				window.location.href = 'http://luodangfrp2.leaper.ltd/getCode.html?token=123&oriDomain=test.leaper.ltd&backstagePort=1110&type=auth';
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