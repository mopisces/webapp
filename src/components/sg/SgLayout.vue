<template>
	<div>
		<van-nav-bar :title="config.headerTitle" left-text="返回" right-text="刷新" left-arrow @click-left="onClickLeft" @click-right="reload" :fixed="true" style="z-index:-1">
			<div slot="right" style="color:#1989fa;">
				刷新
				<van-icon slot="icon" class-prefix="iconfont" name="shuaxin" size="16"/>
			</div>
		</van-nav-bar>
		<div style="height:2.875rem;width:100%;"></div>
		<router-view v-if="isRouterAlive"/>
		<div style="height:3.125rem;width:100%;"></div>
		<van-tabbar v-model="config.active">
			<van-tabbar-item name="monitor" to="/sg/monitor/websocket">
				<van-icon slot="icon" class-prefix="iconfont" name="shexiangtou" size="18"/>
				生管监控
			</van-tabbar-item>
			<van-tabbar-item name="bl" to="/sg/select/bl">
				<van-icon slot="icon" name="points" size="18"/>
				备料
			</van-tabbar-item>
			<van-tabbar-item name="blms" to="/sg/select/blms">
				<van-icon slot="icon" class-prefix="iconfont" name="sousuo" size="18" />
				备料米数
			</van-tabbar-item>
			<van-tabbar-item name="scdd" to="/sg/select/scdd">
				<van-icon slot="icon" name="records" size="18" />
				生产订单
			</van-tabbar-item>
			<van-tabbar-item name="wgdd" to="/sg/select/wgdd">
				<van-icon slot="icon" name="completed"/>
				完工订单
			</van-tabbar-item>
			<van-tabbar-item name="sgLogout" @click="logout">
				<van-icon slot="icon" class-prefix="iconfont" name="tuichu" size="18"/>
				退出
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import { Icon, Dialog, NavBar, Tabbar, TabbarItem } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Dialog.name]: Dialog,
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
			logout(){
				Dialog.confirm({
					message: '确认退出?'
				}).then(() => {
					sessionStorage.clear();
					this.$router.push('/sg/login');
				}).catch(()=>{
					Dialog.close();
				});
			}
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
			setTabbar(){
				return this.$store.state.sg.tabbar;
			}
		},
		watch:{
			'setTitle':{
				handler:function(newV,oldV){
					this.config.headerTitle = newV;
				}
			},
			'setTabbar':{
				handler:function(newV,oldV){
					this.config.active = newV;
				}
			}
		}
	}
</script>