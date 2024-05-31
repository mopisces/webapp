<template>
	<div>
		<van-nav-bar 
			:title="title" 
			left-text="返回" 
			left-arrow 
			right-text="刷新"
			:fixed="true" 
			style="z-index:-1"
			@click-left="onClickLeft" 
			@click-right="reload"
		>
		</van-nav-bar>
		
		<div class="karry-context" :style=" 'height: ' + viewH/16 + 'rem;' ">
			<router-view v-if="isRouterAlive" />
		</div>

		<van-tabbar v-model="active">
			<van-tabbar-item icon="home-o" to="/staff/index/menu">首页</van-tabbar-item>
			<van-tabbar-item @click="logout">
				退出
				<van-icon class-prefix="iconfont" name="logout" slot="icon"  size="18"/>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	import { Icon, Dialog, NavBar, Tabbar, TabbarItem } from 'vant'

	export default {
		components: {
			[Icon.name]: Icon,
			[Dialog.name]: Dialog,
			[NavBar.name]: NavBar,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem
		},
		data() {
			return {
				isRouterAlive: true,
			}
		},
		mounted() {
			this.$store.commit('page/setTitle', '内部用户')
			/*设置用户类型 staff、client、admin*/
			this.$store.commit('user/setUserType', 'staff')
			this.checkLogin()
		},
		computed: {
			...window.Vuex.mapGetters({
				title: 'page/title',
				active: 'page/active',
				viewH: 'page/viewH'
			}),
		},
		provide(){
			return {
				reload: this.reload
			}
		},
		methods: {
			/*重新加载*/
			reload(){
				this.isRouterAlive = false;
				this.$nextTick(()=>{
					this.isRouterAlive = true;
				});
			},
			/*退出登录*/
			logout() {
				Dialog.confirm({
					message: '确认退出?'
				}).then(()=>{
					this.$store.dispatch('user/logout')
				}).catch(()=>{
					Dialog.close()
				})
			},
			/*返回上一页*/
			onClickLeft() {
				this.$router.replace( this.$store.state.staff.backPath )
				this.$store.commit('staff/setBackPath', '/staff/index/menu')
			},
			/*检查登录状态*/
			checkLogin() {
				if( !this.$store.getters['user/accessToken'] ) {
					this.$router.replace( '/staff/login' )
				}
			}
		}
	}
</script>

<style type="text/css">
	.karry-context {
		width: 100%;
		background-color: #f1f1f1;
		margin-top: 2.875rem;
		overflow-y: scroll;
	}
</style>