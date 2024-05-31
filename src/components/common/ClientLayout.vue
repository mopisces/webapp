<template>
	<div>
		<van-nav-bar 
			:title="title" 
			left-text="返回" 
			right-text="刷新" 
			left-arrow 
			:fixed="true" 
			style="z-index:-1"
			@click-left="onClickLeft" 
			@click-right="reload" 
		>
		</van-nav-bar>
		<div class="container" :style=" 'min-height:' + viewH/16 + 'rem;margin-bottom: 3.125rem;' ">
			<router-view v-if="isRouterAlive" />
		</div>
		<van-tabbar v-model="tabbarActive">
			<template v-if="_isOpen == 1">
				<van-tabbar-item name="group" icon="home-o" to="/mall/mall/mall">团购</van-tabbar-item>
			</template>
			<template>
				<van-tabbar-item name="menu" icon="user-o" to="/client/index/menu">我的</van-tabbar-item>
			</template>
		</van-tabbar>
	</div>
</template>
<script>
	import { Cell, Icon, Dialog, NavBar, Tabbar, TabbarItem } from 'vant'
	import { getStorage, setStorage, removeStorage } from '@/util/storage'
	import { clearLogin } from '@/util'
	/*api接口*/
	import { getSF } from '@/api/common/index.js'
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
				isRouterAlive: true,
				config: {
					isOpenGroup: false
				}
			}
		},
		async mounted(){
			await this.isOpenGroup()
		},
		computed:{
			...window.Vuex.mapGetters({
				isLogin: 'client/isLogin',
				viewH: 'page/viewH',
			}),
			title: {
				get() {
					return this.$store.state.client.layout.title
				},
				set( nVal ) {
					this.$store.commit('client/headerTitle', nVal)
				}
			},
			tabbarActive: {
				get() {
					return this.$store.state.client.tabbarActive
				},
				set(nVal) {
					this.$store.commit('client/setTabbarActive', nVal)
				}
			},
			backPath: {
				get() {
					return this.$store.state.client.backPath
				},
				set( nVal ) {
					this.$store.commit('client/setBackPath', nVal)	
				}
			},
			_isOpen() {
				return this.config.isOpenGroup
			}
		},
		provide(){
			return {
				reload: this.reload
			}
		},
		methods:{
			onClickLeft(){
				this.$router.push(this.backPath)
				this.backPath = '/client/index/menu'
			},
			reload(){
				this.isRouterAlive = false
				this.$nextTick(()=>{
					this.isRouterAlive = true
				})
			},
			logout(){
				Dialog.confirm({
					message: '确认退出?'
				}).then(() => {
					clearLogin();
					this.$router.push('/group/client/login');
					this.$store.commit('client/setTabbarActive', 'clogin')
				}).catch(()=>{
					Dialog.close();
				});
			},
			async isOpenGroup(){
				try{
					const { result } = await getSF()
					this.config.isOpenGroup = result.group_open
				} catch(e) {
					this.config.isOpenGroup = 0
				}
				this.$store.commit('client/setGroupOpen', this.config.isOpenGroup)
			},

		},
		
	}
</script>
<style>
	.container{
		margin-top: 2.875rem;
		/* padding-bottom: 3.125rem; */
	}
</style>
