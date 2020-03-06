<template>
	<div>
		<van-nav-bar :title="config.headerTitle" left-text="返回" right-text="刷新" left-arrow @click-left="onClickLeft" @click-right="reload" :fixed="true" style="z-index:-1">
			<div slot="right" style="color:#1989fa;">
				刷新
				<van-icon slot="icon" class-prefix="iconfont" name="shuaxin" size="16"/>
			</div>
		</van-nav-bar>
		<div style="height:46px;width:100%;"></div>
		<router-view v-if="isRouterAlive"/>
		<div style="height:50px;width:100%;"></div>
		<van-tabbar v-model="config.active">
			<van-tabbar-item name="sgMenu" to="/sg/menu">
				<van-icon slot="icon" name="wap-home-o"/>
				菜单
			</van-tabbar-item>
			<van-tabbar-item name="sgLogout" to="">
				<van-icon slot="icon" class-prefix="iconfont" name="tuichu" size="18"/>
				退出
			</van-tabbar-item>
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
			[TabbarItem.name]: TabbarItem
		},
		data(){
			return {
				config:{
					headerTitle : '',
					active      : 'sgMenu',
				},
				isRouterAlive : true
			}
		},
		methods:{
			reload(){
				this.isRouterAlive = false;
				this.$nextTick(()=>{
					this.isRouterAlive = true;
				});
			},
			onClickLeft(){
				this.$router.go(-1);
			},
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','首页');
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			setTitle(){
				return this.$store.state.sg.title;
			},
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