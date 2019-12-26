<template>
	<div>
		<div>
			<div style="width:5rem;height:100%;float:left;">
				<van-sidebar v-model="config.sideBar.active">
					<van-sidebar-item title="项目配置" />
					<van-sidebar-item title="图片管理" />
					<van-sidebar-item title="联系方式管理" />
					<van-sidebar-item title="后台用户管理" />
					<van-sidebar-item title="团购纸板管理" />
				</van-sidebar>
			</div>
			<div :style="'height:100%;float:left;width:' + config.style.menuNavWidth + 'rem;'  ">
				<van-cell-group>
					<template v-if=" config.sideBar.active == 0 ">
						<van-cell title="公共" is-link />
						<van-cell title="内部" is-link />
						<van-cell title="外部" is-link />
						<van-cell title="下单" is-link />
						<van-cell title="团购" is-link />
						<van-cell title="支付宝支付" is-link />
					</template>
					<template v-if=" config.sideBar.active == 1 ">
						<van-cell title="厂商logo" is-link />
						<van-cell title="首页图片" is-link />
					</template>
					<template v-if=" config.sideBar.active == 2 ">
						<van-cell title="联系方式列表" is-link />
						<van-cell title="添加联系方式" is-link />
					</template>
					<template v-if=" config.sideBar.active == 3 ">
						<van-cell title="用户列表" is-link to="/admin/user/lists"/>
						<van-cell title="添加用户" is-link />
					</template>
					<template v-if=" config.sideBar.active == 4 ">
						<van-cell title="纸板列表" is-link />
						<van-cell title="添加纸板" is-link />
						<van-cell title="纸板默认图片" is-link />
						<van-cell title="已删除纸板列表" is-link />
					</template>
				</van-cell-group>
			</div>
			<div style="clear:both;"></div>
		</div>
	</div>
</template>
<script>
	import { Cell, CellGroup, Row, Col, Sidebar, SidebarItem } from 'vant';
	export default {
		components:{
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Row.name]: Row,
			[Col.name]: Col,
			[Sidebar.name]: Sidebar,
			[SidebarItem.name]: SidebarItem,
		},
		data(){
			return {
				config:{
					style:{
						menuNavWidth : ''
					},
					sideBar:{
						active : 0
					}
				}
			}
		},
		methods:{
			getWidth(){
				this.config.style.menuNavWidth = (document.body.clientWidth - 80) / 16;
			}
		},
		created(){
			window.addEventListener('resize', this.getWidth);
			this.getWidth()
			this.$store.commit('admin/setHeaderTitle','后台管理菜单');
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			window.removeEventListener('resize', this.getHeight);
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>