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
		<van-tabbar v-model="active">
			<van-tabbar-item name="menu" icon="home-o" to="/client/index/menu">首页</van-tabbar-item>
			<van-tabbar-item name="logout" @click="logout">
				退出
				<van-icon class-prefix="iconfont" name="logout" slot="icon"  size="18"/>
			</van-tabbar-item>
			<van-tabbar-item name="group" icon="shopping-cart-o" to="/group/index">团购</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	/*vant组件*/
	import { Cell, Icon, Dialog, NavBar, Tabbar, TabbarItem } from 'vant'

	export default {
		components:{
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[NavBar.name]: NavBar,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
		},
		data() {
			return {}
		},
		mounted() {
			this.$store.commit('page/setTitle', '外部用户')
		},
		computed: {
			...window.Vuex.mapGetters({
				title: 'page/title',
				active: 'page/active',
				viewH: 'page/viewH'
			}),
		},
	}
</script>