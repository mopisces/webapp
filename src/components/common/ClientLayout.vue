<template>
	<div>
		<van-nav-bar :title="config.headerTitle" left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft" @click-right="reload" :fixed="true" style="z-index:-1">
			<div slot="right">
				<span class="van-nav-bar__text">刷新</span>
				<van-icon class-prefix="iconfont" name="refresh" size="18" class="van-icon van-icon-arrow-right"/>
			</div>
		</van-nav-bar>
		<div style="width:100%;height:2.875rem;"></div>
		<div class="container">
			<router-view v-if="isRouterAlive" />
		</div>
		<div style="height:3.125rem;width:100%;"></div> 
		<van-tabbar v-model="active">
			<van-tabbar-item icon="home-o" to="/client/index/menu">首页</van-tabbar-item>
			<van-tabbar-item icon="shopping-cart-o" to="/group/index">团购</van-tabbar-item>
			<van-tabbar-item @click="logout">
				退出
				<van-icon class-prefix="iconfont" name="logout" slot="icon"  size="18"/>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import { Cell, Icon, Dialog, NavBar, Tabbar, TabbarItem } from 'vant';
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
					}
				},
				options:{
					scrollbar :true,
					fade: false ,
					bounce:true,
				},
				active:0,
				userName:'',
			};
		},
		methods:{
			onClickLeft(){
				this.$router.go(-1);
				//this.$router.push( this.$store.state.staff.backPath );
				//this.$store.commit('staff/setBackPath','/staff/index/menu');
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
					this.userName = sessionStorage.getItem('jpdn-client-username');
					sessionStorage.clear();
					sessionStorage.setItem('jpdn-client-username',this.userName);
					this.$router.push('/group/client/login');
				}).catch(()=>{
					Dialog.close();
				});
			}
		},
		created(){
			this.config.headerTitle = this.$store.state.client.layout.title;
		},
		mounted(){

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
		},
		provide(){
			return {
				reload: this.reload
			}
		}
	}
</script>
