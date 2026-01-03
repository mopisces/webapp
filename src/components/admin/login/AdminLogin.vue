<template>
	<div class="login-container" :style="'background-image: url('+config.bgImg+');background-size: cover;background-repeat: no-repeat;'">
		<div class="login-page">
			<el-form :model="formData" :rules="rules" status-icon ref="loginForm" label-position="left">
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
		
	</div>
</template>
<script>
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	/*api接口*/
	import { getSF } from '@/api/common/index.js'
	export default {
		data(){
			return {
				config: {
					loading: false,
					bgImg: null
				},
				formData:{
					adminName: '',
					adminPass: ''
				},
				rules : {
					adminName: [
						{ required:true, message:'请输入账号', trigger:'blur' }
					],
					adminPass: [
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
						this.$store.commit('user/setAccessToken', res.result.access_token)
						this.$store.commit('user/setUserType', 'admin')
						this.$store.commit('user/setUserInfo', {adminName: this.formData.adminName})
						this.$store.commit('user/setAuthMap', ['全部'])

						setStorage('jpdn-admin-token',res.result.access_token, 'sessionStorage')
						setStorage('jpdn-admin-refresh',res.result.refresh_token,  'sessionStorage')
						setStorage('jpdn-admin-username',self.formData.adminName)
						setStorage('jpdn-login-type','admin')

						self.$router.push('/admin/config/lists');
					}
				});
			},
			async getConfig() {
				const { result } = await getSF()
				this.config.bgImg = result.admin_login_bg
			}
		},
		created(){
			this.$store.commit('common/setType','admin');
			//removeStorage()
			//sessionStorage.clear();
		},
		async mounted(){
			await this.getConfig()
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
    height: 100vh;
    display: flex;  
    justify-content: center;  
    align-items: center;
}
.login-page {
	width: 50%;
	height: 18rem;
    -webkit-border-radius: 0.3125rem;
    border-radius: 0.3125rem;
    padding: 1rem;
    width: 22rem;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>