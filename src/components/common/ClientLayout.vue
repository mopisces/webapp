<template>
	<div>
		<van-nav-bar :title="config.headerTitle" left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft" @click-right="reload" :fixed="true" style="z-index:-1">
			<div slot="right">
				<span class="van-nav-bar__text">刷新</span>
				<van-icon class-prefix="iconfont" name="refresh" size="18" class="van-icon van-icon-arrow-right"/>
			</div>
		</van-nav-bar>
		<!-- <div style="width:100%;height:2.875rem;"></div> -->
		<div class="container" :style=" 'min-height:' + height + 'px;padding-bottom:3.125rem;' ">
			<router-view v-if="isRouterAlive" />
		</div>
		<!-- <div style="height:3.125rem;width:100%;"></div> -->
		<van-tabbar v-model="active">
			<template v-if="!isLogin">
				<van-tabbar-item name="clogin" icon="friends-o" to="/group/client/login">客户登录</van-tabbar-item>
				<van-tabbar-item name="slogin" icon="manager-o" to="/group/staff/login">员工登录</van-tabbar-item>
			</template>
			<template v-else>
				<van-tabbar-item name="menu" icon="home-o" to="/client/index/menu">首页</van-tabbar-item>
				<van-tabbar-item @click="logout">
					退出
					<van-icon class-prefix="iconfont" name="logout" slot="icon"  size="18"/>
				</van-tabbar-item>
			</template>
			<template v-if="config.isOpenGroup">
				<van-tabbar-item name="group" icon="shopping-cart-o" to="/group/index">团购</van-tabbar-item>
			</template>
		</van-tabbar>
	</div>
</template>
<script>
	import { Cell, Icon, Dialog, NavBar, Tabbar, TabbarItem } from 'vant';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	import { clearLogin } from '@/util';
	export default{
		components:{
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[NavBar.name]: NavBar,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
		},
		data(){
			return {
				isRouterAlive:true,
				config:{
					headerTitle:'',
					url:{
						menu: ''
					},
					tabbar:{
						showIndex:false
					},
					isOpenGroup:false
				},
				options:{
					scrollbar :true,
					fade: false ,
					bounce:true,
				},
				active   : '',
				isLogin  : false,
				height : window.innerHeight - 50
			};
		},
		methods:{
			onClickLeft(){
				if( (this.$store.state.client.isLogin || this.$store.state.staff.isLogin) && !this.$store.state.client.backIsGroup ){
					this.$router.push( this.$store.state.client.backPath );
					this.$store.commit('client/setBackPath','/client/index/menu');
				}else{
					this.$router.go(-1);
				}
			},
			reload(){
				this.isRouterAlive = false;
				this.$nextTick(()=>{
					this.isRouterAlive = true;
				});
			},
			logout(){
				Dialog.confirm({
					message: '确认退出?'
				}).then(() => {
					clearLogin();
					/*removeStorage('jpdn-client-token', 'sessionStorage');
					removeStorage('jpdn-client-refresh', 'sessionStorage');
					removeStorage('client-auth-url');
					setStorage('jpdn-client-isLogin', 0, 'sessionStorage');
					this.$store.commit('client/setIsLogin',false);
					this.$store.commit('staff/setIsLogin',false);*/
					this.$router.push('/group/client/login');
					/*if( getStorage('jpdn-login-type') == 'staff' ){
						removeStorage('jpdn-staff-token');
						removeStorage('jpdn-staff-refresh');
						removeStorage('staff-auth-url');
						setStorage('jpdn-staff-isLogin',0);
						this.$store.commit('staff/setIsLogin',false);
						this.$router.push('/group/staff/login');
					}*/
				}).catch(()=>{
					Dialog.close();
				});
			},
			isOpenGroup(){
				let self = this;
				this.$request.staff.login.isOpenGroup().then(res=>{
					if( res.errorCode == '00000' ){
						self.config.isOpenGroup = res.result == 0 ? false : true;
						self.$store.commit('client/setGroupOpen',res.result);
					}
				});
			},

		},
		created(){
			this.config.headerTitle = this.$store.state.client.layout.title;
			if( getStorage('jpdn-login-type') == 'client' ){
				this.isLogin = this.$store.state.client.isLogin;
			}
			if( getStorage('jpdn-login-type') == 'staff' ){
				this.isLogin = this.$store.state.staff.isLogin;
			}
			this.active  = this.$store.state.client.tabbarActive;
		},
		mounted(){
			this.isOpenGroup();
		},
		computed:{
			setTitle(){
				return this.$store.state.client.layout.title;
			},
			setActive(){
				return this.$store.state.client.tabbarActive;
			},
			setIsLogin(){
				return this.$store.state.client.isLogin;
			}
		},
		watch:{
			'setTitle':{
				handler:function(newV,oldV){
					this.config.headerTitle = newV;
				}
			},
			'setActive':{
				handler:function(newV,oldV){
					this.active = newV;
				}
			},
			'setIsLogin':{
				handler:function(newV,oldV){
					this.isLogin = newV;
				}
			}
		},
		provide(){
			return {
				reload: this.reload
			}
		}
	}
</script>
<style>
	.container{
		margin-top: 2.875rem;
	}
</style>
