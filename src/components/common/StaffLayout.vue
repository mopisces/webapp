<template>
	<div id="page">
		<div class="header">
			<van-nav-bar 
				:title="title" 
				left-text="返回" 
				right-text="刷新" 
				left-arrow 
				:fixed="true" 
				style="z-index:-1"
				@click-left="onClickLeft" 
				@click-right="reload"
			></van-nav-bar>
		</div>
		<div class="container" :style=" 'min-height:' + viewH/16 + 'rem;background-color: #f1f1f1;margin-bottom: 3.125rem;' ">
			<router-view v-if="isRouterAlive" />
		</div>
		<div class="footer">
			<van-tabbar v-model="active">
				<van-tabbar-item icon="home-o" to="/staff/index/menu">首页</van-tabbar-item>
			</van-tabbar>
		</div>
	</div>
</template>
<script>
	import { Cell, Icon, Dialog, NavBar, Tabbar, TabbarItem } from 'vant';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
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
				
			};
		},
		methods:{
			onClickLeft(){
				this.$router.push( this.$store.state.staff.backPath );
				this.$store.commit('staff/setBackPath','/staff/index/menu');
			},
			reload(){
				this.isRouterAlive = false;
				this.$nextTick(()=>{
					this.isRouterAlive = true;
				});
			},
		},
		async created(){
			await this.$store.commit('client/setHeaderTitle', '首页')
			await this.$store.commit('page/setPageH', (window.innerHeight - 96)/16 )
		},
		computed:{
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
			}),
			title: {
				get() {
					return this.$store.state.staff.layout.title
				},
				set( nVal ) {
					this.$store.commit('staff/headerTitle', nVal)
				}
			},
		},
		provide(){
			return {
				reload: this.reload
			}
		}
	}
</script>
<style>
	#page{
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.header-box{
		height:2.875rem;
		width:100%;
	}

	.footer-box{
		height:3.125rem;
		width:100%;
	}
</style>
<style>
	.container{
		margin-top: 2.875rem;
	}
</style>
	
