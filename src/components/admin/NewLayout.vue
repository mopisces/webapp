<template>
	<el-container :style="'height: ' + config.height + 'px; border: 1px solid #eee'">
	  	<el-aside width="200px" style="background-color: #f0f0f0">
	    	<el-menu :default-active="config.activeIndex" :router="true">
	    		<el-menu-item index="/new/config/lists">
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
	  	</el-aside>
	  	<el-container>
	    	<el-header style="text-align: right; font-size: 1rem;line-height:3.25rem;">
	      		<div style="float:left;">
					利鹏后台管理系统
				</div>
				<div style="float:right;margin-right: 1rem;">
					<el-dropdown>
						<i class="el-icon-setting" style="margin-right: 1rem"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>查看</el-dropdown-item>
							<el-dropdown-item>新增</el-dropdown-item>
							<el-dropdown-item>删除</el-dropdown-item>
						</el-dropdown-menu>
						<span>王小虎</span>
					</el-dropdown>
				</div>
				<div style="clear:both;"></div>
	    	</el-header>
	    	<el-main style="margin: 0;height: 100%;">
				<router-view></router-view>
	    	</el-main>
		</el-container>
	</el-container>
</template>
<style>
	.el-header {
		background-color: #f0f0f0;
		color: #333;
		line-height: 60px;
	}

	.el-aside {
		color: #333;
	}
</style>

<script>
	export default {
		data(){
			return {
				config:{
					height:'',
					fullscreen : false,
					activeIndex : '/new/config/lists'
				}
			}
		},
		methods:{
			
		},
		created(){
			this.config.height = window.innerHeight;
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
	};
</script>