<template>
	<div>
		<van-nav-bar :title="config.headerTitle" left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft" @click-right="reload" :fixed="true" style="z-index:-1">
			<div slot="right">
				<span class="van-nav-bar__text">刷新</span>
				<van-icon class-prefix="iconfont" name="refresh" size="18" class="van-icon van-icon-arrow-right"/>
			</div>
		</van-nav-bar>
		<div style="margin-top:46px;" class="container">
			<router-view v-if="isRouterAlive" />
			<div style="margin-bottom:50px;"></div>
		</div>
		<van-tabbar v-model="active" @change="onChange">
			<van-tabbar-item icon="home-o" to="/staff/index/menu">首页</van-tabbar-item>
			<van-tabbar-item @click="logout">
				退出
				<van-icon class-prefix="iconfont" name="logout" slot="icon"  size="18"/>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import { NavBar, Tabbar, TabbarItem, Icon, Cell } from 'vant';
	export default{
		components:{
			[NavBar.name]: NavBar,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[Icon.name]: Icon,
			[Cell.name]: Cell,
		},
		data(){
			return {
				isRouterAlive:true,
				config:{
					headerTitle:''
				},
				options:{
					scrollbar :true,
					fade: false ,
					bounce:true,
				},
				active:0,
			};
		},
		methods:{
			onClickLeft(){
				this.$router.go(-1);
			},
			onClickRight(){
				console.log('2');
			},
			onChange( active ){
				console.log(active);
			},
			reload(){
				this.isRouterAlive = false;
				this.$nextTick(()=>{
					this.isRouterAlive = true;
				});
			},
			logout(){
				console.log('logout');
			}
		},
		mounted(){

		},
		created(){
			this.config.headerTitle = this.$store.state.staff.layout.title;
		},
		computed:{
			setTitle(){
				return this.$store.state.staff.layout.title;
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
