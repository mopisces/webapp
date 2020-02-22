<template>
	<div class="login-container">
		<el-form :model="formData" :rules="rules" status-icon ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-page">
			<h3 class="title">后台系统登录</h3>
			<el-form-item prop="adminName">
				<el-input type="text" v-model="formData.adminName" auto-complete="off" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item prop="adminPass">
				<el-input type="password" v-model="formData.adminPass" auto-complete="off" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item style="width:100%;">
				<el-button type="primary" style="width:100%;" @click="handleSubmit">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config: {
					loading:false
				},
				formData:{
					adminName : '',
					adminPass : ''
				},
				rules : {
					adminName : [
						{ required:true, message:'请输入账号', trigger:'blur' }
					],
					adminPass : [
						{ required:true, message:'请输入密码', trigger:'blur' }
					]
				}
			}
		},
		methods:{
			handleSubmit(){
				this.$refs['loginForm'].validate((valid)=>{
					if( valid ){
						this.login( this.formData );
					}else{
						return false;
					}
				});
			},
			login( data ){
				let self = this;
				this.$request.admin.login.login( data ).then((res)=>{
					if( res.errorCode == '00000' ){
						sessionStorage.setItem('jpdn-admin-token',res.result.access_token);
						sessionStorage.setItem('jpdn-admin-refresh',res.result.refresh_token);
						sessionStorage.setItem('jpdn-admin-username',self.formData.adminName);
						self.$router.push('/admin/config/lists');
					}
				});
			}
		},
		created(){
			this.$store.commit('common/setType','admin');
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
<style scoped>
.login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    -webkit-border-radius: 0.3125rem;
    border-radius: 0.3125rem;
    margin: 11.25rem auto;
    width: 22rem;
    padding: 2.1875rem 2.1875rem 1rem;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>