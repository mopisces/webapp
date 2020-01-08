<template>
	<el-row class="tac">
		<el-col :span="4">
			<el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" style="height:100%;">
				<el-menu-item index="1">
					<i class="el-icon-menu"></i>
					<span slot="title">项目配置</span>
				</el-menu-item>
				<el-menu-item index="2">
					<i class="el-icon-menu"></i>
					<span slot="title">图片配置</span>
				</el-menu-item>
				<el-submenu index="3">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>联系方式管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="3-1">联系方式列表</el-menu-item>
						<el-menu-item index="3-2">添加联系方式</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="4">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>后台用户管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="4-1">用户列表</el-menu-item>
						<el-menu-item index="4-2">添加用户</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="5">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>团购纸板管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="5-1">纸板列表</el-menu-item>
						<el-menu-item index="5-2">添加纸板</el-menu-item>
						<el-menu-item index="5-3">纸板默认图片</el-menu-item>
						<el-menu-item index="5-4">已删除纸板列表</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="6">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>团购淘宝箱管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="6-1">淘宝箱列表</el-menu-item>
						<el-menu-item index="6-2">添加淘宝箱</el-menu-item>
						<el-menu-item index="6-3">淘宝箱默认图片</el-menu-item>
						<el-menu-item index="6-4">已删除淘宝箱列表</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-col>
	</el-row>
</template>
<script>
	export default {
		data(){
			return {
				activeIndex2:'2'
			}
		},
		methods:{
			handleOpen(){},
			handleClose(){},
		},
		created(){

		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style>
	.el-menu-vertical-demo:not(.el-menu--collapse){
		height: 100%;
	}
</style>