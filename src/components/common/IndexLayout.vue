<template>
	<div>
		<van-nav-bar :title="config.headerTitle" :fixed="true" left-text="返回" left-arrow @click-left="goBack()" @click-right="reload()">
			<div slot="right">
				<span class="van-nav-bar__text">刷新</span>
				<van-icon class-prefix="iconfont" name="refresh" size="18" class="van-icon van-icon-arrow-right"/>
			</div>
		</van-nav-bar>
		<div style="height:46px;width:100%;"></div>
		<router-view v-if="isRouterAlive"/>
		<div style="height:50px;width:100%;"></div>
		<van-tabbar v-model="config.active">
			<van-tabbar-item icon="shopping-cart-o" to="/group/index">团购</van-tabbar-item>
			<van-tabbar-item icon="friends-o" to="/group/login">登录</van-tabbar-item>
			<van-tabbar-item icon="service" to="/group/contact">联系我们</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import { Icon, NavBar, Tabbar, TabbarItem } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[NavBar.name]: NavBar,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
		},
		data(){
			return {
				config:{
					headerTitle : '',
					active : 0,
				},
				isRouterAlive : true,
			}
		},
		methods:{
			goBack(){
				this.$router.go(-1);
			},
			reload(){
				this.isRouterAlive = false;
				this.$nextTick(()=>{
					this.isRouterAlive = true;
				});
			}
		},
		created(){
			this.config.headerTitle = this.$store.state.client.layout.title;
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			setTitle(){
				return this.$store.state.client.layout.title;
			}
		},
		watch:{
			'setTitle':{
				handler:function(newV,oldV){
					this.config.headerTitle = newV;
				}
			}
		}
	}
</script>