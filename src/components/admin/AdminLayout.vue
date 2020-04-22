<template>
	<el-container :style="'height: ' + config.height + 'px; border: 1px solid #eee'">
	  	<el-aside width="200px" style="background-color: #f0f0f0">
	    	<el-menu :default-active="config.activeIndex" :router="true" :unique-opened="true" @open="menuOpen" @select="menuSelect">
	    		<el-menu-item index="/admin/config/lists">
					<i class="el-icon-setting"></i>
					<span slot="title">项目配置</span>
				</el-menu-item>
				<el-menu-item index="/admin/img/info">
					<i class="el-icon-picture"></i>
					<span slot="title">图片配置</span>
				</el-menu-item>
				<el-submenu index="3">
					<template slot="title">
						<i class="el-icon-phone"></i>
						<span>联系方式管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/admin/contact/lists">联系方式列表</el-menu-item>
						<el-menu-item index="/admin/contact/add">添加联系方式</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="4">
					<template slot="title">
						<i class="el-icon-s-custom"></i>
						<span>后台用户管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/admin/user/lists">用户列表</el-menu-item>
						<el-menu-item index="/admin/user/add">添加用户</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="5" v-if="boardGroup">
					<template slot="title">
						<i class="el-icon-document"></i>
						<span>团购纸板管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/admin/board/lists">纸板列表</el-menu-item>
						<el-menu-item index="/admin/board/add">添加纸板</el-menu-item>
						<el-menu-item index="/admin/board/defpic">纸板默认图片</el-menu-item>
						<el-menu-item index="/admin/board/del">已删除纸板列表</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="6" v-if="boxGroup">
					<template slot="title">
						<i class="el-icon-box"></i>
						<span>团购淘宝箱管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/admin/box/lists">淘宝箱列表</el-menu-item>
						<el-menu-item index="/admin/box/add">添加淘宝箱</el-menu-item>
						<el-menu-item index="/admin/box/defpic">淘宝箱默认图片</el-menu-item>
						<el-menu-item index="/admin/box/del">已删除淘宝箱列表</el-menu-item>
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
					<el-dropdown @command="command()">
						<i class="el-icon-setting" style="margin-right: 1rem"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="logout">退出</el-dropdown-item>
						</el-dropdown-menu>
						<span>{{ adminName }}</span>
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
					activeIndex : ''
				},
				adminName  : '',
				boardGroup : false,
				boxGroup   : false
			}
		},
		methods:{
			command( command ){
				sessionStorage.removeItem('jpdn-admin-token');
				sessionStorage.removeItem('jpdn-admin-refresh');
				sessionStorage.removeItem('jpdn-admin-username');
				this.$router.push('/admin/login');
			},
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					if( res.errorCode == '00000' ){
						self.boardGroup = res.result.UseBoardGroup == '0' ? false : true;
						self.boxGroup   = res.result.UseBoxGroup == '0' ? false : true;
					}
				});
			},
			menuOpen(key, keyPath){
				this.getConfig();
			},
			menuSelect(key, keyPath){
				this.getConfig();
			}
		},
		created(){
			this.config.height      = window.innerHeight;
			this.adminName          = sessionStorage.getItem('jpdn-admin-username');
			this.config.activeIndex = this.$store.state.admin.asideActive;
			this.getConfig();
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